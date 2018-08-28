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
    if (diffDate === 1) {
      return this.budgets[startMonth] / startDate.daysInMonth()
    } else if (startMonth === endMonth) {
      return this.getDaysBudget(startMonth, diffDate)
    } else {
      let sumBudget = 0
      const totaStartlLeftDays = moment(startMonth + startDate.daysInMonth()).diff(startDate, 'Days')
      sumBudget += this.getDaysBudget(startMonth, totaStartlLeftDays) +
        this.getDaysBudget(endMonth, endDate.days())
      console.log('initi sumBudget' , sumBudget)
      const diffMonth = endDate.diff(startDate, 'months')
      if (diffMonth >= 2) {
        console.log('diffMonth', diffMonth)
        for (let i = startDate.month() + 2; i < endDate.month() + 1; i++) {
          const monthTotalBudget = this.budgets[moment([startDate.year(), i - 1]).format('YYYYMM')]
          sumBudget += monthTotalBudget
          console.log('monthTotalBudget', monthTotalBudget)
        }
      }
      return sumBudget
    }
  }
  getDaysBudget(monthString, days) {
    const monthTotalDays = moment(monthString).daysInMonth()
    return this.budgets[monthString] / monthTotalDays * days
  }
}

module.exports = BudgetService
