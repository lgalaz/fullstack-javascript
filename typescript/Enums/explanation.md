# Enums 

## Introduction

Enums define a set of named constants. Use string enums for safer output.

## Numeric Enums

This is a numeric enum because it has no explicit values, so TypeScript assigns numeric values starting at 0 (Idle = 0, Loading = 1, etc.). That makes it a numeric enum. If you want a string enum, you must assign string values.

```typescript
enum Status {
  Idle,
  Loading,
  Success,
  Error
}
```

Numeric enums generate a runtime object with reverse mappings, so you can look up a name by value (`Status[1] === "Loading"`) in addition to a value by name (`Status.Loading === 1`).

```typescript
console.log(Status.Loading); // 1
console.log(Status[1]); // "Loading"
```

Approximate runtime shape:

```javascript
var Status;
(function (Status) {
  Status[Status["Idle"] = 0] = "Idle";
  Status[Status["Loading"] = 1] = "Loading";
  Status[Status["Success"] = 2] = "Success";
  Status[Status["Error"] = 3] = "Error";
})(Status || (Status = {}));
```

## String Enums

```typescript
enum Role {
  Admin = 'admin',
  User = 'user'
}
```

String enums are more stable and easier to debug because their values are readable and do not change if you reorder or insert members (numeric enums auto-increment and can shift values). They do not generate reverse mappings, only the name-to-value mapping.

Approximate runtime shape:

```javascript
var Role;
(function (Role) {
  Role["Admin"] = "admin";
  Role["User"] = "user";
})(Role || (Role = {}));
```

## const enums

`const enum` values are inlined at compile time (no runtime object).

```typescript
const enum HttpStatus {
  Ok = 200,
  NotFound = 404,
}

const code = HttpStatus.Ok; // inlined as 200
```

Be careful when publishing libraries: inlining can cause mismatches if consumers compile with different settings.

Note: because `const enum` values are inlined, consumers who compile your `.ts` or `.d.ts` with `preserveConstEnums` or different compiler options can end up with emitted code that does not match the actual runtime values (or no runtime enum at all), leading to subtle versioning issues.

## When to Avoid Enums

Union of string literals is often simpler and tree-shake friendly.

```typescript
type Role = 'admin' | 'user';
```

Prefer unions when you do not need a runtime enum object. Unions are erased at compile time, tree-shake well, and avoid the extra JS output that enums produce. They also make it easier to interop with JSON or API payloads that already use string literals.

## Interview Questions and Answers

### 1. Why prefer string enums?

They are more readable and stable at runtime.

### 2. When would you avoid enums?

When a union of literals is sufficient and you want smaller bundles.
