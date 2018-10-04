const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    const period = {startDate, endDate};
    if (startDate.format('YYYYMM') === endDate.format('YYYYMM')) {
        return getDailyAmount(getBudget(budgets, startDate)) * getDayCount(period)
    } else {
        let sumBudget = 0

        const firstBudget = getBudget(budgets, startDate);
        sumBudget += getDailyAmount(firstBudget) * getDayCount({startDate: period.startDate, endDate: getEndDate(firstBudget)})
        const lastBudget = getBudget(budgets, endDate);
        sumBudget += getDailyAmount(lastBudget) * getDayCount({startDate: getStartDate(lastBudget), endDate: period.endDate})
        for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
            const budget = getBudget(budgets, m);
            sumBudget += getDailyAmount(budget) * getDayCount({startDate: getStartDate(budget), endDate: getEndDate(budget)})
        }
        return sumBudget
    }
}

const getBudget = (budgets, dateInBudget) => {
    const amount = budgets[dateInBudget.format('YYYYMM')];
    if (amount) {
        return {amount, month: dateInBudget}
    } else {
        return {amount: 0, month: dateInBudget}
    }
}

const getDailyAmount = budget => budget.amount / budget.month.daysInMonth()

const getDayCount = period => period.endDate.diff(period.startDate, 'days') + 1

const getEndDate = budget => moment(budget.month).endOf('month')

const getStartDate = budget => moment(budget.month).startOf('month')

module.exports = queryBudget
