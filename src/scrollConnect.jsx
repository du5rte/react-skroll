import React, { Component, PropTypes } from 'react'
import contextProviderShape from './contextProviderShape'

export default function scrollConnect(WrappedComponent) {
  return class WrappedWithScrollConnect extends WrappedComponent {
    static contextTypes = {
      scroll: contextProviderShape
    };

    render() {
      this.props = {...this.props, ...this.context}

      return super.render()
    }
  }
}
