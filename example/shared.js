// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider, Subscribe, Container } from '../src/unstated';

type CounterState = {
  count: number
};

class CounterContainer extends Container<CounterState> {
  state = Object.freeze({
    count: 0
  });

  increment() {
    this.setState(draft => {
      draft.count = draft.count + 1;
    });
  }

  decrement() {
    this.setState(draft => {
      draft.count = draft.count - 1;
    });
  }
}

const sharedCounterContainer = new CounterContainer();

function Counter() {
  return (
    <Subscribe to={[sharedCounterContainer]}>
      {counter => (
        <div>
          <button onClick={() => counter.decrement()}>-</button>
          <span>{counter.state.count}</span>
          <button onClick={() => sharedCounterContainer.increment()}>+</button>
        </div>
      )}
    </Subscribe>
  );
}

render(
  <Provider>
    <Counter />
    <Counter />
    <Counter />
  </Provider>,
  window.shared
);
