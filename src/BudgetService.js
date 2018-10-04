const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {

    const diffDate = endDate.diff(startDate, 'days') + 1

    if (startDate.format('YYYYMM') === endDate.format('YYYYMM')) {
        return getDailyAmount(budgets, startDate) * diffDate
    } else {
        let sumBudget = 0
        const totalStartLeftDays = moment(startDate).endOf('month').diff(startDate, 'Days') + 1
        sumBudget += getDailyAmount(budgets, startDate) * totalStartLeftDays
        sumBudget += getDailyAmount(budgets, endDate) * endDate.date()
        if (endDate.diff(startDate, 'months') >= 2) {
            for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
                sumBudget += budgets[moment(m).format('YYYYMM')] ? budgets[moment(m).format('YYYYMM')] : 0
            }
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

module.exports = queryBudget
