const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {
    const period = {startDate, endDate};
    if (startDate.format('YYYYMM') === endDate.format('YYYYMM')) {
        const budget = getBudget(budgets, startDate);
        return getDailyAmount(budget) * getOverlappingDayCount(period, budget.period)
    } else {
        let sumBudget = 0

        const firstBudget = getBudget(budgets, startDate);
        sumBudget += getDailyAmount(firstBudget) * getOverlappingDayCount(period, firstBudget.period)
        const lastBudget = getBudget(budgets, endDate);
        sumBudget += getDailyAmount(lastBudget) * getOverlappingDayCount(period, lastBudget.period)
        for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
            const budget = getBudget(budgets, m);
            sumBudget += getDailyAmount(budget) * getOverlappingDayCount(period, budget.period)
        }
        return sumBudget
    }
}

const getBudget = (budgets, dateInBudget) => {
    const amount = budgets[dateInBudget.format('YYYYMM')];
    if (amount) {
        return {amount, month: dateInBudget, period: {startDate: moment(dateInBudget).startOf('month'), endDate: moment(dateInBudget).endOf('month')}}
    } else {
        return {amount: 0, month: dateInBudget,  period: {startDate: moment(dateInBudget).startOf('month'), endDate: moment(dateInBudget).endOf('month')}}
    }
}

const getDailyAmount = budget => budget.amount / budget.month.daysInMonth()

const getDayCount = period => period.endDate.diff(period.startDate, 'days') + 1

const getOverlappingDayCount = function (period, another) {
    const overlappingEndDate = period.endDate.isBefore(another.endDate) ? period.endDate : another.endDate;
    const overlappingStartDate = period.startDate.isAfter(another.startDate) ? period.startDate: another.startDate;
    if (overlappingStartDate.isAfter(overlappingEndDate))
        return 0
    return getDayCount({startDate: overlappingStartDate, endDate: overlappingEndDate});
}

module.exports = queryBudget
