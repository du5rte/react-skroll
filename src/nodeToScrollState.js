export default function nodeToScrollState({ scrollTop, scrollHeight, offsetHeight }) {
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

  return { position, positionRatio, start, end, viewHeight, scrollHeight, onStart, onMiddle, onEnd }
}
