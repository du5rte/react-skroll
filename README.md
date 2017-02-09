# react-skroll
Uses `react-motion` for butter smooth enhanced scrolling experience

[![Build Status](https://travis-ci.org/du5rte/react-skroll.svg?branch=master)](https://travis-ci.org/du5rte/react-skroll)
[![David](https://img.shields.io/david/peer/du5rte/react-skroll.svg)](https://github.com/du5rte/react-skroll)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](CONTRIBUTING.md#pull-requests)
[![PRs Welcome](https://img.shields.io/badge/stability-experimental-red.svg)](CONTRIBUTING.md#pull-requests)

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

## Codepen Demo
[Live Demo](http://codepen.io/du5rte/pen/KrGjEm)


## Example Usage

```javascript
import { Scroll, ScrollProvider, ScrollLink } from 'react-skroll'

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


## Compatible with Redux

```javascript
@connect(mapStateToProps)
@scrollConnect // add after react-redux connect
export class Demo extends Component {
  render() {
    ...
  }
}

ReactDOM.render(
    <Provider store={store}>
      <ScrollProvider>
        <Demo />
      </ScrollProvider>
    </Provider>,
  document.getElementById('app')
)
```

## ScrollProvider

### default
Default scrolling with scrollTo and scroll stats features

```js
<ScrollProvider>
  <Demo />
</ScrollProvider>
```
![preview ](demo/default.gif)


### autoFrame
Default scrolling with scrolling reframe the view to the current item

```js
<ScrollProvider autoFrame={true}>
  <Demo />
</ScrollProvider>
```
![preview ](demo/autoFrame.gif)

### autoScroll
Prevents default scrolling and automatically scroll to next item

```js
<ScrollProvider autoScroll={true}>
  <Demo />
</ScrollProvider>
```
![preview ](demo/autoScroll.gif)

### this.props.scroll

Types:
- position: `number`
- positionRatio: `float`
- start: `number`
- end: `number`
- viewHeight: `number`
- scrollHeight: `number`
- ready: `boolean`
- onStart: `boolean`
- onMiddle: `boolean`
- onEnd: `boolean`
- children: `[childScroll]`,
- scrolling: `boolean`
- wheeling: `boolean`
- touching: `boolean`
- moving: `boolean`
- resting: `boolean`
- scrollTo(`position: number` || `name: string` || `node: DOM Element`)
- scrollToPosition(`position`)
- scrollToByIndex(`number`)
- scrollToName(`name`)
- scrollToTop()
- scrollToBottom()
- scrollToElement()
- scrollToActive()

### this.props.scroll.children
- name: `string`
- position: `number`
- positionRatio: `float`
- positionRatioRemainer: `float`
- start: `number`
- end: `number`
- viewHeight: `number`
- onView: `boolean`
- active: `boolean`
- onFrame: `boolean`


## More on props
Check out source code:
- [ScrollProvider.jsx](https://github.com/du5rte/react-skroll/blob/master/src/ScrollProvider.jsx#L142)
- [contextProviderShape.js](https://github.com/du5rte/react-skroll/blob/master/src/contextProviderShape.js)
- [nodeToScrollState.js](https://github.com/du5rte/react-skroll/blob/master/src/nodeToScrollState.js#L18)
- [nodeChildrenToScrollState.js](https://github.com/du5rte/react-skroll/blob/master/src/nodeChildrenToScrollState.js#L37)

## TODO
- [ ] Document
- [ ] Test
