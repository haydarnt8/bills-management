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
  try {
    const { email, password } = JSON.parse(config.data)
    if (email === 'user@example.com' && password === 'password') {
      return [200, { token: 'mock-jwt-token' }]
    }
    return [401, { message: 'Invalid credentials' }]
  } catch (error) {
    return [500, { error: 'Internal server error' }]
  }
})

// Helper function to safely parse JSON with error handling
const safeJsonParse = (data, fallback = []) => {
  try {
    return JSON.parse(data) || fallback
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return fallback
  }
}

// Helper function to safely handle date comparisons
const isDateInRange = (
  dateStr: string | null,
  startDate: string | null,
  endDate: string | null,
): boolean => {
  if (!dateStr) return true

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return false

  if (startDate && new Date(startDate) > date) return false
  if (endDate && new Date(endDate) < date) return false

  return true
}

mock.onGet('/api/bills').reply((config) => {
  try {
    const bills = safeJsonParse(localStorage.getItem(STORAGE_KEY), [])

    const {
      page = 1,
      perPage = 10,
      billNumber,
      paidStatus,
      billStatus,
      receivingStation,
      issuingDateStart,
      issuingDateEnd,
      executionDateStart,
      executionDateEnd,
    } = config.params || {}

    // Validate pagination parameters
    const validPage = Math.max(1, parseInt(page) || 1)
    const validPerPage = Math.max(1, Math.min(100, parseInt(perPage) || 10))

    // Apply filters with null checks
    const filteredBills = bills.filter((bill) => {
      if (!bill) return false // Skip invalid bills

      const matchBillNumber =
        !billNumber ||
        (bill.billNumber && bill.billNumber.toLowerCase().includes(billNumber.toLowerCase()))
      const matchPaidStatus = !paidStatus || bill.paidStatus === paidStatus
      const matchBillStatus = !billStatus || bill.billStatus === billStatus
      const matchStation =
        !receivingStation ||
        (bill.receivingStation &&
          bill.receivingStation.toLowerCase().includes(receivingStation.toLowerCase()))

      const matchIssuingDate = isDateInRange(bill.issuingDate, issuingDateStart, issuingDateEnd)
      const matchExecutionDate = isDateInRange(
        bill.executionDate,
        executionDateStart,
        executionDateEnd,
      )

      return (
        matchBillNumber &&
        matchPaidStatus &&
        matchBillStatus &&
        matchStation &&
        matchIssuingDate &&
        matchExecutionDate
      )
    })

    // Calculate pagination
    const start = (validPage - 1) * validPerPage
    const paginatedBills = filteredBills.slice(start, start + validPerPage)

    // Calculate totals with safe number conversion
    const response = {
      items: paginatedBills,
      totalCount: filteredBills.length,
      totalPaidAmount: bills.reduce(
        (sum, bill) => (bill.paidStatus === 'paid' ? sum + (Number(bill.amount) || 0) : sum),
        0,
      ),
      totalUnpaidAmount: bills.reduce(
        (sum, bill) => (bill.paidStatus === 'unpaid' ? sum + (Number(bill.amount) || 0) : sum),
        0,
      ),
      executedCount: bills.filter((bill) => bill.billStatus === 'executed').length,
      pendingCount: bills.filter((bill) => bill.billStatus === 'pending').length,
      currentPage: validPage,
      totalPages: Math.ceil(bills.length / validPerPage),
    }

    return [200, response]
  } catch (error) {
    console.error('Error in GET /api/bills:', error)
    return [500, { error: 'Internal server error' }]
  }
})

mock.onGet(/\/api\/bills\/\d+/).reply((config) => {
  try {
    const bills = safeJsonParse(localStorage.getItem(STORAGE_KEY), [])
    const id = parseInt(config.url.split('/').pop())

    if (isNaN(id)) {
      return [400, { error: 'Invalid ID format' }]
    }

    const bill = bills.find((bill) => bill && bill.id === id)
    return bill ? [200, bill] : [404, { error: 'Bill not found' }]
  } catch (error) {
    console.error('Error in GET /api/bills/:id:', error)
    return [500, { error: 'Internal server error' }]
  }
})

mock.onPost('/api/bills').reply((config) => {
  const toastStore = useToastStore()
  try {
    const bills = safeJsonParse(localStorage.getItem(STORAGE_KEY), [])
    const billData = safeJsonParse(config.data)

    if (!billData) {
      return [400, { error: 'Invalid bill data' }]
    }

    // Generate a unique ID
    const maxId = bills.reduce((max, bill) => Math.max(max, bill?.id || 0), 0)
    const newBill = { ...billData, id: maxId + 1 }

    bills.push(newBill)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))

    toastStore.addToast({
      message: 'Bill created successfully',
      type: 'success',
    })
    return [201, newBill]
  } catch (error) {
    console.error('Error in POST /api/bills:', error)
    return [500, { error: 'Internal server error' }]
  }
})

mock.onPut(/\/api\/bills\/\d+/).reply((config) => {
  const toastStore = useToastStore()
  try {
    const bills = safeJsonParse(localStorage.getItem(STORAGE_KEY), [])
    const id = parseInt(config.url.split('/').pop())

    if (isNaN(id)) {
      return [400, { error: 'Invalid ID format' }]
    }

    const updatedBill = safeJsonParse(config.data)
    if (!updatedBill) {
      return [400, { error: 'Invalid bill data' }]
    }

    const index = bills.findIndex((bill) => bill && bill.id === id)
    if (index === -1) {
      return [404, { error: 'Bill not found' }]
    }

    bills[index] = { ...updatedBill, id }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))

    toastStore.addToast({
      message: 'Bill updated successfully',
      type: 'success',
    })

    return [200, bills[index]]
  } catch (error) {
    console.error('Error in PUT /api/bills/:id:', error)
    return [500, { error: 'Internal server error' }]
  }
})

mock.onDelete(/\/api\/bills\/\d+/).reply((config) => {
  const toastStore = useToastStore()
  try {
    const bills = safeJsonParse(localStorage.getItem(STORAGE_KEY), [])
    const id = parseInt(config.url.split('/').pop())

    if (isNaN(id)) {
      return [400, { error: 'Invalid ID format' }]
    }

    const index = bills.findIndex((bill) => bill && bill.id === id)
    if (index === -1) {
      return [404, { error: 'Bill not found' }]
    }

    bills.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))

    toastStore.addToast({
      message: 'Bill deleted successfully',
      type: 'success',
    })

    return [200, { message: 'Bill deleted successfully' }]
  } catch (error) {
    console.error('Error in DELETE /api/bills/:id:', error)
    return [500, { error: 'Internal server error' }]
  }
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
