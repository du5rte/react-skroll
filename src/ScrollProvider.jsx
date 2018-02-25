import React, { Component, Children } from 'react'
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion'
import { throttle, debounce } from 'throttle-debounce'
import ResizeObserver from 'resize-observer-polyfill'

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
findChildByposition()

child methods
- onMove()
- onRest()

**/

export default class ScrollProvider extends Component {
  static childContextTypes = {
    scroll: contextProviderShape
  }

  static defaultProps = {
    autoFrame: false,
    autoScroll: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      position: 0,
      positionRatio: 0,
      start: 0,
      end: 0,
      viewHeight: 0,
      scrollHeight: 0,
      ready: false,
      onStart: true,
      onMiddle: false,
      onEnd: false,
      children: [],
      autoFrame: props.autoFrame,
      autoScroll: props.autoScroll,
      originalPosition: null,
      changedPosition: null,
      timeStamp: null,
      scrolling: false,
      wheeling: false,
      touching: false,
      moving: false,
      resting: true,
      touches: [],
    }

    this.node = null

    // debounce is used to mimiques start, move and end events that don't have this functions
    this.handleScrollStart = debounce(500, true, this.handleScrollStart)
    this.handleResizeMove = throttle(50, this.handleResizeMove)
    this.handleScrollEnd = debounce(500, this.handleScrollEnd)
    this.handleWheelStart = debounce(250, true, this.handleWheelStart)
    this.handleWheelEnd = debounce(250, this.handleWheelEnd)
    this.handleResizeStart = debounce(250, true, this.handleResizeStart)
    this.handleResizeEnd = debounce(250, this.handleResizeEnd)
  }

  setNode(node) {
    this.node = node

    // add component to resize observer to detect changes on resize
    this.resizeObserver = new ResizeObserver((entries, observer) => {
      if (this.state.ready) {
        this.handleResize()
      } else {
        this.setStateScroll({
          ready: true
        })
      }
    })

    this.resizeObserver.observe(this.node)
  }

  unsetNode() {
    this.node = null
    this.resizeObserver.disconnect(this.context.scroll.node)

    this.setState({
      ready: true
    })
  }

  setStateScroll(additionalStates) {
    this.setState({
      ...nodeToScrollState(this.node),
      ...nodeChildrenToScrollState(this.node),
      ...additionalStates
    })
  }

  setStateStart(additionalStates) {
    this.setState({
       originalPosition: this.state.position,
       timeStamp: Date.now(),
       ...additionalStates
     })
  }

  setStateMove(additionalStates) {
    this.setState({
       moving: true,
       resting: false,
       ...additionalStates
     })
  }

  setStateRest(additionalStates) {
    this.setState({
      moving: false,
      resting: true,
      ...additionalStates
    })
  }

  setStateEnd(additionalStates) {
    this.setState({
      originalPosition: null,
      changedPosition: null,
      timeStamp: null,
      ...additionalStates
    })
  }

  setStateIfElseMove(additionalStates) {
    const notMoved = this.state.originalPosition === this.state.position

    if (notMoved) {
      // this.setStateRest(additionalStates)
    } else {
      // this.setState(additionalStates)
    }
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
    this.setState({changedPosition: position})
  }

  scrollToByIndex(index) {
    let position = this.state.children[index].start

    this.scrollTo(position)
  }

  scrollToTop() {
    const top = this.state.start

    this.scrollToPosition(top)
  }

  scrollToBottom() {
    const bottom = this.state.end

    this.scrollToPosition(bottom)
  }

  previousOfIndex(i=this.findChildIndexOnView(), arr=this.state.children) {
    return arr[i > 0 ? i - 1 : i]
  }

  nextOfIndex(i=this.findChildIndexOnView(), arr=this.state.children) {
    return arr[i < arr.length - 1 ? i + 1 : i]
  }

  scrollUpwards() {
    const upwardsPosition = this.previousOfIndex().start

    this.scrollTo(upwardsPosition)
  }

  scrollDownwards() {
    const downwardsPosition = this.nextOfIndex().start

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

  scrollToActive() {
    let newPosition = this.findChildOnView().start

    this.scrollToPosition(newPosition)
  }

  handleScroll() {
    this.handleScrollStart()
    this.handleScrollMove()
    this.handleScrollEnd()
  }

  handleScrollStart() {
    this.setStateMove()
  }

  handleScrollMove() {
    this.setStateScroll()
  }

  handleScrollEnd() {
    this.setStateRest()
  }

  handleResize() {

    this.handleResizeStart()
    this.handleResizeMove()
    this.handleResizeEnd()
  }

  handleResizeStart() {
    this.setStateMove()
  }

  handleResizeMove() {
    this.handleScroll()
  }

  handleResizeEnd() {
    if (this.state.autoFrame) this.scrollToActive()
  }

  handleWheel(e) {
    if (this.state.autoScroll) e.preventDefault()
      this.handleWheelStart(e)
      this.handleWheelMove(e)
      this.handleWheelEnd(e)
  }

  handleWheelStart(e) {
    this.setStateStart({
      wheeling: true,
      changedPosition: !this.state.autoScroll ? null : this.state.changedPosition
    })

    if (this.state.autoScroll) {
      const movingUpwards = e.deltaY > 0
      const movingDownwards = e.deltaY < 0

      if (movingDownwards) this.scrollUpwards()
      if (movingUpwards) this.scrollDownwards()
    }
  }

  handleWheelMove(e) {
    // let prevDeltaY = this.state.deltaY || 0
    // let nextDeltaY = prevDeltaY + e.deltaY
    //
    // this.setState({
    //   deltaY: nextDeltaY
    // })
    //
    // const scrollPosition = this.state.originalPosition + nextDeltaY
    //
    // this.scrollTo(scrollPosition)
  }

  handleWheelEnd(e) {
    this.setStateEnd({
      wheeling: false,
      deltaY: null
    })

    if (this.state.autoFrame) this.scrollToActive()
  }

  handleTouchStart(e) {
    this.setStateStart({
      touching: true,
      touches: e.touches,
    })
  }

  handleTouchMove(e) {
    let distanceFromTouchStart = e.changedTouches[0].clientY - this.state.touches[0].clientY
    let touchPosition = this.state.originalPosition - distanceFromTouchStart

    this.scrollToPosition(touchPosition)
  }

  handleTouchEnd(e) {
    const timeLapse = Date.now() - this.state.timeStamp

    if (timeLapse < 200) {
      const movingUpwards = e.changedTouches[0].clientY < this.state.touches[0].clientY
      const movingDownwards = e.changedTouches[0].clientY > this.state.touches[0].clientY

      if (movingDownwards) this.scrollUpwards()
      if (movingUpwards) this.scrollDownwards()
    } else {
      this.scrollToActive()
    }

    this.setState({
      touching: false,
    })
  }

  getChildContext() {
    return {
      scroll: {
        ...this.state,
        node: this.node,
        setNode: this.setNode.bind(this),
        unsetNode: this.unsetNode.bind(this),
        handleScroll: this.handleScroll.bind(this),
        handleWheel: this.handleWheel.bind(this),
        handleTouchStart: this.handleTouchStart.bind(this),
        handleTouchMove: this.handleTouchMove.bind(this),
        handleTouchEnd: this.handleTouchEnd.bind(this),
        scrollTo: this.scrollTo.bind(this),
        scrollToPosition: this.scrollToPosition.bind(this),
        scrollToByIndex: this.scrollToByIndex.bind(this),
        scrollToName: this.scrollToName.bind(this),
        scrollToTop: this.scrollToTop.bind(this),
        scrollToBottom: this.scrollToBottom.bind(this),
        scrollToElement: this.scrollToElement.bind(this),
        scrollToActive: this.scrollToActive.bind(this),
        findChildByName: this.findChildByName.bind(this),
        findChildOnView: this.findChildOnView.bind(this),
        findChildIndexOnView: this.findChildIndexOnView.bind(this),
      }
    }
  }

  getContextToProps() {
    // filter context of helper states and methods
    const {
      originalPosition,
      changedPosition,
      timeStamp,
      autoFrame,
      autoScroll,
      node,
      setNode,
      unsetNode,
      handleScroll,
      handleWheel,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      ...remainingContext
    } = this.getChildContext().scroll

    return {
      scroll: remainingContext
    }
  }

  render()  {
    return React.cloneElement(
      this.props.children,
      this.getContextToProps()
    )
  }
}
