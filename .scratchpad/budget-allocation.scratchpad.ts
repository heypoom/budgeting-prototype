type Category = 'transit' | 'food' | 'rent' | 'savings'

interface Budget {
  name: string
  amount: number
  category: Category
}

const monthlyBudget: Budget[] = []

const sumAmount = (budgets: Budget[]) =>
  budgets.map((x) => x.amount).reduce((a, b) => a + b, 0)

function breakdown(budgets: Budget[]) {
  const categoryList = Array.from(new Set(budgets.map((b) => b.category)))

  let categories: Partial<Record<Category, number>> = {}

  for (let category of categoryList) {
    categories[category] = sumAmount(
      budgets.filter((b) => b.category === category)
    )
  }

  return categories
}

const monthly = (category: Category, amount: number, name: string) => {
  const budget: Budget = {name, amount, category}
  monthlyBudget.push(budget)

  return budget.amount
}

const daily = (category: Category, amount: number, name: string) =>
  monthly(category, amount * 30, name)

const yearly = (category: Category, amount: number, name: string) =>
  monthly(category, Math.floor(amount / 12), name)

const REMAINING_MONEY_IN_BANK = 0
const SAVINGS_FLOOR = 0
const REMAINING_MONEY = REMAINING_MONEY_IN_BANK - SAVINGS_FLOOR //?

monthly('rent', 9000, 'Condo Rent')
yearly('rent', 15000, 'ค่าส่วนกลาง') //?

daily('transit', 10 * 2, 'Motorcycle to Condo') //?
monthly('transit', 950 + 500, 'BTS 50 Trips') //?

daily('food', 300, 'Meal') //?
daily('food', 200, 'Snacks') //?

breakdown(monthlyBudget) //?

const allocatedBudget = sumAmount(monthlyBudget) //?

const unallocatedBudget = REMAINING_MONEY - allocatedBudget //?
