const REMAINING_IN_BANK = 200000
const MONTHLY_INCOME = 80000

export type Category =
  | 'Security'
  | 'Investment'
  | 'Necessity'
  | 'Education'
  | 'Lifestyle'
  | 'Dream'

interface Plan {
  category: Category
  amount: number
}

function breakdown(plans: Plan[]) {
  const budgets: Partial<Record<Category, number>> = {}

  for (let plan of plans) {
    budgets[plan.category] = plan.amount
  }

  return budgets
}

const plans: Plan[] = []

const add = (category: Category, amount: number, remain: number) => {
  plans.push({category, amount})

  return remain - amount
}

const percent = (perc: number) => (perc / 100) * MONTHLY_INCOME

// r = remain
let r = REMAINING_IN_BANK

// 1) ค่าน้ำ ค่าไฟ (Monthly Cash Flow) -> ต่อเดือน
// ถ้าขาด เอามาจาก security
r = add('Necessity', percent(40), r) //?

// 2) เงินให้พอใช้ไปอีก 1 ปี -> Fixed Amount
// 150000 - พอได้
// 200000 - ดี
// 250000 - สบายๆ
r = add('Security', Math.floor(200000 / 12), r) //?

// 3) การเรียนรู้เรื่องใหม่ๆ -> Percent from Income
r = add('Education', percent(3), r) //?

// 4) eg. ของที่อยากใช้ ไม่ได้อยากคิด -> ฟุ่มเฟือย เน้น happy ได้
r = add('Lifestyle', percent(10), r) //?

// 5) Ultimate Goal ในชีวิต
r = add('Dream', percent(10), r) //?

breakdown(plans) //?
plans.map((x) => x.amount).reduce((a, b) => a + b) //?

// 6) Investment: เงินลงทุน --> มี return ที่ compound // support ความฝัน
r = add('Investment', r, r) //?
plans.map((x) => x.amount).reduce((a, b) => a + b) //?

// 10% Thai Market: ลงตลาดไทย
//     ไม่มี Fundamentals!

// 10% Inflation Hedge or Gold 10% (Asset-Backed)

// 20% Dividend: ได้ Return -> Generate Cash Flow
// Divided Stocks: กลุ่ม Blue Shift
//     ไม่แนะนำ Bond

// 20% Cash: เก็บเงินสดเอาไว้ใช้เผื่อตลาดลง
//     Opportunities for when market crashes

// 40% Global Market: ลงตลาดต่างประเทศ
