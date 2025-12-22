# Classes and Visibility - Comprehensive Study Guide

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

## Parameter Properties

```typescript
class Product {
  constructor(public name: string, private price: number) {}
}
```

## Readonly

```typescript
class Config {
  readonly env = 'prod';
}
```

## Interview Questions and Answers

### 1. What is `private` used for in TypeScript?

To prevent access to a field from outside the class.

### 2. What are parameter properties?

They declare and initialize class fields directly in the constructor signature.
