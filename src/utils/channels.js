import getWeek from 'date-fns/getWeek'
import getYear from 'date-fns/getYear'

export function createWeeklyChannelName (channelName) {
  const now = Date.now()
  const year = getYear(now)
  const week = getWeek(now)
  return channelName + '-' + year + '-' + week
}
