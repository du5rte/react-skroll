# react-scroll
Reactive Scrolling

[![Build Status](https://travis-ci.org/du5rte/react-skroll.svg?branch=master)](https://travis-ci.org/du5rte/react-skroll)
[![David](https://img.shields.io/david/peer/du5rte/react-skroll.svg)](https://github.com/du5rte/react-skroll)
[![npm version](https://img.shields.io/npm/v/react-skroll.svg)](https://www.npmjs.com/package/react-skroll)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](CONTRIBUTING.md#pull-requests)

## Install
```
npm install react-skroll --save
```

## UMD
```
<script src="https://unpkg.com/react-skroll/dist/react-skroll.js"></scrip>
```
(Module exposed as `ReactSkroll`)

ReactSkroll

## Example Usage


```javascript
import { Scroll, ScrollProvider } from 'react-scroll'


## Codepen Demo
[Live Demo](http://codepen.io/du5rte/pen/KrGjEm)


## Example Usage

```javascript
import { Scroll, ScrollProvider } from 'react-scroll'

class Demo extends Component {
  render() {
    return (
      <div style={{height: '100%'}}>
        <nav>
        {
          this.props.scroll.children.map((child, index) =>
            <ScrollLink key={index} index={index} to={child.name}>
              {child.name}
            </ScrollLink>
          )
        }
        </nav>

        <Scroll>
          {/* name: optional, used to generate the navigator */}
          <section name="Home">
            ...
            <ScrollLink to="About" />
          </section>
          <section name="About">
            ...
            <ScrollLink to="Contact" />
          </section>
          <section name="Contact">
            ...
            <ScrollLink to="Home" />
          </section>
        </Scroll>
      </div>
    )
  }
}

ReactDOM.render(
  <ScrollProvider>
    <Demo />
  </ScrollProvider>,
  document.getElementById('app')
)
```

ReactDOM.render(
  <ScrollProvider>
    <Demo />
  </ScrollProvider>,
  document.getElementById('app')
)
```


>>>>>>> 1fb0d0c... whole new version with high order components
## Compatible with Redux

```javascript

@connect(browserMapStateToProps)
@scrollConnect // add after react-redux connect
export class NavLink extends Component {

  scrollOpacity(remainer) {
    return 1 - remainer + 0.15
  }

  render() {
    const style = () => {
      const child = this.props.scroll.children[this.props.index]

      if (child) {
        return {
          opacity: 1 - child.locationFloatRemainer + 0.2
        }
      } else {
        return {}
      }
    }

    return (
      <ScrollLink {...this.props} style={style} />
    )
  }
}

ReactDOM.render(
    <Provider store={store}>
      <ScrollProvider>
        <App />
      </ScrollProvider>
    </Provider>
,
  document.getElementById('app')
)
```

## Props
Check out source code:
- [ScrollProvider.jsx](https://github.com/du5rte/react-skroll/blob/master/src/ScrollProvider.jsx#L142)
- [contextProviderShape.js](https://github.com/du5rte/react-skroll/blob/master/src/contextProviderShape.js)
- [nodeToScrollState.js](https://github.com/du5rte/react-skroll/blob/master/src/nodeToScrollState.js#L18)
- [nodeChildrenToScrollState.js](https://github.com/du5rte/react-skroll/blob/master/src/nodeChildrenToScrollState.js#L37)


Types:
- location: `number`
- locationFloat: `number`
- nextLocation: `number`
- end: `number`
- viewHeight: `number`
- scrollHeight: `number`
- moving: `boolean`
- resting: `boolean`
- onStart: `boolean`
- onMiddle: `boolean`
- onEnd: `boolean`
- children: `[]`
- node: `boolean`
- setNode(`node`)
- unsetNode()
- handleScroll(`event` optinal)
- handleWheel(`event` optinal)
- scrollTo(`position` || `name` || `DOMNode`)
- scrollToPosition(`position`)
- scrollToTop()
- scrollToBottom()
- scrollToName(`name`)
- findChildByName(`name`)
- scrollToElement(`DOMNode`)
- handleMoving()
- handleRest()

## TODO
- [ ] Document
- [ ] Test
