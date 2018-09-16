import test from 'ava';
import moment from 'moment'
import queryBudget from '../src/BudgetService'

const budgets = {
    '201712': 31,
    '201801': 310,
    '201802': 280,
    '201805': 3100,
    '201806': 0,
    '201807': 620,
    '201808': 310,
}

test('invalid period.', t => {
    const budgets = {
        '201801': 310
    }
    t.is(queryBudget(moment('2018-01-02'), moment('2018-01-01'), budgets), 0)
})

test('same date with budget', t => {
    const budgets = {
        '201802': 280
    }
    t.is(queryBudget(moment('2018-02-01'), moment('2018-02-01'), budgets), 10)
})

test('same month with different date with budget', t => {
    const budgets = {
        '201808': 310
    }
    t.is(queryBudget(moment('2018-08-10'), moment('2018-08-20'), budgets), 110)
})

test('same month with different date without budget', t => {
    const budgets = {}
    t.is(queryBudget(moment('2018-06-10'), moment('2018-06-20'), budgets), 0)
})

test('cross different month with different date of same year with budget: 20180731 - 20180801', t => {
    t.is(queryBudget(moment('2018-07-31'), moment('2018-08-01'), budgets), 30)
})

test('cross different month with different date of same year with budget: 20180730 - 20180803', t => {
    t.is(queryBudget(moment('2018-07-30'), moment('2018-08-03'), budgets), 70)
})


test('cross different month with different date of same year with budget: 20180730 - 20180807', t => {
    t.is(queryBudget(moment('2018-07-30'), moment('2018-08-07'), budgets), 110)
})

test('cross 2 months with different date of same year with budget: 20180730 - 20180903', t => {
    t.is(queryBudget(moment('2018-05-01'), moment('2018-08-31'), budgets), 4030)
})

test('cross years with different date of same year with budget: 20171231 - 20180101', t => {
    t.is(queryBudget(moment('2017-12-31'), moment('2018-01-31'), budgets), 311)
})
