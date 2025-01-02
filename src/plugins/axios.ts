import axios from 'axios'
import { errorResponseHandler, errorResponseRejectHandler } from './axiosErrorsHanding'
import MockAdapter from 'axios-mock-adapter'

const axiosIns = axios.create({
  // baseURL: 'https://some-domain.com/api/',
})

const mock = new MockAdapter(axiosIns, { delayResponse: 2000, onNoMatch: 'throwException' })
const STORAGE_KEY = 'bills'

// Initialize localStorage with mock data if empty
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
}

mock.onPost('/api/login').reply((config) => {
  const { email, password } = JSON.parse(config.data)
  if (email === 'user@example.com' && password === 'password') {
    return [200, { token: 'mock-jwt-token' }]
  }
  return [401, { message: 'Invalid credentials' }]
})

mock.onGet('/api/bills').reply((config) => {
  const bills = JSON.parse(localStorage.getItem(STORAGE_KEY))

  const {
    page = 1,
    perPage = 10,
    paidStatus,
    billStatus,
    receivingStation,
    issuingDateStart,
    issuingDateEnd,
    executionDateStart,
    executionDateEnd,
  } = config.params

  // Apply filters
  let filteredBills = bills.filter((bill) => {
    const matchPaidStatus = !paidStatus || bill.paidStatus === paidStatus
    const matchBillStatus = !billStatus || bill.billStatus === billStatus
    const matchStation = !receivingStation || bill.receivingStation === receivingStation

    const issuingDate = new Date(bill.issuingDate)
    const executionDate = new Date(bill.executionDate)

    const matchIssuingDate =
      (!issuingDateStart || issuingDate >= new Date(issuingDateStart)) &&
      (!issuingDateEnd || issuingDate <= new Date(issuingDateEnd))

    const matchExecutionDate =
      (!executionDateStart || executionDate >= new Date(executionDateStart)) &&
      (!executionDateEnd || executionDate <= new Date(executionDateEnd))

    return (
      matchPaidStatus && matchBillStatus && matchStation && matchIssuingDate && matchExecutionDate
    )
  })

  const start = (page - 1) * perPage
  const paginatedBills = filteredBills.slice(start, start + perPage)

  const response = {
    items: paginatedBills,
    totalCount: filteredBills.length,
    totalPaidAmount: filteredBills.reduce(
      (sum, bill) => (bill.paidStatus === 'paid' ? sum + Number(bill.amount) : sum),
      0,
    ),
    totalUnpaidAmount: filteredBills.reduce(
      (sum, bill) => (bill.paidStatus === 'unpaid' ? sum + Number(bill.amount) : sum),
      0,
    ),
    executedCount: filteredBills.filter((bill) => bill.billStatus === 'executed').length,
    pendingCount: filteredBills.filter((bill) => bill.billStatus === 'pending').length,
  }

  return [200, response]
})

// add get bill by id

mock.onGet(/\/api\/bills\/\d+/).reply((config) => {
  const bills = JSON.parse(localStorage.getItem(STORAGE_KEY))
  const id = parseInt(config.url.split('/').pop())
  const bill = bills.find((bill) => bill.id === id)
  if (bill) return [200, bill]
  return [404]
})

mock.onPost('/api/bills').reply((config) => {
  const bills = JSON.parse(localStorage.getItem(STORAGE_KEY))
  const newBill = { ...JSON.parse(config.data), id: bills.length + 1 }
  bills.push(newBill)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))
  return [201, newBill]
})

mock.onPut(/\/api\/bills\/\d+/).reply((config) => {
  const bills = JSON.parse(localStorage.getItem(STORAGE_KEY))
  const id = parseInt(config.url.split('/').pop())
  const updatedBill = JSON.parse(config.data)
  const index = bills.findIndex((bill) => bill.id === id)

  if (index !== -1) {
    bills[index] = { ...updatedBill, id }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))
    return [200, bills[index]]
  }
  return [404]
})

mock.onDelete(/\/api\/bills\/\d+/).reply((config) => {
  const bills = JSON.parse(localStorage.getItem(STORAGE_KEY))
  const id = parseInt(config.url.split('/').pop())
  const index = bills.findIndex((bill) => bill.id === id)

  if (index !== -1) {
    bills.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))
    return [200]
  }
  return [404]
})

axiosIns.interceptors.request.use(onEachRequest, onEachRequestRejected)
axiosIns.interceptors.response.use(errorResponseHandler, errorResponseRejectHandler)
function onEachRequest(request: any) {
  setAccessTokenInHeader(request)

  return request
}

function onEachRequestRejected(error: unknown) {
  return Promise.reject(error)
}

function setAccessTokenInHeader(request: any) {
  let accessToken = ''
  try {
    accessToken = JSON.parse(localStorage.getItem('accessToken') as string)
  } catch (error) {}

  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`
  else request.headers.Authorization = null
}

export { mock }
export default axiosIns
