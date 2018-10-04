const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    return Object.entries(budgets)
        .map(budget)
        .map(budget => getOverlappingAmount(budget, {startDate, endDate}))
        .reduce((a, b) => a + b, 0)
}

const getOverlappingAmount = (budget, period) => getDailyAmount(budget) * getOverlappingDayCount(period, budget.period)

const budget = (entry) => {
    return {
        amount: entry[1],
        period: {
            startDate: moment(`${entry[0]}01`, "YYYYMMDD").startOf('month'),
            endDate: moment(`${entry[0]}01`, "YYYYMMDD").endOf('month')
        }
    }
}

const getDailyAmount = budget => budget.amount / getDayCount(budget.period)

const getDayCount = period => period.endDate.diff(period.startDate, 'days') + 1

const getOverlappingDayCount = function (period, another) {
    const overlappingEndDate = period.endDate.isBefore(another.endDate) ? period.endDate : another.endDate;
    const overlappingStartDate = period.startDate.isAfter(another.startDate) ? period.startDate : another.startDate;
    if (overlappingStartDate.isAfter(overlappingEndDate))
        return 0
    return getDayCount({startDate: overlappingStartDate, endDate: overlappingEndDate});
}

module.exports = queryBudget
