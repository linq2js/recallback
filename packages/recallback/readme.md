# `recallback`

A React hook for creating cached callback.

Inspired by this RFC https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md

## Installation

**with NPM**

```bash
npm i apiiz --save
```

**with YARN**

```bash
yarn add apiiz
```

## Usages

### Using single callback

```js
import useCallback from "recallback";

function Chat() {
  const [text, setText] = useState("");

  const onClick = useCallback(() => {
    sendMessage(text);
  });

  return <SendButton onClick={onClick} />;
}
```

### Using callback factory

Let say you have a todo list, and you want to handle toggle/remove action for each todo item, please check example below

```js
import useCallback from "recallback";

function TodoList({ todos }) {
  const handleToggleOf = useCallback((todoId) =>
    // return a click callback
    () => {
      // do something
    }
  );

  return todos.map((id) => (
    <TodoItem key={id} id={id} onToggle={handleToggleOf(id)} />
  ));
}
```
