import React, { Component } from 'react'

import { ScrollProvider, Scroller, ScrollLink, utilities } from '../src'

function round(val) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  return Math.round(val * precision) / precision;
}

export default class Demo extends Component {
  render() {
    const style = {
      wrapper: {
        position: 'fixed',
        height: '100%',
        width: '100%'
      }
    }

    const colors = [
      {name: "Red", color: "#e91e4f" },
      {name: "Green", color: "#4ac36c" },
      {name: "Blue", color: "#215cf4" },
    ]

    return (
      <div style={style.wrapper}>
        <nav>
          <ScrollLink
            className={this.props.scroll.onStart ? 'active' : 'inactive'}
            to={this.props.scroll.start}
            children="start"
          />
          <ScrollLink
            className={this.props.scroll.onMiddle ? 'active' : 'inactive'}
            to={Math.floor(Math.random() * this.props.scroll.end) + 1}
            children="middle"
          />
          <ScrollLink
            className={this.props.scroll.onEnd ? 'active' : 'inactive'}
            to={this.props.scroll.end}
            children="end"
          />
          {
            this.props.scroll.children.map((child, index) =>
              <ScrollLink
                key={index}
                className={child.active ? 'active' : 'inactive'}
                to={child.start}
               >
                {child.name}: {round(child.locationFloat)}
              </ScrollLink>
            )
          }
          {}
        </nav>
        <Scroller>
          {
            colors.map(({ name, color }, index) =>
              <section key={index} name={name} style={{background: color}}>
                <h1>{round(this.props.scroll.locationFloat)}</h1>
                <ul>
                  {Object.entries(this.props.scroll)
                    .filter(([key, value]) => typeof value !== 'function')
                    .filter(([key, value]) => typeof value !== 'object')
                    .map(([key, value]) =>
                    <li key={key}><span className="key">{key}:</span> <span key={key} className={value ? 'active' : 'inactive'}>{value.toString()}</span></li>
                  )}
                  <li>...</li>
                </ul>
              </section>
            )
          }
        </Scroller>
      </div>
    )
  }
}
