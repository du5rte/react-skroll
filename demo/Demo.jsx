import React, { Component } from 'react'

import { Scroller, scrollInitalState } from '../src'

function round(val) {
  return (Math.round(val * 100) / 100).toFixed(2);
}

const colors = [
  {name: "Blue", color: "#215cf4" },
  {name: "Cyan", color: "#0ccabf" },
  {name: "Green", color: "#4ac36c" },
  {name: "Yellow", color: "#e0be18" },
  {name: "Red", color: "#e91e4f" },
  {name: "Magenta", color: "#ca28e4" },
]

export default class Demo extends Component {
  constructor() {
    super()

    this.state = {
      scroll: scrollInitalState
    }
  }

  render() {
    const { scroll } = this.state

    return (
      <div className="wrapper">
        <nav>
          <a
            className={scroll.onStart ? 'active' : 'inactive'}
            onClick={() => this.scroll.scrollToPosition(scroll.start)}
            children="start"
          />
          {
            scroll.children.map((child, i) =>
              <a
                key={i}
                className={child.active ? 'active' : 'inactive'}
                onClick={() => this.scroll.scrollToPosition(child.start)}
               >
                {colors[i].name}
              </a>
            )
          }
          <a
            className={scroll.onEnd ? 'active' : 'inactive'}
            onClick={() => this.scroll.scrollToPosition(scroll.end)}
            children="end"
          />
        </nav>

        <Scroller
          scrollRef={ref => this.scroll = ref}
          onScrollChange={(scroll) => this.setState({ scroll })}
        >
          {
            colors.map(({ name, color }, index) =>
              <section key={index} name={name} style={{background: color}}>
                <div className="flex center-center half-width">
                  <h1>{round(scroll.positionRatio)}</h1>
                </div>

                <div className="flex left-center half-width">
                  <ul>
                    <p>{'{'}</p>

                    {
                      Object.entries(scroll)
                        .filter(([key, value]) => typeof value !== 'function')
                        .filter(([key, value]) => typeof value !== 'object')
                        .map(([key, value]) =>
                          <li key={key}>
                            <span>{key}: </span>
                            <span className={value ? 'active' : 'inactive'}>{value.toString()}</span>
                          </li>
                      )
                    }

                    <li>...</li>
                    <p>{'}'}</p>
                  </ul>
                </div>


              </section>
            )
          }
        </Scroller>
      </div>
    )
  }
}
