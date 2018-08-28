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
        for (var m = moment(startDate).add(1, 'M'); m.isBefore(moment(endDate).add(-1, 'M')); m.add(1, 'months')) {
          sumBudget += this.budgets[moment(m).format('YYYYMM')]
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
