export default function nodeToScrollState({ scrollTop, scrollHeight, offsetHeight }) {
  // Interpreting native values
  let start = 0
  let viewHeight = offsetHeight
  let end = scrollHeight - viewHeight

  // current location
  let location = scrollTop
  let locationFloat = scrollTop / end

  // Conditionals
  let onStart = location <= start
  let onEnd = location >= end
  let onMiddle = !onStart && !onEnd

  // let scrolling = true / false

  return { location, locationFloat, start, end, viewHeight, scrollHeight, onStart, onMiddle, onEnd }
}
