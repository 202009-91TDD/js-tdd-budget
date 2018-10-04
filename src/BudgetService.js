const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    const period = {startDate, endDate};
    let sumBudget = 0

    for (let m = moment(startDate).startOf('month'); m.isSameOrBefore(moment(endDate)); m.add(1, 'month')) {
        const budget = getBudget(budgets, m);
        sumBudget += getDailyAmount(budget) * getOverlappingDayCount(period, budget.period)
    }
    return sumBudget
}

const getBudget = (budgets, dateInBudget) => {
    const amount = budgets[dateInBudget.format('YYYYMM')];
    return {
        amount: amount ? amount : 0,
        period: {startDate: moment(dateInBudget).startOf('month'), endDate: moment(dateInBudget).endOf('month')}
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
