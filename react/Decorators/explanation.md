# Decorators

## Introduction

React does not require decorators, but you can use them in JavaScript or TypeScript if your build tooling enables the decorator transform (for example, Babel or TypeScript configured by Webpack, Vite, or similar). Historically, some React codebases used decorators for higher-order components or state libraries, but today hooks and explicit composition are the common patterns.

## Example: Decorator-Style HOC (Legacy Pattern)

```javascript
function withLogger(Component) {
  return function Wrapped(props) {
    console.log('render', Component.name);
    return <Component {...props} />;
  };
}

@withLogger
class Profile extends React.Component {
  render() {
    return <div>Profile</div>;
  }
}
```

This relies on a decorator transform, and many teams now prefer explicit composition:

```javascript
const Profile = withLogger(function ProfileInner() {
  return <div>Profile</div>;
});
```

## When Decorators Are a Good Idea

- You already use decorators in your toolchain for other reasons.
- You want a declarative wrapper syntax for class components.

## When to Avoid

- You rely on hooks and function components (recommended).
- You want to minimize build complexity or experimental syntax.

## Practical Guidance

- Prefer hooks and explicit composition.
- If you do use decorators, document the transform and semantics clearly.
