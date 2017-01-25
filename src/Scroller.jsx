import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import ResizeObserver from 'resize-observer-polyfill'
// import { throttle } from 'throttle-debounce'
import { contextProviderShape } from './utilities'

export default class Scroller extends Component {
  constructor () {
    super()

    this.node = null
  }

  static contextTypes = {
    scroll: contextProviderShape
  };

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
    scrollable: PropTypes.bool,
  };

  static defaultProps = {
    scrollable: true,
  };

  componentDidMount() {
    let node = ReactDOM.findDOMNode(this)

    // set node
    this.node = node
    this.context.scroll.setNode(node)

    // run on first render
    // this.context.scroll.handleScroll()

    // add component to resize observer to detect changes on resize
    this.resizeObserver = new ResizeObserver((entries, observer) => {
      this.context.scroll.handleScroll()
    })

    this.resizeObserver.observe(node)
  }

  componentWillUnmount() {
    this.context.scroll.unsetNode()
    this.resizeObserver.disconnect(this.context.scroll.node)
  }

  handleScroll(e) {
    if (this.props.handleScroll) this.props.handleScroll(e)
    this.context.scroll.handleScroll(e)
  }

  handleWheel(e) {
    if (this.props.handleWheel) this.props.handleWheel(e)
    this.context.scroll.handleWheel(e)
  }

  render() {
    const style = {
      height: '100%',
      width: '100%',
      overflowScrolling: 'touch',
      WebkitOverflowScrolling: 'touch',
      overflowY: this.props.scrollable ? 'auto' : 'hidden',
      ...this.props.style
    }

    const { location, nextLocation, handleRest } = this.context.scroll

    // Fixes unknown props on <div> tag
    const { scrollable, ...props } = this.props

    return (
      <Motion
        style={{
          next: nextLocation !== null ? spring(nextLocation) : location
        }}
        onRest={handleRest}
      >
      {({ next }) => {
        if (this.node && nextLocation !== null) {
          this.node.scrollTop = next
        }

        return (
          <div
            {...props}
            style={style}
            onScroll={this.handleScroll.bind(this)}
            onWheel={this.handleWheel.bind(this)}
          />
        )
      }}
      </Motion>
    )
  }
}
