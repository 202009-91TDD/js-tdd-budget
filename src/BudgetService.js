const moment = require('moment')
class BudgetService {
  constructor(db) {
    if (!db) {
      throw new Error('No DB.')
    }
    this.budgets = db.getAll()
  }

  queryBudget(startDate, endDate) {

    const diffDate = endDate.diff(startDate, 'days') + 1
    if (diffDate < 1) {
      return 0
    }

    const startMonth = startDate.format('YYYYMM')
    const endMonth = endDate.format('YYYYMM')
    if (startMonth === endMonth) {
      return this.getDaysBudget(startMonth, diffDate)
    } else {
      let sumBudget = 0
      const totaStartlLeftDays = moment(startMonth + startDate.daysInMonth()).diff(startDate, 'Days') + 1
      const startMonthBudget = this.getDaysBudget(startMonth, totaStartlLeftDays);
      sumBudget += startMonthBudget;
      const endMonthBudget = this.getDaysBudget(endMonth, endDate.date());
      sumBudget += endMonthBudget;
      const diffMonth = endDate.diff(startDate, 'months')
      if (diffMonth >= 2) {
        const startInternalMonth = startDate.month() + 2
        const endInternalMonth = endDate.month() + 1
        for (let i = startInternalMonth; i < endInternalMonth; i++) {
          const monthString = moment([startDate.year(), i - 1]).format('YYYYMM')
          const monthBudget = this.budgets[monthString]
          sumBudget += monthBudget
        }
      }
      return sumBudget
    }
  }

  getDaysBudget(monthString, days) {
    const monthTotalDays = moment(monthString, 'YYYYMM').daysInMonth()
    return this.budgets[monthString] / monthTotalDays * days
  }
}

module.exports = BudgetService
