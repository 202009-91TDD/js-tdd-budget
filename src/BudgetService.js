class BudgetService {
  constructor(db) {
    if (!db) {
      throw new Error('No DB.')
    }
    this.budgets = db.getAll()
  }

  queryBudget(startDate, endDate) {
    if (endDate - startDate < 0) {
      return 0
    }

    let startYearMonth = startDate.month(1).format('YYYYMM')
    let endYearMonth = endDate.month(1).format('YYYYMM')

    if (startYearMonth === endYearMonth) {
      return this.budgets[startYearMonth] / startDate.daysInMonth()
    }

    return 0
  }
}

module.exports = BudgetService
