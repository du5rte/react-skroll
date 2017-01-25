import React, { Component, PropTypes, Children } from 'react'
import { Motion, spring } from 'react-motion'
import { debounce } from 'throttle-debounce'

import { nodeToScrollState, nodeChildrenToScrollState } from './utilities'
import contextProviderShape from './contextProviderShape'

/** Notes

https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.2cnfo15to
https://github.com/souporserious/react-measure/blob/master/src/Measure.jsx
https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html#context
https://css-tricks.com/snippets/jquery/smooth-scrolling/
https://github.com/callmecavs/jump.js
https://github.com/jlmakes/scrollreveal
https://www.youtube.com/watch?v=rNsC1VI9388
Native browser smooth scrolling
https://github.com/d3/d3-ease
https://github.com/jaxgeller/ez.js
//  https://github.com/ReactTraining/react-router/blob/master/modules/Link.js
**/

export default class ScrollProvider extends Component {
  static childContextTypes = {
    scroll: contextProviderShape
  };

  constructor () {
    super()

    this.state = {
      location: 0,
      locationFloat: 0,
      nextLocation: null,
      end: 0,
      viewHeight: 0,
      scrollHeight: 0,
      moving: false,
      resting: true,
      onStart: true,
      onMiddle: false,
      onEnd: false,
      children: []
    }

    this.node = null
    this.setNode = this.setNode.bind(this)
    this.unsetNode = this.unsetNode.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.scrollTo = this.scrollTo.bind(this)
    this.scrollToPosition = this.scrollToPosition.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.scrollToName = this.scrollToName.bind(this)
    this.findChildByName = this.findChildByName.bind(this)
    this.scrollToElement = this.scrollToElement.bind(this)
    this.handleWheel = this.handleWheel.bind(this)
    this.handleRest = debounce(250, this.handleRest.bind(this))
    this.handleMoving = debounce(250, true, this.handleMoving.bind(this))
    this.handleRest = this.handleRest.bind(this)
  }

  setNode(node) {
    this.node = node
  }

  unsetNode() {
    this.node = null
  }

  refreshState() {
    this.setState({
      ...nodeToScrollState(this.node),
      ...nodeChildrenToScrollState(this.node)
    })
  }

  handleScroll() {
    this.refreshState()
  }

  handleMoving() {
    this.setState({ moving: true, resting: false, nextLocation: null })
  }

  handleRest() {
    this.setState({ moving: false, resting: true, nextLocation: null })
  }

  handleWheel(e) {
    this.handleMoving()

    this.handleRest()
    // e.preventDefault()
  }

  scrollTo(target, options) {
    switch(typeof target) {
      case "number":
        return this.scrollToPosition(target, options)
      case "string":
        return this.scrollToName(target, options)
      case "object":
        return this.scrollToElement(target, options)
    }
  }

  scrollToPosition(position) {
    // this.node.scrollTop = position
    this.setState({nextLocation: position})
  }

  scrollToTop() {
    const top = this.state.start

    this.scrollToPosition(start)
  }

  scrollToBottom() {
    const bottom = this.state.end

    this.scrollToPosition(start)
  }

  findChildByName(name) {
    return this.state.children.find((child) => child.name === name)
  }

  scrollToName(name) {
    const child = this.findChildByName(name)

    //  TODO: handle fail if it does not exist
    this.scrollToPosition(child.start)
  }

  scrollToElement(element, options) {
    const start = element.scrollTop

    this.scrollToPosition(start)
  }

  getChildContext() {
    return {
      scroll: {
        ...this.state,
        node: this.node,
        setNode: this.setNode,
        unsetNode: this.unsetNode,
        handleScroll: this.handleScroll,
        handleWheel: this.handleWheel,
        scrollTo: this.scrollTo,
        scrollToPosition: this.scrollToPosition,
        scrollToTop: this.scrollToTop,
        scrollToBottom: this.scrollToBottom,
        scrollToName: this.scrollToName,
        findChildByName: this.findChildByName,
        scrollToElement: this.scrollToElement,
        handleMoving: this.handleMoving,
        handleRest: this.handleRest,
      }
    }
  }

  // handleRest() {
  //   // this.setState({nextLocation: null})
  //   this.debounceHandleRest()
  // }

  render()  {
    // let locationIsAhead = this.state.nextLocation !== this.state.location
    // clone child and add context as props

    return React.cloneElement(
      this.props.children,
      this.getChildContext()
    )
  }
}


/*

return (
  <Motion
    style={{
      nextLocation: this.state.nextLocation !== null ? spring(this.state.nextLocation) : this.state.location
    }}
    onRest={() => }
  >
  {({ nextLocation }) => {
    if (this.node && this.state.nextLocation !== null) {
      this.node.scrollTop = nextLocation
    }

  }}
  </Motion>
)

*/
