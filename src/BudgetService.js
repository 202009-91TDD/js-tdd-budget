const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    if (startDate.format('YYYYMM') === endDate.format('YYYYMM')) {
        return getDailyAmount(budgets, startDate) * (endDate.diff(startDate, 'days') + 1)
    } else {
        let sumBudget = 0
        sumBudget += getDailyAmount(budgets, startDate) * (moment(startDate).endOf('month').diff(startDate, 'Days') + 1)
        sumBudget += getDailyAmount(budgets, endDate) * (endDate.diff(moment(endDate).startOf('month'), 'Days') + 1)
        if (endDate.diff(startDate, 'months') >= 2) {
            for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
                sumBudget += getDailyAmount(budgets, m) * (moment(m).endOf('month').diff(moment(m).startOf('month'), 'Days') + 1)
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
