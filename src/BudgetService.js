const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    if (startDate.format('YYYYMM') === endDate.format('YYYYMM')) {
        return getDailyAmount(getBudget(budgets, startDate)) * getDayCount(startDate, endDate)
    } else {
        let sumBudget = 0
        sumBudget += getDailyAmount(getBudget(budgets, startDate)) * getDayCount(startDate, moment(startDate).endOf('month'))
        sumBudget += getDailyAmount(getBudget(budgets, endDate)) * getDayCount(moment(endDate).startOf('month'), endDate)
        for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
            sumBudget += getDailyAmount(getBudget(budgets, m)) * getDayCount(moment(m).startOf('month'), moment(m).endOf('month'))
        }
        return sumBudget
    }
}

const getBudget = (budgets, dateInBudget) => {
    const amount = budgets[dateInBudget.format('YYYYMM')];
    if (amount) {
        return { amount, month: dateInBudget}
    } else {
        return { amount: 0, month: dateInBudget}
    }
}

const getDailyAmount = (budget) => {
    return budget.amount / budget.month.daysInMonth()
}

const getDayCount = (startDate, endDate) => endDate.diff(startDate, 'days') + 1

module.exports = queryBudget
