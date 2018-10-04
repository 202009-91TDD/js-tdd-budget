const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    const period = {startDate, endDate};
    let sumBudget = 0

    for (const [monthStr, amount] of Object.entries(budgets)) {
        const budget = createBudget(monthStr, amount)
        sumBudget += getDailyAmount(budget) * getOverlappingDayCount(period, budget.period)
    }

    return sumBudget
}

const createBudget = (monthStr, amount) => {
    return {
        amount,
        period: {
            startDate: moment(`${monthStr}01`, "YYYYMMDD").startOf('month'),
            endDate: moment(`${monthStr}01`, "YYYYMMDD").endOf('month')
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
