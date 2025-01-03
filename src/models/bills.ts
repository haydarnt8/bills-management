export interface Bills {
  id?: string
  billNumber: string
  receiver: string
  amount: string
  paidStatus: string
  billStatus: string
  issuingDate: string
  executionDate: string
  receivingStation: string
  transactions: Transaction[] | []
}

export interface Transaction {
  amount: string
  paymentDate: string
}

export interface Statistics {
  totalPaidAmount: number
  totalUnpaidAmount: number
  executed: number
  pending: number
}

export interface BillsFilterType {
  billNumber: string
  paidStatus: string
  billStatus: string
  receivingStation: string
  issuingDateStart: string
  issuingDateEnd: string
  executionDateStart: string
  executionDateEnd: string
}
