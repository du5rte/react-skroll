export default function nodeToScrollState({
  scrollTop,
  scrollHeight,
  offsetHeight,
  children
}) {
  // Interpreting native values
  let start = 0
  let viewHeight = offsetHeight
  let end = scrollHeight - viewHeight

  // current position
  let position = scrollTop
  let positionRatio = scrollTop / end

  // Conditionals
  let onStart = position <= start
  let onEnd = position >= end
  let onMiddle = !onStart && !onEnd

  // let scrolling = true / false

  let positionRelativeRatio = Math.abs(start - scrollTop / offsetHeight)

  return {
    position,
    positionRatio,
    // positionIndex,
    positionRelativeRatio,
    start,
    end,
    viewHeight,
    scrollHeight,
    onStart,
    onMiddle,
    onEnd
  }
}
