const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    if (startDate.format('YYYYMM') === endDate.format('YYYYMM')) {
        return getDailyAmount(getBudget(budgets, startDate)) * getDayCount(startDate, endDate)
    } else {
        let sumBudget = 0

        const firstBudget = getBudget(budgets, startDate);
        sumBudget += getDailyAmount(firstBudget) * getDayCount(startDate, getEndDate(firstBudget))
        const lastBudget = getBudget(budgets, endDate);
        sumBudget += getDailyAmount(lastBudget) * getDayCount(getStartDate(lastBudget), endDate)
        for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
            const budget = getBudget(budgets, m);
            sumBudget += getDailyAmount(budget) * getDayCount(getStartDate(budget), getEndDate(budget))
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

const getDailyAmount = budget => budget.amount / budget.month.daysInMonth()

const getDayCount = (startDate, endDate) => endDate.diff(startDate, 'days') + 1

const getEndDate = budget => moment(budget.month).endOf('month')

const getStartDate = budget => moment(budget.month).startOf('month')

module.exports = queryBudget
