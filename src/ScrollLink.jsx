import React, { Component, PropTypes } from 'react'
import { contextProviderShape } from './utilities'

export default class ScrollLink extends Component {
  static contextTypes = {
    scroll: contextProviderShape
  };

  handleClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e)
    }

    e.preventDefault()
    e.stopPropagation()

    this.context.scroll.scrollTo(this.props.to)
  }

  render() {
    const style = {
      cursor: 'pointer',
      ...this.props.style
    }
    // Fixes unknown props on <div> tag
    const { to, ...props } = this.props

    return (
      <a {...props} style={style} onClick={this.handleClick.bind(this)} />
    )
  }
}
