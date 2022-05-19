# `recallback`

A React hook for creating cached callback.

Inspired by this RFC https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md

## Installation

**with NPM**

```bash
npm i recallback --save
```

**with YARN**

```bash
yarn add recallback
```

## Usages

### Using single callback

```js
import useCallback from "recallback";

function Chat() {
  const [text, setText] = useState("");

  const onClick = useCallback(
    () => {
      sendMessage(text);
    } /* no deps needed */
  );

  return <SendButton onClick={onClick} />;
}
```

### Using callback factory

Let say you have a todo list, and you want to handle toggle/remove action for each todo item, please check example below

```js
import useCachedCallback from "recallback";

function TodoList({ todos }) {
  const handleToggleOf = useCachedCallback((todoId) =>
    // return a click callback for each todo item
    // recallback will cache all callbacks
    () => {
      // do something
    }
  );

  return todos.map((todo) => (
    <TodoItem key={todo.id} id={todo.id} onToggle={handleToggleOf(todo.id)} />
  ));
}
```

### Using key selector for callback factory

By default, recallback uses first argument as callback, if the first argument is complex object, you can pass key selector to indicate which value is a key

```js
import useCachedCallback from "recallback";

function TodoList({ todos }) {
  const handleToggleOf = useCachedCallback(
    (todo) => () => {},
    // select todo id from todo object
    (todo) => todo.id
  );

  return todos.map((todo) => (
    <TodoItem key={todo.id} id={todo.id} onToggle={handleToggleOf(todo)} />
  ));
}
```

### Optimizing for children function

```jsx
import { memo, ReactNode, useEffect, useState } from "react";
import useCachedCallback from "recallback";
import "./styles.css";

const LoadContent = memo((props) => {
  const [loading, setLoading] = useState(true);
  console.log("re-render");
  useEffect(() => {
    setTimeout(setLoading, 10000, false);
  }, [setLoading]);

  // call children
  return <div>{props.children(loading)}</div>;
});

export default function App() {
  const [counter, setCounter] = useState(0);
  const renderContent = useCachedCallback((loading) => {
    return <span>{loading && "Loading..."}</span>;
  });

  return (
    <div className="App">
      <button onClick={() => setCounter(counter + 1)}>
        Counter: {counter}
      </button>
      <LoadContent>{renderContent}</LoadContent>
    </div>
  );
}
```
