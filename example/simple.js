// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider, Subscribe, Container } from '../src/unstated';
import produce from 'immer';

interface CounterState {
  +count: number;
}

class CounterContainer extends Container<CounterState> {
  state = Object.freeze({
    count: 0
  });

  increment() {
    this.setState(draft => {
      draft.count += 1;
    });
  }

  decrement() {
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
          {console.log(counter.state)}
          <button onClick={() => counter.decrement()}>-</button>
          <span>{counter.state.count}</span>
          <button onClick={() => counter.increment()}>+</button>
          <button onClick={() => (counter.state.count += 1)}>error</button>
        </div>
      )}
    </Subscribe>
  );
}

render(
  <Provider>
    <Counter />
  </Provider>,
  window.simple
);
