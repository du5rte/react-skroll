export default function nodeChildrenToScrollState({ children, style }) {
  let list = []

  // used to increment children view heights
  let start = 0

  // Fix: default props
  // let { theshold } = this.props
  let theshold = 0.5

  let translateY = style.getPropertyValue('transform')
    .split('(')[1]
    .split(',')[1]
  let scrollTop = Math.abs(parseInt(translateY))

  // TODO: experiment a map
  for (let i = 0; i < children.length; i++) {
    let { offsetHeight, attributes } = children[i]

    // interpreting native values
    let viewHeight = offsetHeight
    let end = start + viewHeight

    // current position values
    let position = start - scrollTop
    let positionRatio = position / offsetHeight
    let positionRatioRemainer = positionRatio <= -1 ? 1 : positionRatio >= 1 ? 1 : Math.abs(positionRatio % 1)

    /* Used for creating navigations and  to links to
    *  <Link to="Home" />
    */

    // Conditionals
    // FIX: use exact values
    let onView = positionRatio <= theshold && positionRatio >= -theshold
    let onFrame = position === scrollTop
    // TODO: review active
    // TODO: addfunction to run on activate()
    let active = onView

    list.push({ position, positionRatio, positionRatioRemainer, start, end, viewHeight, onView, active, onFrame })

    // increament based on stacked item's height
    start += offsetHeight
  }

  return { children: list }
}
