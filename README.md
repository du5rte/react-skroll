# react-scroll
Reactive Scrolling

[![Build Status](https://travis-ci.org/monteirocode/react-scroll.svg?branch=master)](https://travis-ci.org/monteirocode/react-scroll)

## Install

`npm install monteirocode/react-scroll --save`


## Codepen Demo

[Live Demo](http://codepen.io/monteirocode/pen/KrGjEm)


## Example Usage w/ state

```javascript
import { Scroll, initialScrollState } from 'react-scroll'

class Demo extends Component {
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

  ScrollTo(position) {
    this.setState({scrollTo: position})
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <nav>
          {
            // scroll.items: used to generate a navigator
            this.state.scroll.items.length &&
            this.state.scroll.items.map((item, index) =>
              <button
                key={index}
                className={item.active ? 'active' : 'inactive'}
                onClick={this.ScrollTo.bind(this, item.startPosition)}
               >
                {item.name}
              </button>
            )
          }
        </nav>

        <Scroll
          onScroll={this.handleScroll.bind(this)}
          scrollTo={this.state.scrollTo}
        >
          {/* name: optional, used to generate the navigator */}
          <section name="Home">
            ...
          </section>
          <section name="About">
            ...
          </section>
          <section name="Contact">
            ...
          </section>
        </Scroll>
      </div>
    )
  }
}
```

## Extra Example Usages

```javascript
scrollToTop(e) {
  this.setState({scrollTo: 0})
}

scrollToBottom(e) {
  this.setState({scrollTo: this.state.scroll.scrollLimit})
}
```

## Example Usage w/ Motion

compatible with `react-motion`
```javascript
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
    <section name="Home">
      ...
    </section>
    <section name="About">
      ...
    </section>
    <section name="Contact">
      ...
    </section>
  </Scroll>
}
</Motion>
```

## Props

#### `onScroll`: PropTypes.func
Returns a callback

```javascript
{
  "scrollTop": 0,
  "scrollHeight": 1872,
  "scrollLimit": 1404,
  "scrolling": 0,
  "start": true,
  "inbetween": false,
  "finish": false,
  "items": [ ... ]
}
```

#### `scrollTo`: PropTypes.number
Sets `scrollTop` to passed value

```javascript
this.node.scrollTop = scrollTo
```

#### `theshold`: PropTypes.number
Determines the minimum distance to set a item to `active: true`. e.g. `0.5` needs to be `50%` in view, `0` needs to be `100%` in view.

```javascript
[
  {
    "name": "Home",
    "startPosition": 0,
    "endPosition": 468,
    "scrolling": 0,
    "remainer": 0,
    "active": true,
    "framed": true,
    "viewed": false
  },
  {
    "name": "About",
    "startPosition": 468,
    "endPosition": 936,
    "scrolling": 1,
    "remainer": 1,
    "active": false,
    "framed": false,
    "viewed": false
  },
  {
    "name": "Contact",
    "startPosition": 936,
    "endPosition": 1404,
    "scrolling": 2,
    "remainer": 1,
    "active": false,
    "framed": false,
    "viewed": false
  }
]
```
