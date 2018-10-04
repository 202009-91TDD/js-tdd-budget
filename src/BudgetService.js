const moment = require('moment')

const queryBudget = (startDate, endDate, budgets) => {

    const diffDate = endDate.diff(startDate, 'days') + 1

    const startMonth = startDate.format('YYYYMM')
    const endMonth = endDate.format('YYYYMM')
    if (startMonth === endMonth) {
        return getDailyBudget(budgets, startMonth) * diffDate
    } else {
        let sumBudget = 0
        const totalStartLeftDays = moment(startDate).endOf('month').diff(startDate, 'Days') + 1
        sumBudget += getDailyBudget(budgets, startMonth) * totalStartLeftDays
        sumBudget += getDailyBudget(budgets, endMonth) * endDate.date()
        if (endDate.diff(startDate, 'months') >= 2) {
            for (let m = moment(startDate).add(1, 'month'); m.isBefore(moment(endDate).add(-1, 'month')); m.add(1, 'month')) {
                sumBudget += budgets[moment(m).format('YYYYMM')] ? budgets[moment(m).format('YYYYMM')] : 0
            }
        }
        return sumBudget
    }
}

const getDailyBudget = (budgets, monthString) => {
    if (!budgets[monthString]) {
        return 0
    }
    const lengthOfMonth = moment(monthString, 'YYYYMM').daysInMonth()
    return budgets[monthString] / lengthOfMonth
}

module.exports = queryBudget
