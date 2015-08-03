# CTU React/JSX Style Guide

## Table of Contents

  1. [Basic Rules](#basic-rules)
  1. [Naming](#naming)
  1. [Declaration](#declaration)
  1. [Alignment](#alignment)
  1. [Quotes](#quotes)
  1. [Spacing](#spacing)
  1. [Props](#props)
  1. [Parentheses](#parentheses)
  1. [Tags](#tags)
  1. [Methods](#methods)
  1. [Ordering](#ordering)

## Basic Rules

* Only include one React component per file.
* Always use JSX syntax.
* Do not use `React.createElement` unless you're initializing the app from a file that is not JSX.

## `React.createClass` vs. `class`

Use `React.createClass` instead of ES6 `class extends React.Component` to take advantage of mixins and autobinding, and you can easily setup [props validation](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) and [default prop values](https://facebook.github.io/react/docs/reusable-components.html#default-prop-values).

```javascript
// good
const Listing = React.createClass({
  render () {
    return <div />
  }
})

// bad
class Listing extends React.Component {
  render () {
    return <div />
  }
}
```

### Stateless Components

Future version of React should support [stateless functions](https://github.com/reactjs/react-future/blob/master/01%20-%20Core/03%20-%20Stateless%20Functions.js) for components. This is [planned for React 0.14](https://github.com/facebook/react/pull/3995) – once this functionality is available, you are encouraged to use it.

In the meantime, explore [alternative ways to declare React components](https://gist.github.com/jquense/47bbd2613e0b03d7e51c), especially [react-stampit](https://github.com/stampit-org/react-stampit).

## Naming

  - **Extensions**: Use `.jsx` extension for React components.
  - **Filename**: Use PascalCase for filenames. E.g., `ReservationCard.jsx`.
  - **Reference Naming**: Use PascalCase for React components and camelCase for their instances:
    ```javascript
    // bad
    import reservationCard from './ReservationCard'

    // good
    import ReservationCard from './ReservationCard'

    // bad
    const ReservationItem = <ReservationCard />

    // good
    const reservationItem = <ReservationCard />
    ```

  - **Component Naming**: Use the filename as the component name. For example, `ReservationCard.jsx` should have a reference name of `ReservationCard`. However, for root components of a directory, use `index.jsx` as the filename and use the directory name as the component name:
    ```javascript
    // bad
    import Footer from './Footer/Footer.jsx'

    // bad
    import Footer from './Footer/index.jsx'

    // good
    import Footer from './Footer'
    ```


## Declaration
  - Do not use `displayName` for naming components. Instead, name the component by reference. (JSX will [infer the name from reference](https://facebook.github.io/react/docs/jsx-in-depth.html#the-transform).)

    ```javascript
    // bad
    export default React.createClass({
      displayName: 'ReservationCard',
      // stuff goes here
    })

    // good
    const ReservationCard = React.createClass {
    }
 
    export default ReservationCard
    ```

## Alignment
  - Follow these alignment styles for JS syntax

    ```javascript
    // bad
    <Foo superLongParam="bar"
         anotherSuperLongParam="baz" />

    // good
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    />

    // if props fit in one line then keep it on the same line
    <Foo bar="bar" />

    // children get indented normally
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    >
      <Spazz />
    </Foo>
    ```

## Quotes
  - Always use double quotes (`"`) for JSX attributes, but single quotes for all other JS.
    ```javascript
    // bad
    <Foo bar='bar' />

    // good
    <Foo bar="bar" />

    // bad
    <Foo style={{ left: "20px" }} />

    // good
    <Foo style={{ left: '20px' }} />
    ```

## Spacing
  - Always include a single space in your self-closing tag.
    ```javascript
    // bad
    <Foo/>

    // very bad
    <Foo                 />

    // bad
    <Foo
     />

    // good
    <Foo />
    ```

## Props
  - Always use camelCase for prop names.
    ```javascript
    // bad
    <Foo
      UserName="hello"
      phone_number={12345678}
    />

    // good
    <Foo
      userName="hello"
      phoneNumber={12345678}
    />
    ```

## Parentheses
  - Wrap JSX tags in parentheses when they span more than one line:
    ```javascript
    /// bad
    render () {
      return <MyComponent className="long body" foo="bar">
               <MyChild />
             </MyComponent>
    }

    // good
    render () {
      return (
        <MyComponent className="long body" foo="bar">
          <MyChild />
        </MyComponent>
      )
    }

    // good, when single line
    render () {
      const body = <div>hello</div>
      return <MyComponent>{body}</MyComponent>
    }
    ```

## Tags
  - Always self-close tags that have no children.
    ```javascript
    // bad
    <Foo className="stuff"></Foo>

    // good
    <Foo className="stuff" />
    ```

  - If your component has multi-line properties, close its tag on a new line.
    ```javascript
    // bad
    <Foo
      bar="bar"
      baz="baz" />

    // good
    <Foo
      bar="bar"
      baz="baz"
    />
    ```

## Methods
  - Do not use underscore prefix for internal methods of a React component.
    ```javascript
    // bad
    React.createClass({
      _onClickSubmit() {
        // do stuff
      }

      // other stuff
    })

    // good
    React.createClass({
      onClickSubmit() {
        // do stuff
      }

      // other stuff
    })
    ```

## Ordering

Ordering for `React.createClass`:

1. propTypes
1. contextTypes
1. childContextTypes
1. mixins
1. statics
1. defaultProps
1. getDefaultProps
1. getInitialState
1. getChildContext
1. componentWillMount
1. componentDidMount
1. componentWillReceiveProps
1. shouldComponentUpdate
1. componentWillUpdate
1. componentDidUpdate
1. componentWillUnmount
1. *clickHandlers or eventHandlers* like onClickSubmit() or onChangeDescription()
1. *getter methods for render* like getSelectReason() or getFooterContent()
1. *Optional render methods* like renderNavigation() or renderProfilePicture()
1. render
