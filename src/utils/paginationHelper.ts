function getPaginationRange(
  current: number,
  total: number,
  siblingCount = 1
): (number | "ellipsis")[] {
  const range: (number | "ellipsis")[] = []

  const start = Math.max(2, current - siblingCount)
  const end = Math.min(total - 1, current + siblingCount)

  range.push(1)

  if (start > 2) {
    range.push("ellipsis")
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  if (end < total - 1) {
    range.push("ellipsis")
  }

  if (total > 1) {
    range.push(total)
  }

  return range
}
