<div align="center">
  <a href="https://github.com/jamiebuilds/unstated">
  <br><br><br><br><br>
  <img src="https://raw.githubusercontent.com/thejameskyle/unstated/master/logo.png" alt="Unstated Logo" width="400">
  <br><br><br><br><br><br><br><br>
  </a>
</div>

# Unstated

> State so simple, it goes without saying

## Installation

```sh
yarn add unstated
```

## Fork changes

This fork of [Unstated](https://github.com/jamiebuilds/unstated) contains a few changes to add [Immer](https://github.com/mweststrate/immer). With Immer we can make the state in our containers immutable. To support Immer `setState` was changed to only accept a immer `producer`.

## Example

```js
// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider, Subscribe, Container } from 'unstated';

type CounterState = {
  count: number
};

class CounterContainer extends Container<CounterState> {
  // this.freeze is used to make the state immutable from the very beginning
  state = this.freeze({
    count: 0
  });

  increment() {
    // old method
    // this.setState({ count: this.state.count + 1 });

    // new method with a producer
    this.setState(draft => {
      draft.count += 1;
    });
  }

  decrement() {
    // old method
    // this.setState({ count: this.state.count - 1 });

    // new method with a producer
    this.setState(draft => {
      draft.count -= 1;
    });
  }
}

function Counter() {
  return (
    <Subscribe to={[CounterContainer]}>
      {counter => (
        <div>
          <button onClick={() => counter.decrement()}>-</button>
          <span>{counter.state.count}</span>
          <button onClick={() => counter.increment()}>+</button>
        </div>
      )}
    </Subscribe>
  );
}

render(
  <Provider>
    <Counter />
  </Provider>,
  document.getElementById('root')
);
```

For more examples, see the `example/` directory.
