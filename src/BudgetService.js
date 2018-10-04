const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    if (startDate.format('YYYYMM') === endDate.format('YYYYMM')) {
        return getDailyAmount(budgets, startDate) * getDayCount(startDate, endDate)
    } else {
        let sumBudget = 0
        sumBudget += getDailyAmount(budgets, startDate) * getDayCount(startDate, moment(startDate).endOf('month'))
        sumBudget += getDailyAmount(budgets, endDate) * getDayCount(moment(endDate).startOf('month'), endDate)
        for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
            sumBudget += getDailyAmount(budgets, m) * getDayCount(moment(m).startOf('month'), moment(m).endOf('month'))
        }
        return sumBudget
    }
}

const getDailyAmount = (budgets, dateInBudget) => {
    const budget = budgets[dateInBudget.format('YYYYMM')];
    if (budget) {
        return budget / dateInBudget.daysInMonth()
    } else {
        return 0
    }
}

const getDayCount = (startDate, endDate) => endDate.diff(startDate, 'days') + 1

module.exports = queryBudget
