export function formatDuration(milliseconds) {
  if (milliseconds === null || milliseconds === undefined || Number.isNaN(milliseconds)) {
    return '-'
  }

  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours} godz. ${minutes} min ${seconds} s`
  }

  if (minutes > 0) {
    return `${minutes} min ${seconds} s`
  }

  return `${seconds} s`
}

export function getExitDurationMs(exit) {
  if (!exit?.exit_time) {
    return null
  }

  const start = new Date(exit.exit_time).getTime()
  const end = exit.return_time ? new Date(exit.return_time).getTime() : Date.now()
  const duration = end - start

  return duration >= 0 ? duration : null
}

export function calculateDuration(exitTimeValue, returnTimeValue) {
  if (!exitTimeValue) {
    return '-'
  }

  const start = new Date(exitTimeValue).getTime()
  const end = returnTimeValue ? new Date(returnTimeValue).getTime() : Date.now()

  if (end < start) {
    return '-'
  }

  return formatDuration(end - start)
}

export function isExitActive(exit) {
  return !!(exit && exit.exit_time && !exit.return_time)
}
