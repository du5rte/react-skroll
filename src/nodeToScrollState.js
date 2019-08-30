export default function nodeToScrollState({
  scrollTop,
  scrollHeight,
  offsetHeight,
  children,
  style
}) {
  // Interpreting native values
  let start = 0
  let viewHeight = offsetHeight / children.length
  let end = scrollHeight - viewHeight

  let translateY = style.getPropertyValue('transform')
    .split('(')[1]
    .split(',')[1]

  // current position
  let position = Math.abs(parseInt(translateY))
  let positionRatio = position / end

  // Conditionals
  let onStart = position <= start
  let onEnd = position >= end
  let onMiddle = !onStart && !onEnd

  // let scrolling = true / false

  let positionRelativeRatio = Math.abs(start - position / viewHeight)

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
