const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {

    const diffDate = endDate.diff(startDate, 'days') + 1
    if (diffDate < 1) {
        return 0
    }

    const startMonth = startDate.format('YYYYMM')
    const endMonth = endDate.format('YYYYMM')
    if (startMonth === endMonth) {
        return getDaysBudget(startMonth, diffDate, budgets)
    } else {
        let sumBudget = 0
        const totaStartlLeftDays = moment(startMonth + startDate.daysInMonth()).diff(startDate, 'Days') + 1
        const startMonthBudget = getDaysBudget(startMonth, totaStartlLeftDays, budgets);
        sumBudget += startMonthBudget;
        const endMonthBudget = getDaysBudget(endMonth, endDate.date(), budgets);
        sumBudget += endMonthBudget;
        const diffMonth = endDate.diff(startDate, 'months')
        if (diffMonth >= 2) {
            for (var m = moment(startDate).add(1, 'M'); m.isBefore(moment(endDate).add(-1, 'M')); m.add(1, 'months')) {
                sumBudget += budgets[moment(m).format('YYYYMM')]
            }
        }
        return sumBudget
    }
}

const getDaysBudget = (monthString, days, budgets) => {
    const monthTotalDays = moment(monthString, 'YYYYMM').daysInMonth()
    if (!budgets[monthString]) {
        return 0
    }
    return budgets[monthString] / monthTotalDays * days
}

module.exports = queryBudget
