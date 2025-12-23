# Type Compatibility and Structural Typing 

## Introduction

TypeScript uses structural typing: types are compatible based on their shape, not their name.

Compatibility is based on assignability rules, not runtime checks. If a value has at least the required properties with compatible types, it is assignable.

## Example

```typescript
interface Point { x: number; y: number }

type Coord = { x: number; y: number };

const p: Point = { x: 1, y: 2 };
const c: Coord = p; // OK: same shape
```

This is why TypeScript is called structurally typed: names do not matter, shapes do.

## Optional and readonly compatibility

Optional properties are compatible with required properties only in one direction.

```typescript
type RequiredUser = { id: number };
type OptionalUser = { id?: number };

const req: RequiredUser = { id: 1 };
const opt: OptionalUser = req; // OK
// const bad: RequiredUser = opt; // Error: id may be missing
```

Readonly is also checked structurally, but you can still assign readonly to mutable in some contexts (it is not enforced at runtime).

```typescript
type MutableUser = { name: string };
type ReadonlyUser = { readonly name: string };

const ro: ReadonlyUser = { name: 'Ada' };
const mu: MutableUser = ro; // OK: shapes are compatible
mu.name = 'Grace'; // Allowed by the mutable type, but mutates the same object
```

## Excess Property Checks

```typescript
function draw(p: Point) {}

draw({ x: 1, y: 2, z: 3 }); // Error: extra prop
```

Use a variable to bypass excess checks:

```typescript
const temp = { x: 1, y: 2, z: 3 };
draw(temp); // OK
```

Excess property checks only apply to object literals, not variables.

Why they exist: object literals are often written inline, so TS treats them as "fresh" and checks for unexpected keys to catch typos (e.g., `widht` vs `width`) and accidental extra data. Once a value is stored in a variable, TS assumes you intended that broader shape, so it relaxes the check.

## Function parameter variance

Function compatibility is based on parameter and return types. In `strictFunctionTypes`, parameter types are checked contravariantly for function types, while return types are checked covariantly. Most generic types are invariant by default, and some method parameters are treated bivariantly for compatibility.

Variance quick guide:

- Covariant: you can substitute a more specific type (safe for return types).
- Contravariant: you can substitute a more general type (safe for parameter types).
- Invariant: types must match exactly.
- Bivariant (some TS function params): both directions allowed for compatibility, even if unsafe.

```typescript
// Covariance (return types)
type Animal = { kind: 'animal' };
type Dog = Animal & { bark(): void };

type MakesAnimal = () => Animal;
type MakesDog = () => Dog;

const makeAnimal: MakesAnimal = () => ({ kind: 'animal' });
const makeDog: MakesDog = () => ({ kind: 'animal', bark() {} });

const okReturn: MakesAnimal = makeDog; // OK: Dog is an Animal
const badReturn: MakesDog = makeAnimal; // Error: Animal may not be a Dog
```
Why (covariance): `MakesAnimal` promises to return an `Animal`, and a `Dog` is an `Animal`, so `makeDog` can stand in. The reverse is unsafe because `makeAnimal` might return a non-dog.

```typescript
// Contravariance
type TakesAnimal = (a: Animal) => void;
type TakesDog = (d: Dog) => void;

const handleAnimal: TakesAnimal = (a: Animal) => {};
const handleDog: TakesDog = (d: Dog) => {};

const ok: TakesDog = handleAnimal; // OK: can handle any Animal, including Dog
const bad: TakesAnimal = handleDog; // Error in strictFunctionTypes
```
Why (contravariance): `TakesAnimal` promises it can handle any `Animal`, but `TakesDog` only handles `Dog`. Assigning `TakesDog` to `TakesAnimal` would allow calls like `bad({ kind: 'animal' })`, which is unsafe. The safe direction is assigning a broader-accepting function to a narrower-accepting type.

```typescript
// Invariance
type Box<T> = { value: T };

const dogBox: Box<Dog> = { value: { kind: 'animal', bark() {} } };
// const animalBox: Box<Animal> = dogBox; // Error: Box is invariant in T
```

Why (invariance): `Box<Dog>` is not assignable to `Box<Animal>` because you could write a non-dog into a `Box<Animal>` reference, breaking the `Dog` guarantee.

```typescript
// Bivariance (method parameters)
interface Handler {
  handle(a: Animal): void;
}

interface DogHandler {
  handle(d: Dog): void;
}

const dogHandler: DogHandler = {
  handle(d: Dog) {},
};

const okBivariant: Handler = dogHandler; // Allowed because methods are bivariant
```

Why (bivariance): for method parameters, TypeScript allows both directions for compatibility, which is convenient but can be unsafe if a non-dog is passed at runtime.

## Structural "nominal" behavior

Classes with `private` or `protected` members are only compatible when they come from the same declaration, giving a nominal-like effect.

```typescript
class A {
  private value = 1;
}
class B {
  private value = 1;
}

// const a: A = new B(); // Error: private members from different declarations
const aOk: A = new A(); // OK: same declaration
class C extends A {}
const aFromChild: A = new C(); // OK: private members come from A
```

## Interview Questions and Answers

### 1. What is structural typing?

Compatibility based on property shape rather than explicit declarations.

### 2. What are excess property checks?

Additional checks on object literals to prevent typos and unused fields.
