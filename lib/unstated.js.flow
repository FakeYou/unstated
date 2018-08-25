// @flow
import React, { type Node } from 'react';
import createReactContext from 'create-react-context';
import produce from 'immer';

type Listener = () => mixed;

const StateContext = createReactContext(null);

export class Container<State: {}> {
  state: State = {};
  _listeners: Array<Listener> = [];

  freeze(state: State): State {
    return Object.freeze(state);
  }

  setState(producer: (draft: $Shape<State>) => void, callback?: () => void): Promise<void> {
    return Promise.resolve().then(() => {
      this.state = produce(this.state, producer);
      const promises = this._listeners.map(listener => listener());

      return Promise.all(promises).then(() => {
        if (callback) {
          return callback();
        }
      });
    });
  }

  subscribe(fn: Listener) {
    this._listeners.push(fn);
  }

  unsubscribe(fn: Listener) {
    this._listeners = this._listeners.filter(f => f !== fn);
  }
}

export type ContainerType = Container<Object>;
export type ContainersType = Array<Class<ContainerType> | ContainerType>;
export type ContainerMapType = Map<Class<ContainerType>, ContainerType>;

export type SubscribeProps<Containers: ContainersType> = {
  to: Containers,
  children: (...instances: $TupleMap<Containers, <C>(Class<C> | C) => C>) => Node
};

type SubscribeState = {};

const DUMMY_STATE = {};

export class Subscribe<Containers: ContainersType> extends React.Component<
  SubscribeProps<Containers>,
  SubscribeState
> {
  state = {};
  instances: Array<ContainerType> = [];
  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
    this._unsubscribe();
  }

  _unsubscribe() {
    this.instances.forEach(container => {
      container.unsubscribe(this.onUpdate);
    });
  }

  onUpdate: Listener = () => {
    return new Promise(resolve => {
      if (!this.unmounted) {
        this.setState(DUMMY_STATE, resolve);
      } else {
        resolve();
      }
    });
  };

  _createInstances(map: ContainerMapType | null, containers: ContainersType): Array<ContainerType> {
    this._unsubscribe();

    if (map === null) {
      throw new Error('You must wrap your <Subscribe> components with a <Provider>');
    }

    let safeMap = map;
    let instances = containers.map(ContainerItem => {
      let instance;

      if (typeof ContainerItem === 'object' && ContainerItem instanceof Container) {
        instance = ContainerItem;
      } else {
        instance = safeMap.get(ContainerItem);

        if (!instance) {
          instance = new ContainerItem();
          safeMap.set(ContainerItem, instance);
        }
      }

      instance.unsubscribe(this.onUpdate);
      instance.subscribe(this.onUpdate);

      return instance;
    });

    this.instances = instances;
    return instances;
  }

  render() {
    return (
      <StateContext.Consumer>
        {map => this.props.children.apply(null, this._createInstances(map, this.props.to))}
      </StateContext.Consumer>
    );
  }
}

export type ProviderProps = {
  inject?: Array<ContainerType>,
  children: Node
};

export function Provider(props: ProviderProps) {
  return (
    <StateContext.Consumer>
      {parentMap => {
        let childMap = new Map(parentMap);

        if (props.inject) {
          props.inject.forEach(instance => {
            childMap.set(instance.constructor, instance);
          });
        }

        return <StateContext.Provider value={childMap}>{props.children}</StateContext.Provider>;
      }}
    </StateContext.Consumer>
  );
}
