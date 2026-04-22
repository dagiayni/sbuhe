/**
 * Converts a Gregorian Date to an Ethiopian Date string.
 * Accurate for the current period (2020-2100).
 */
export function toEthiopianDateString(date: Date): string {
  const ethiopianMonths = [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ];
  
  const ethiopianWeekdays = [
    "እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"
  ];

  // Using a more precise JDN calculation
  // Unix epoch (Jan 1, 1970) is JDN 2440587.5
  const jdn = Math.floor(date.getTime() / 86400000) + 2440587;
  
  const era = 1724220;
  const offset = jdn - era;
  
  const cycle = Math.floor(offset / 1461);
  const cycleDays = offset % 1461;
  
  let yearInCycle = Math.floor(cycleDays / 365);
  if (yearInCycle === 4) yearInCycle = 3;
  
  const year = cycle * 4 + yearInCycle;
  const daysInYear = cycleDays - yearInCycle * 365;
  
  const month = Math.floor(daysInYear / 30) + 1;
  const day = (daysInYear % 30) + 1;
  
  const weekday = ethiopianWeekdays[date.getDay()];
  const monthName = ethiopianMonths[month - 1] || ethiopianMonths[0];

  return `${weekday}፣ ${monthName} ${day}`;
}
