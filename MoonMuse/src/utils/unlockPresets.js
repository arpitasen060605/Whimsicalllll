import { addMonths, addYears } from 'date-fns'

export const UNLOCK_PRESETS = [
  { label: '1 Month', getDate: () => addMonths(new Date(), 1) },
  { label: '6 Months', getDate: () => addMonths(new Date(), 6) },
  { label: '1 Year', getDate: () => addYears(new Date(), 1) },
  { label: '5 Years', getDate: () => addYears(new Date(), 5) },
]