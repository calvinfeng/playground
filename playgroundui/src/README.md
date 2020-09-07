# Rules

## Functions

There are three types of functon declarations

```javascript
class Greeter {
  greet1() {
    ...
  }
  greet2 = () => {
    ...
  }
  greet3 = function() {
    ...
  }
}
```

- Use `greet1()` when this function is not meant to be passed to other components.
- Use `greet2()` when this function is meant to be passed to other components as callbacks.
- Do not use `greet3()`

## Styles

- Use `scss` for layout of a component.
- Use inline style for inner imported components from external libraries.