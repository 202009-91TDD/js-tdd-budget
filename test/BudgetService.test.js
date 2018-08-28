import test from 'ava';
import moment from 'moment'
import BudgetService from '../src/BudgetService';

let DB = {
  getAll: () => ({
    '201801': 310,
    '201802': 280,
    '201805': 3100,
    '201807': 620,
    '201808': 100,
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

test('same month with budget', t => {
  t.is(budget.queryBudget(moment('2018-02-03'), moment('2018-02-07')), 50)
})
