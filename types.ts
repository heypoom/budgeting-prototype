const frequencies = ['daily', 'weekly', 'monthly', 'yearly'] as const

export const planCategory = [
  'necessity',
  'security',
  'education',
  'lifestyle',
  'dream',
  'investment',
] as const

export type Frequency = typeof frequencies[number]
export type PlanCategory = typeof planCategory[number]

export interface Plan {
  category: PlanCategory
  percent?: number
  fixed?: number
}

export interface Investment {
  category: string
  percent: number
}

export interface Budget {
  isFlexible: boolean
  frequency: Frequency
  category: string
  amount: number
  title: string
}

export type PlanTypes = Record<string, PlanCategory>

export interface FinancialPlan {
  plan: Plan[]
  budget: Budget[]
  investment: Investment[]
  types: PlanTypes
}
