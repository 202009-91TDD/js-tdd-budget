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
        const totalStartLeftDays = moment(startDate).endOf('month').diff(startDate, 'Days') + 1
        sumBudget += getDaysBudget(startMonth, totalStartLeftDays, budgets);
        sumBudget += getDaysBudget(endMonth, endDate.date(), budgets);
        if (endDate.diff(startDate, 'months') >= 2) {
            for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
                sumBudget += budgets[moment(m).format('YYYYMM')] ? budgets[moment(m).format('YYYYMM')] : 0
            }
        }
        return sumBudget
    }
}

const getDaysBudget = (monthString, days, budgets) => {
    if (!budgets[monthString]) {
        return 0
    }
    const lengthOfMonth = moment(monthString, 'YYYYMM').daysInMonth()
    return budgets[monthString] / lengthOfMonth * days
}

module.exports = queryBudget
