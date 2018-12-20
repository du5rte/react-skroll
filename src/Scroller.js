import React, { Component } from 'react'
import { Animated } from 'react-native'
import PropTypes from 'prop-types'

import { throttle, debounce } from 'throttle-debounce'
import ResizeObserver from 'resize-observer-polyfill'

import nodeToScrollState from './nodeToScrollState'
import nodeChildrenToScrollState from './nodeChildrenToScrollState'

const scrollInitalState = {
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
  // autoFrame: props.autoFrame,
  // autoScroll: props.autoScroll,
  originalPosition: null,
  changedPosition: null,
  timeStamp: null,
  scrolling: false,
  wheeling: false,
  touching: false,
  moving: false,
  resting: true,
  touches: [],
  deltaY: 0,
}

export default class Scroller extends Component {
  static defaultProps = {
    autoFrame: false,
    autoScroll: false,
    ScrollerNavigation: () => null
  }

  constructor(props) {
    super(props)

    this.state = {
      scroll: scrollInitalState
    }

    // debounce is used to mimiques start, move and end events that don't have this functions
    this.handleScrollStart = debounce(500, true, this.handleScrollStart)
    this.handleResizeMove = throttle(50, this.handleResizeMove)
    this.handleScrollEnd = debounce(500, this.handleScrollEnd)
    this.handleWheelStart = debounce(100, true, this.handleWheelStart)
    this.handleWheelEnd = debounce(100, this.handleWheelEnd)
    this.handleResizeStart = debounce(250, true, this.handleResizeStart)
    this.handleResizeEnd = debounce(250, this.handleResizeEnd)

    this.scrollToPrevDebounced = debounce(250, true, this.scrollToPrev)
    this.scrollToNextDebounced = debounce(250, true, this.scrollToNext)

    this.scrollValue = new Animated.Value(0)

    this.scrollValue.addListener(({ value }) => {
      // TODO: use setNative
      this.node.scrollTop = Math.round(value)
    })
  }

  componentWillUnmount() {
    this.deleteRef()
  }

  createRef = (ref) => {
    this.node = ref

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

    this.props.scrollRef(this.connection)
  }

  deleteRef = () => {
    if (this.node) {
      this.resizeObserver.disconnect(this.node)
    }

    this.setStateScroll({
      ready: false
    })
  }

  get connection() {
    return {
      ...this.state.scroll,
      autoFrame: this.props.autoFrame,
      autoScroll: this.props.autoScroll,
      scrollToPosition: this.scrollToPosition,
      scrollToByIndex: this.scrollToByIndex,
      scrollToTop: this.scrollToTop,
      scrollToBottom: this.scrollToBottom,
      scrollToPrev: this.scrollToPrev,
      scrollToNext: this.scrollToNext,
      scrollToElement: this.scrollToElement,
      scrollToActive: this.scrollToActive,
    }
  }

  setStateScroll = (additionalStates) => {
    const { onScrollChange } = this.props;

    const newScroll = {
      ...this.state.scroll,
      ...nodeToScrollState(this.node),
      ...nodeChildrenToScrollState(this.node),
      ...additionalStates
    }

    this.setState({ scroll: newScroll })

    if (onScrollChange) {
      onScrollChange(newScroll)
    }
  }

  setStateScrollStart = (additionalStates) => {
    const { position } = this.state.scroll

    this.setStateScroll({
       originalPosition: position,
       timeStamp: Date.now(),
       ...additionalStates
     })
  }

  setStateScrollMove = (additionalStates) => {
    this.setStateScroll({
       moving: true,
       resting: false,
       ...additionalStates
     })
  }

  setStateScrollRest = (additionalStates) => {
    this.setStateScroll({
      moving: false,
      resting: true,
      ...additionalStates
    })
  }

  setStateScrollEnd = (additionalStates) => {
    this.setStateScroll({
      originalPosition: null,
      changedPosition: null,
      timeStamp: null,
      ...additionalStates
    })
  }

  findChildOnView = () => {
    const { children } = this.state.scroll

    return children.find((child) => child.onView)
  }

  findChildIndexOnView = () => {
    const { children } = this.state.scroll

    return children.findIndex((child) => child.onView)
  }

  scrollToPosition = (position) => {
    Animated.spring(this.scrollValue, {
      toValue: position,
      stiffness: 170,
      damping: 26,
      useNativeDriver: true
    }).start()
  }

  scrollToByIndex = (index) => {
    const { children } = this.state.scroll

    this.scrollToPosition(children[index].start)
  }

  scrollToTop = () => {
    const { start } = this.state.scroll

    this.scrollToPosition(start)
  }

  scrollToBottom = () => {
    const { end } = this.state.scroll

    this.scrollToPosition(end)
  }

  previousOfIndex = (
    i=this.findChildIndexOnView(),
    arr=this.state.scroll.children
  ) => {
    return arr[i > 0 ? i - 1 : i]
  }

  nextOfIndex = (
    i=this.findChildIndexOnView(),
    arr=this.state.scroll.children
  ) => {
    return arr[i < arr.length - 1 ? i + 1 : i]
  }

  scrollToPrev = () => {
    const prevPosition = this.previousOfIndex().start

    this.scrollToPosition(prevPosition)
  }

  scrollToNext = () => {
    const nextPosition = this.nextOfIndex().start

    this.scrollToPosition(nextPosition)
  }

  scrollToElement = (element, options) => {
    const start = element.scrollTop

    this.scrollToPosition(start)
  }

  scrollToActive = () => {
    let newPosition = this.findChildOnView().start

    this.scrollToPosition(newPosition)
  }

  handleScroll = () => {
    this.handleScrollStart()
    this.handleScrollMove()
    this.handleScrollEnd()
  }

  handleScrollStart = () => {
    this.setStateScrollMove()
  }

  handleScrollMove = () => {
    this.setStateScroll()
  }

  handleScrollEnd = () => {
    this.setStateScrollRest()
  }

  handleResize = () => {
    this.handleResizeStart()
    this.handleResizeMove()
    this.handleResizeEnd()
  }

  handleResizeStart = () => {
    this.setStateScrollMove()
  }

  handleResizeMove = () => {
    this.handleScroll()
  }

  handleResizeEnd = () => {
    const { autoFrame } = this.props

    if (autoFrame) {
      this.scrollToActive()
    }
  }

  handleWheel = (e) => {
    const { autoScroll } = this.props

    if (autoScroll) {
      e.preventDefault()
    }

    this.handleWheelStart(e)
    this.handleWheelMove(e)
    this.handleWheelEnd(e)
  }

  handleWheelStart = (e) => {
    const { autoScroll } = this.props
    const { changedPosition } = this.state.scroll

    this.setStateScrollStart({
      wheeling: true,
      changedPosition: !autoScroll ? null : changedPosition
    })

    if (autoScroll) {
      const movingUpwards = e.deltaY > 0
      const movingDownwards = e.deltaY < 0

      if (movingDownwards) this.scrollToPrevDebounced()
      if (movingUpwards) this.scrollToNextDebounced()
    }
  }

  handleWheelMove = (e) => {
    const { autoScroll } = this.props

    if (autoScroll) {
      const prev = this.state.deltaY
      const next = e.deltaY

      const changed = Math.abs(next) > Math.abs(prev)

      if (changed) {
        const movingUpwards = next > 0
        const movingDownwards = next < 0

        if (movingDownwards) {
          this.scrollToPrevDebounced()
        }
        if (movingUpwards) {
          this.scrollToNextDebounced()
        }
      }
    }

    this.setState({ deltaY: e.deltaY })
  }

  handleWheelEnd = (e) => {
    const { autoFrame } = this.state.scroll

    this.setStateScrollEnd({
      wheeling: false,
      deltaY: null
    })

    if (autoFrame) this.scrollToActive()
  }

  handleTouchStart = (e) => {
    this.setStateScrollStart({
      touching: true,
      touches: e.touches,
    })
  }

  handleTouchMove = (e) => {
    const { touches, originalPosition } = this.state.scroll

    let distanceFromTouchStart = e.changedTouches[0].clientY - touches[0].clientY
    let touchPosition = originalPosition - distanceFromTouchStart

    this.scrollToPosition(touchPosition)
  }

  handleTouchEnd = (e) => {
    const { timeStamp, touches } = this.state.scroll

    const timeLapse = Date.now() - timeStamp

    if (timeLapse < 200) {
      const movingUpwards = e.changedTouches[0].clientY < touches[0].clientY
      const movingDownwards = e.changedTouches[0].clientY > touches[0].clientY

      if (movingDownwards) this.scrollToPrev()
      if (movingUpwards) this.scrollToNext()
    } else {
      this.scrollToActive()
    }

    this.setStateScroll({
      touching: false,
    })
  }

  render()  {
    const {
      children,
      autoFrame,
      autoScroll,
      ScrollerNavigation
    } = this.props

    return (
      <ScrollerContainer>
        <ScrollerNavigation
          scroll={this.connection}
        />
        <ScrollerContent
          scrollRef={this.createRef}
          scroll={this.state.scroll}
          onScroll={this.handleScroll}
          onWheel={this.handleWheel}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
        >
          {children}
        </ScrollerContent>
      </ScrollerContainer>
    )
  }
}

class ScrollerContainer extends Component {
  render() {
    const style = {
      height: '100%',
      width: '100%',
    }

    return <div style={style} {...this.props} />
  }
}

class ScrollerContent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (Object.keys(nextProps).includes('scroll')) {
      return false
    }

    return true
  }

  render() {
    const {
      scroll,
      scrollRef,
      autoFrame,
      autoScroll,
      ...props
    } = this.props;

    const style = {
      height: '100%',
      width: '100%',
      overflowY: autoScroll || scroll.touching ? 'hidden' : 'auto',
      // TODO: investigar glich on touchScroll with overFlow
      // overflowScrolling: 'touch',
      // WebkitOverflowScrolling: 'touch',
      // overflowY: !autoScroll && !touching ? 'auto' : 'hidden',
    }

    return (
      <div
        ref={scrollRef}
        style={style}
        {...props}
      />
    )
  }
}
