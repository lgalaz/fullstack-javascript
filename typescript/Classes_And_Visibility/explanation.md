# Classes and Visibility 

## Introduction

TypeScript adds type annotations and visibility modifiers to classes.

## Class Basics

```typescript
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  greet() {
    return `Hi ${this.name}`;
  }
}
```

Class fields are typed, and methods can use `this` safely when called as instance methods.

## Public, Private, Protected

```typescript
class Account {
  public id: string;
  private balance: number;
  protected owner: string;

  constructor(id: string, owner: string, balance: number) {
    this.id = id;
    this.owner = owner;
    this.balance = balance;
  }
}
```

`public` is the default. 
`private` restricts access to the class itself.
`protected` allows access from subclasses.

TypeScript `private` is a compile-time check. If you need runtime privacy, use JavaScript `#` private fields.

```typescript
class Secret {
  #token = 'abc';
  reveal() {
    return this.#token;
  }
}
```

`#` fields are enforced by the JavaScript runtime: they cannot be accessed outside the class, even via bracket notation.

## Parameter Properties (Constructor Property Promotion)

```typescript
class Product {
  constructor(public name: string, private price: number) {}
}
```

Parameter properties declare and initialize fields in one step, instead of manually declaring class fields and assigning in the constructor.

```typescript
class Product {
  public name: string;
  private price: number;
  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}
```

## Readonly

```typescript
class Config {
  readonly env = 'prod';
}
```

`readonly` prevents reassignment of a field after construction.

Example:

```typescript
const cfg = new Config();
cfg.env = 'dev'; // Error: cannot assign to 'env' because it is a read-only property
```

## Abstract classes and implements

```typescript
interface Serializable {
  toJSON(): string;
}

abstract class BaseModel implements Serializable {
  abstract toJSON(): string;
}

class User extends BaseModel {
  constructor(public id: number, public name: string) {
    super();
  }
  toJSON() {
    return JSON.stringify({ id: this.id, name: this.name });
  }
}
```

## Strict property initialization

With `strictPropertyInitialization`, you must initialize fields or use `!` for definite assignment.

```typescript
class Session {
  token!: string; // assigned later, but guaranteed by logic
}
```

`!` is the definite assignment assertion: it tells the compiler "this property will be assigned before it is used," even if it is not assigned in the constructor.

Example:

```typescript
class Session {
  public token!: string;
  private propA: string;

  constructor(propA: string) {
    this.propA = propA;
  }
  init(token: string) {
    this.token = token;
  }
}

const s = new Session();
s.init('abc');
console.log(s.token);
```

## Structural typing vs nominal behavior

Classes are structurally typed, but `private`/`protected` members make them nominal-like: only instances from the same declaration are compatible.

```typescript
class A {
  private value = 1;
}
class B {
  private value = 1;
}

// const a: A = new B(); // Error: private members are not compatible
```

## this typing and fluent APIs

Fluent APIs are APIs designed for method chaining, where each method returns the same object (or `this`) so calls can be chained together.

Use `this` return types to preserve subclass types in fluent APIs.

```typescript
class Builder {
  setName(_name: string): this {
    return this;
  }
}

class UserBuilder extends Builder {
  private role: 'admin' | 'user' = 'user';
  private name = '';

  setRole(role: 'admin' | 'user'): this {
    this.role = role;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return { name: this.name, role: this.role };
  }
}

const user = new UserBuilder().setName('Ada').setRole('admin').build();
// { name: 'Ada', role: 'admin' }
```

## Static vs instance members

Static members belong to the class, not instances.

```typescript
class Counter {
  static count = 0;
  constructor() {
    Counter.count += 1;
  }
}
```

## Accessors and invariants

Getters and setters let you enforce invariants without changing callers.
You might define only a setter when a write-only input updates multiple internal fields or enforces rules without exposing the stored representation. Or only a getter when its like a computed property

```typescript
class BankAccount {
  private _balance = 0;
  get balance() {
    return this._balance;
  }
  set balance(value: number) {
    if (value < 0) throw new Error('Negative balance');
    this._balance = value;
  }
}
```

## Interview Questions and Answers

### 1. What is `private` used for in TypeScript?

To prevent access to a field from outside the class.

### 2. What are parameter properties?

They declare and initialize class fields directly in the constructor signature.

### 3. When would you prefer composition over inheritance?

When behavior can be shared without deep type hierarchies; composition avoids brittle base classes and reduces coupling.

### 4. Why might you use an abstract class instead of an interface?

An abstract class can provide shared implementation and protected helpers, while still enforcing required methods.

### 5. How does TypeScript treat classes in its type system?

Classes are structurally typed, but `private`/`protected` members create nominal-like compatibility boundaries.

### 6. What is the risk of relying on `private` in TS?

It is compile-time only; at runtime the property is still accessible unless you use javascripts `#` private fields.
