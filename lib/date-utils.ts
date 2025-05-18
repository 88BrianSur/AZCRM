import { format, formatRelative, formatDistance, parseISO } from "date-fns"
import { he } from "date-fns/locale"

// Jerusalem time zone offset is UTC+3 (in minutes)
export const JERUSALEM_TIMEZONE_OFFSET = 180

/**
 * Formats a date using the Jerusalem time zone
 */
export function formatDateJerusalem(date: Date | string, formatStr = "PPpp"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date

  // Adjust for Jerusalem time zone
  const jerusalemDate = addMinutes(dateObj, JERUSALEM_TIMEZONE_OFFSET - dateObj.getTimezoneOffset())

  return format(jerusalemDate, formatStr)
}

/**
 * Formats a date relative to now using the Jerusalem time zone
 */
export function formatRelativeJerusalem(date: Date | string, baseDate: Date = new Date()): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  const baseDateObj = typeof baseDate === "string" ? parseISO(baseDate) : baseDate

  // Adjust for Jerusalem time zone
  const jerusalemDate = addMinutes(dateObj, JERUSALEM_TIMEZONE_OFFSET - dateObj.getTimezoneOffset())
  const jerusalemBaseDate = addMinutes(baseDateObj, JERUSALEM_TIMEZONE_OFFSET - baseDateObj.getTimezoneOffset())

  return formatRelative(jerusalemDate, jerusalemBaseDate, { locale: he })
}

/**
 * Formats the distance between two dates using the Jerusalem time zone
 */
export function formatDistanceJerusalem(date: Date | string, baseDate: Date = new Date()): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  const baseDateObj = typeof baseDate === "string" ? parseISO(baseDate) : baseDate

  return formatDistance(dateObj, baseDateObj, { addSuffix: true })
}

/**
 * Converts a local date to Jerusalem time zone
 */
export function toJerusalemTime(date: Date): Date {
  return addMinutes(date, JERUSALEM_TIMEZONE_OFFSET - date.getTimezoneOffset())
}

/**
 * Converts a Jerusalem date to local time zone
 */
export function fromJerusalemTime(date: Date): Date {
  return addMinutes(date, -JERUSALEM_TIMEZONE_OFFSET + date.getTimezoneOffset())
}

/**
 * Gets the current date and time in Jerusalem
 */
export function getNowJerusalem(): Date {
  return toJerusalemTime(new Date())
}

/**
 * Helper function to add minutes to a date
 */
function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000)
}

/**
 * Formats a time string (HH:MM) to Jerusalem time zone
 */
export function formatTimeJerusalem(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  const jerusalemDate = toJerusalemTime(date)
  return format(jerusalemDate, "HH:mm")
}

/**
 * Gets the current date in YYYY-MM-DD format in Jerusalem time zone
 */
export function getCurrentDateJerusalem(): string {
  return format(getNowJerusalem(), "yyyy-MM-dd")
}

/**
 * Gets the current time in HH:MM format in Jerusalem time zone
 */
export function getCurrentTimeJerusalem(): string {
  return format(getNowJerusalem(), "HH:mm")
}
