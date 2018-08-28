import test from 'ava';
import moment from 'moment'
import BudgetService from '../src/BudgetService';

let DB = {
  getAll: () => ({
    '201801': 310,
    '201802': 280,
    '201805': 3100,
    '201806': 0,
    '201807': 620,
    '201808': 310,
  }),
}
let budget

test.before(t => {
  budget = new BudgetService(DB)
})

test('invalid period.', t => {
  t.is(budget.queryBudget(moment('2018-01-02'), moment('2018-01-01')), 0)
})

test('same date with budget', t => {
  t.is(budget.queryBudget(moment('2018-02-01'), moment('2018-02-01')), 10)
})

test('same month with different date with budget', t => {
  t.is(budget.queryBudget(moment('2018-08-10'), moment('2018-08-20')), 110)
})

test('same month with different date without budget', t => {
  t.is(budget.queryBudget(moment('2018-06-10'), moment('2018-06-20')), 0)
})

test('cross different month with different date of same year with budget: 20180731 - 20180801', t => {
  t.is(budget.queryBudget(moment('2018-07-31'), moment('2018-08-01')), 30)
})

test('cross different month with different date of same year with budget: 20180730 - 20180803', t => {
  t.is(budget.queryBudget(moment('2018-07-30'), moment('2018-08-03')), 70)
})


test('cross different month with different date of same year with budget: 20180730 - 20180807', t => {
  t.is(budget.queryBudget(moment('2018-07-30'), moment('2018-08-07')), 110)
})

test('cross 2 months with different date of same year with budget: 20180730 - 20180903', t => {
  t.is(budget.queryBudget(moment('2018-05-01'), moment('2018-08-31')), 4030)
})
