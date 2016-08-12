import React, { Component } from 'react'
import { Motion, spring, presets } from 'react-motion'

import { Scroll, initialScrollState, util } from '../src'

var { round } = util

export default class Demo extends Component {
  constructor() {
    super()

    this.state = {
      scroll: initialScrollState,
      scrollTo: 0
    }
  }

  handleScroll(scroll) {
    this.setState({ scroll })
  }

  scrollToTop(e) {
    this.setState({scrollTo: 0})
  }

  scrollToInbetween() {
    let { scrollLimit } = this.state.scroll

    let randomScroll = Math.floor(Math.random() * scrollLimit) + 1

    this.setState({scrollTo: randomScroll})
  }

  scrollToBottom(e) {
    this.setState({scrollTo: this.state.scroll.scrollLimit})
  }


  ScrollTo(position) {
    this.setState({scrollTo: position})
  }

  render() {
    console.log(this.state.scroll)

    if (this.state.scroll.items.length) {
      this.state.scroll.items.map((item) => {
        console.log(item)
      })
    }

    let wrapper = {
      height: '100%',
    }

    let colors = [
      {name: "Green", color: "#8BC34A" },
      {name: "Blue", color: "#2196F3" },
      {name: "Purple", color: "#673AB7" },
      {name: "Pink", color: "#E91E63" },
    ]

    return (
      <div style={wrapper}>
        <nav>
          <button
            className={this.state.scroll.start ? 'active' : 'inactive'}
            onClick={this.scrollToTop.bind(this)}
            children="start"
          />
          <button
            className={this.state.scroll.inbetween ? 'active' : 'inactive'}
            onClick={this.scrollToInbetween.bind(this)}
            children="inbetween"
          />
          <button
            className={this.state.scroll.finish ? 'active' : 'inactive'}
            onClick={this.scrollToBottom.bind(this)}
            children="finish"
          />
          {
            this.state.scroll.items.length &&
            this.state.scroll.items.map((item, index) =>
              <button
                key={index}
                className={item.active ? 'active' : 'inactive'}
                onClick={this.ScrollTo.bind(this, item.startPosition)}
               >
                {item.name}: {round(item.scrolling)}
              </button>
            )
          }
        </nav>
        <Motion
          style={{
            scroll: spring(this.state.scrollTo)
          }}
        >
        {({ scroll }) =>
          <Scroll
            onScroll={this.handleScroll.bind(this)}
            scrollTo={scroll}
          >
            {
              colors.map(({ name, color }) =>
                <section name={name} style={{background: color}}>
                  <h1>{round(this.state.scroll.scrolling)}</h1>
                </section>
              )
            }
          </Scroll>
        }
        </Motion>
      </div>
    )
  }
}
