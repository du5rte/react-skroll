import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

// import { round } from './utilities'

export default class Scroll extends Component {
  static propTypes = {
    theshold: PropTypes.number,
    onScroll: PropTypes.func,
    scrollTo: PropTypes.number
  }

  static defaultProps = {
    theshold: 0.5
  }

  constructor() {
    super()

    this.node = null
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this)

    // create settings on first render
    this.generateSettings()

    // add detector to detect changes on resize
    // elementResizeDetectorMaker().listenTo(this.node, () => this.createSettings())
  }

  componentWillReceiveProps({ scrollTo }) {
    if (scrollTo !== this.props.scrollTo) {
      this.node.scrollTop = scrollTo
    }
  }

  handleScroll(e) {
    this.generateSettings(e.target)
  }

  generateSettings({ scrollTop, scrollHeight, offsetHeight, children } = this.node) {
    let scrollLimit = scrollHeight - offsetHeight
    let scrolling = scrollTop / scrollLimit

    let settings = {
      scrollTop,
      scrollHeight,
      scrollLimit,
      scrolling,
      start: scrolling === 0,
      inbetween: scrolling > 0 && scrolling < 1,
      finish: scrolling === 1,
      items: this.generateItems({ children, scrollTop }),
    }

    if (this.props.onScroll) {
      this.props.onScroll(settings)
    }
  }

  generateItems({ children, scrollTop }) {
    let items = []
    let scrollPosition = 0

    for (let i = 0; i < children.length; i++) {
      let { offsetHeight, attributes } = children[i]
      let { theshold } = this.props

      let startPoint = scrollPosition
      let endPoint = scrollPosition + offsetHeight
      let scrollingPoint = scrollPosition - scrollTop

      let scrolling = scrollingPoint / offsetHeight
      // let innerScrolling = scrolling > 1 ? 1 : scrolling < -1 ? -1 : scrolling

      items.push({
        name: attributes.name ? attributes.name.value : null,
        scrollPosition,
        scrolling,
        active: scrolling >= -theshold && scrolling <= theshold,
        framed: scrolling === 0,
        viewed: scrollTop > endPoint,
      })

      // increament based on stacked item's height
      scrollPosition += offsetHeight
    }

    return items
  }

  render() {
    let style = {
      height: '100%',
      overflow: 'auto',
      ...this.props.style
    }

    return (
      <div
        {...this.props}
        style={style}
        onScroll={this.handleScroll.bind(this)}
      />
    )
  }
}
