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
import useCallback from "recallback";

function TodoList({ todos }) {
  const handleToggleOf = useCallback((todoId) =>
    // return a click callback for each todo item
    // recallback will cache this callback as well
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
import useCallback from "recallback";

function TodoList({ todos }) {
  const handleToggleOf = useCallback(
    (todo) => () => {
      // do something
    },
    // select todo id from todo object
    (todo) => todo.id
  );

  return todos.map((todo) => (
    <TodoItem key={todo.id} id={todo.id} onToggle={handleToggleOf(todo)} />
  ));
}
```
