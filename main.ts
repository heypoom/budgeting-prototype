import {
  Budget,
  Frequency,
  Plan,
  PlanCategory,
  Investment,
  FinancialPlan,
  PlanTypes,
  planCategory,
} from './types'

const fs = require('fs')

// 1) Give Each Dollar a Job (allocate them into categories)
// 2) Embrace Your True Expenses (split yearly bills into monthly ones)
// 3) Roll with the Punches (re-allocate budgets if you overspent)
// 4) Age Your Money (spend money that is at least 30 days old)

const budgetRegex = /(flexible)?\s?(daily|weekly|monthly|yearly)\s(\w+)\s(\d+|\(.*\))\s(.*)/
const planRegex = /(necessity|security|education|lifestyle|dream|investment)\s(\w+%?)/
const investmentRegex = /invest in (.*) (\d+)%/
const categorizeBudgetRegex = /(necessity|security|education|lifestyle|dream|investment)\: (.*)/

const sum = (list: number[]) => Math.round(list.reduce((a, b) => a + b, 0))

function createBudgetFromText(text: string): Budget[] {
  const budgets: Budget[] = []
  const lines = text.split('\n').filter((x) => x)

  for (let line of lines) {
    const m = line.match(budgetRegex)
    if (!m) continue

    const [_, isFlexible, frequency, category, amount, title] = m

    if (!frequencies.includes(frequency as Frequency)) continue

    budgets.push({
      isFlexible: !!isFlexible,
      frequency: frequency as Frequency,
      category,
      amount: amount.startsWith('(') ? Number(eval(amount)) : Number(amount),
      title,
    })
  }

  return budgets
}

const toLines = (text: string) => text.split('\n').filter((x) => x)

function createPlanFromText(text: string): Plan[] {
  const plans: Plan[] = []

  for (let line of toLines(text)) {
    const m = line.match(planRegex)
    if (!m) continue

    const [_, _category, amount] = m
    const category = _category as PlanCategory

    if (amount.endsWith('%')) {
      plans.push({category, percent: Number(amount.replace('%', ''))})
    } else {
      plans.push({category, fixed: Number(amount)})
    }
  }

  return plans
}

function createInvestmentFromText(text: string): Investment[] {
  const plans: Investment[] = []

  for (let line of toLines(text)) {
    const m = line.match(investmentRegex)
    if (!m) continue

    const [_, category, percent] = m
    plans.push({category, percent: Number(percent)})
  }

  return plans
}

function categorizeBudgetFromText(text: string): Record<string, PlanCategory> {
  const category: Record<string, PlanCategory> = {}

  for (let line of toLines(text)) {
    const m = line.match(categorizeBudgetRegex)
    if (!m) continue

    const [_, type, categories] = m

    for (let c of categories.split(' ')) {
      if (!planCategory.includes(type as PlanCategory)) return

      category[c] = type as PlanCategory
    }
  }

  return category
}

function createFinancialPlanFromText(text: string): FinancialPlan {
  const plan = createPlanFromText(text) //?
  const budget = createBudgetFromText(text) //?
  const investment = createInvestmentFromText(text) //?
  const types = categorizeBudgetFromText(text) //?

  return {plan, budget, investment, types}
}

type PlanAllocations = Partial<Record<PlanCategory, number>>

function calculatePlans(p: Plan[], totalBudget: number) {
  const plans: PlanAllocations = {}
  let remaining = totalBudget

  for (let plan of p) {
    const amount = plan.fixed
      ? plan.fixed / 12
      : (plan.percent / 100) * totalBudget

    plans[plan.category] = amount
  }

  const monthlyAllocations = sum(Object.values(plans)) //?
  remaining -= monthlyAllocations

  plans.investment = remaining

  return {plans, monthlyAllocations}
}

function calculateAllocation(b: Budget) {
  if (b.frequency === 'monthly') return b.amount
  if (b.frequency === 'daily') return b.amount * 30
  if (b.frequency === 'yearly') return b.amount / 12
  if (b.frequency === 'weekly') return b.amount / 7
}

type PerTypes = Partial<Record<PlanCategory, number>>

function calculateAllocations(budgets: Budget[], types: PlanTypes) {
  const allocations: Record<string, number> = {}
  const allocationsPerTypes: PerTypes = {}
  const breakdown: Record<string, number> = {}

  for (let budget of budgets) {
    const allocation = calculateAllocation(budget)

    allocations[budget.title] = allocation

    const planType = types[budget.category]

    if (!breakdown[budget.category]) breakdown[budget.category] = 0
    breakdown[budget.category] += allocation

    if (!allocationsPerTypes[planType]) allocationsPerTypes[planType] = 0
    allocationsPerTypes[planType] += allocation
  }

  return {allocations, perTypes: allocationsPerTypes, breakdown}
}

function calculateUnallocated(
  allocations: PlanAllocations,
  perTypes: PerTypes
) {
  const unallocated: PlanAllocations = {}

  for (let type in perTypes) {
    const max = allocations[type]
    const current = perTypes[type]

    unallocated[type] = max - current
  }

  return unallocated
}

function calculateInvestmentPlan(
  investmentBudget: number,
  strategies: Investment[]
) {
  const investmentPlan = {}

  for (let strategy of strategies) {
    investmentPlan[strategy.category] =
      investmentBudget * (strategy.percent / 100)
  }

  return investmentPlan
}

function calculate(p: FinancialPlan, totalBudget: number) {
  const {plans} = calculatePlans(p.plan, totalBudget)

  const {allocations, perTypes, breakdown} = calculateAllocations(
    p.budget,
    p.types
  )

  const unallocated = calculateUnallocated(plans, perTypes)

  const investmentPlan = calculateInvestmentPlan(plans.investment, p.investment)

  return {plans, allocations, unallocated, breakdown, investmentPlan}
}

const text: string = fs.readFileSync('./my.budget', 'utf-8')

const financialPlan = createFinancialPlanFromText(text) //?
const calculations = calculate(financialPlan, 130000) //?

console.log(calculations)
