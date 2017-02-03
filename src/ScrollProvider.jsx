import React, { Component, PropTypes, Children } from 'react'
import { Motion, spring } from 'react-motion'
import { debounce } from 'throttle-debounce'

import { nodeToScrollState, nodeChildrenToScrollState } from './utilities'
import contextProviderShape from './contextProviderShape'

/** Notes
## References:
- https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.2cnfo15to
- https://github.com/souporserious/react-measure/blob/master/src/Measure.jsx
- https://github.com/ReactTraining/react-router/blob/master/modules/Link.js
- https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html#context
- https://css-tricks.com/snippets/jquery/smooth-scrolling/
- https://github.com/callmecavs/jump.js
- https://github.com/jlmakes/scrollreveal
- https://www.youtube.com/watch?v=rNsC1VI9388

## TODO:
- when scrollable false scroll to next child
- when resize triggers scroll to previous position (debounce?)
- after scrolling frame view in current child (debounce?)

findChildByLocation()

child methods
- onMove()
- onRest()


<Scroller
  scrollable={false}
  touchEvents={true}
>
**/

export default class ScrollProvider extends Component {
  static childContextTypes = {
    scroll: contextProviderShape
  }

  constructor () {
    super()

    this.state = {
      location: 0,
      locationFloat: 0,
      nextLocation: null,
      end: 0,
      viewHeight: 0,
      scrollHeight: 0,
      scrollable: true,
      moving: false,
      resting: true,
      onStart: true,
      onMiddle: false,
      onEnd: false,
      touch: {},
      children: []
    }

    this.node = null
    this.setRest = debounce(250, this.setRest)
    this.setMoving = debounce(250, true, this.setMoving)
  }

  setNode(node) {
    this.node = node
  }

  unsetNode() {
    this.node = null
  }

  setPropsToContext(newProps) {
    // this.setState(newProps)
    this.state.scrollable = newProps.scrollable
  }

  setScrollState() {
    this.setState({
      ...nodeToScrollState(this.node),
      ...nodeChildrenToScrollState(this.node)
    })
  }

  setMoving() {
    this.setState({
       moving: true,
       resting: false,
       nextLocation: this.state.scrollable ? null : this.state.nextLocation
     })
  }

  setRest(cb) {
    if (cb) cb()

    this.setState({
      moving: false,
      resting: true,
      nextLocation: null
    })
  }

  findChildByName(name) {
    // TODO: log error if not found
    return this.state.children.find((child) => child.name === name)
  }

  findChildOnView() {
    return this.state.children.find((child) => child.onView)
  }

  findChildIndexOnView() {
    return this.state.children.findIndex((child) => child.onView)
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

  scrollToIndex(index) {
    let position = this.state.children[index].start

    this.scrollTo(position)
  }

  scrollToTop() {
    const top = this.state.start

    this.scrollToPosition(start)
  }

  scrollToBottom() {
    const bottom = this.state.end

    this.scrollToPosition(start)
  }

  scrollUpwards() {
    let currentChildIndex = this.findChildIndexOnView()

    let currentPosition = this.state.children[currentChildIndex].start
    let upwardsPosition = this.state.children[currentChildIndex > 0 ? currentChildIndex - 1 : currentChildIndex].start

    this.scrollTo(upwardsPosition)
  }

  scrollDownwards() {
    let currentChildIndex = this.findChildIndexOnView()

    let currentPosition = this.state.children[currentChildIndex].start
    let downwardsPosition = this.state.children[currentChildIndex < this.state.children.length - 1 ? currentChildIndex + 1 : currentChildIndex].start

    this.scrollTo(downwardsPosition)
  }

  scrollToName(name) {
    // TODO: handle fail if it does not exist
    const child = this.findChildByName(name)

    this.scrollToPosition(child.start)
  }

  scrollToElement(element, options) {
    const start = element.scrollTop

    this.scrollToPosition(start)
  }


  handleScroll() {
    this.setScrollState()
  }

  delayedReframe() {
    let newPosition = this.findChildOnView().start

    this.scrollTo(newPosition)
  }

  handleWheel(e) {
    if (!this.state.scrollable) e.preventDefault()

    this.setMoving()

    this.setRest()
  }

  handleTouchStart(e) {
    this.setMoving()
    // this.setMoving()
    // console.log('touch start')
    this.setState({
      touch: {
        originalLocation: this.state.location,
        touches: e.touches,
        timeStamp: e.timeStamp,
      }
    })
  }

  handleTouchMove(e) {
    let distanceFromTouchStart = e.changedTouches[0].clientY - this.state.touch.touches[0].clientY
    let newPosition = this.state.touch.originalLocation - distanceFromTouchStart

    this.scrollTo(newPosition)
  }

  handleTouchEnd(e) {
    let time = e.timeStamp - this.state.touch.timeStamp

    if (time < 200) {
      let movingUpwards = e.changedTouches[0].clientY < this.state.touch.touches[0].clientY
      let movingDownwards = e.changedTouches[0].clientY > this.state.touch.touches[0].clientY

      if (movingDownwards) this.scrollUpwards()
      if (movingUpwards) this.scrollDownwards()
    } else {
      let newPosition = this.findChildOnView().start

      this.scrollTo(newPosition)
    }
  }

  getChildContext() {
    return {
      scroll: {
        ...this.state,
        node: this.node,
        setNode: this.setNode.bind(this),
        unsetNode: this.unsetNode.bind(this),
        setPropsToContext: this.setPropsToContext.bind(this),
        handleScroll: this.handleScroll.bind(this),
        handleWheel: this.handleWheel.bind(this),
        handleTouchStart: this.handleTouchStart.bind(this),
        handleTouchMove: this.handleTouchMove.bind(this),
        handleTouchEnd: this.handleTouchEnd.bind(this),
        scrollTo: this.scrollTo.bind(this),
        scrollToPosition: this.scrollToPosition.bind(this),
        scrollToIndex: this.scrollToIndex.bind(this),
        scrollToTop: this.scrollToTop.bind(this),
        scrollToBottom: this.scrollToBottom.bind(this),
        scrollToName: this.scrollToName.bind(this),
        findChildByName: this.findChildByName.bind(this),
        scrollToElement: this.scrollToElement.bind(this),
        setMoving: this.setMoving.bind(this),
        setRest: this.setRest.bind(this),
      }
    }
  }

  render()  {
    return React.cloneElement(
      this.props.children,
      this.getChildContext()
    )
  }
}
