export default function nodeChildrenToScrollState({ children, scrollTop }) {
  let list = []

  // used to increment children view heights
  let start = 0

  // Fix: default props
  // let { theshold } = this.props
  let theshold = 0.5

  // TODO: experiment a map
  for (let i = 0; i < children.length; i++) {
    let { offsetHeight, attributes } = children[i]

    // interpreting native values
    let viewHeight = offsetHeight
    let end = start + viewHeight

    // current location values
    let location = start - scrollTop
    let locationFloat = location / offsetHeight
    let locationFloatRemainer = locationFloat <= -1 ? 1 : locationFloat >= 1 ? 1 : Math.abs(locationFloat % 1)

    /* Used for creating navigations and  to links to
    *  <Link to="Home" />
    */
    let name = attributes.name ? attributes.name.value : null

    // Conditionals
    // FIX: use exact values
    let onView = locationFloat <= theshold && locationFloat >= -theshold
    let onFrame = location === scrollTop
    // TODO: review active
    // TODO: addfunction to run on activate()
    let active = onView

    list.push({ name, location, locationFloat, locationFloatRemainer, start, end, viewHeight, onView, active, onFrame })

    // increament based on stacked item's height
    start += offsetHeight + 1
  }

  return { children: list }
}
