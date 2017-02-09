import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import ResizeObserver from 'resize-observer-polyfill'
// import { throttle } from 'throttle-debounce'
import { contextProviderShape } from './utilities'

export default class Scroller extends Component {
  static contextTypes = {
    scroll: contextProviderShape
  }

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
  }

  componentDidMount() {
    let node = ReactDOM.findDOMNode(this)

    // sets node in ScrollProdiver
    this.context.scroll.setNode(node)
  }

  componentWillUnmount() {
    this.context.scroll.unsetNode()
  }

  handleScroll(e) {
    if (this.props.handleScroll) this.props.handleScroll(e)
    this.context.scroll.handleScroll(e)
  }

  handleWheel(e) {
    if (this.props.handleWheel) this.props.handleWheel(e)
    this.context.scroll.handleWheel(e)
  }

  handleTouchStart(e) {
    if (this.props.handleTouchStart) this.props.handleTouchStart(e)
    this.context.scroll.handleTouchStart(e)
  }

  handleTouchMove(e) {
    if (this.props.handleTouchMove) this.props.handleTouchMove(e)
    this.context.scroll.handleTouchMove(e)
  }

  handleTouchEnd(e) {
    if (this.props.handleTouchEnd) this.props.handleTouchEnd(e)
    this.context.scroll.handleTouchEnd(e)
  }

  render() {
    const {
      node,
      position,
      changedPosition,
      touching,
      autoScroll,
    } = this.context.scroll

    const style = {
      height: '100%',
      width: '100%',
      overflowScrolling: 'touch',
      WebkitOverflowScrolling: 'touch',
      // TODO: investigar glich on touchScroll with overFlow
      // overflowY: !autoScroll && !touching ? 'auto' : 'hidden',
      overflowY: autoScroll || touching ? 'hidden' : 'auto',
      ...this.props.style
    }

    return (
      <Motion
        style={{
          positionSpring: changedPosition !== null ? spring(changedPosition) : position
        }}
      >
      {({ positionSpring }) => {
        if (node && changedPosition !== null) {
          node.scrollTop = Math.round(positionSpring)
        }

        return (
          <div
            {...this.props}
            style={style}
            onScroll={this.handleScroll.bind(this)}
            onWheel={this.handleWheel.bind(this)}
            onTouchStart={this.handleTouchStart.bind(this)}
            onTouchMove={this.handleTouchMove.bind(this)}
            onTouchEnd={this.handleTouchEnd.bind(this)}
          />
        )
      }}
      </Motion>
    )
  }
}
