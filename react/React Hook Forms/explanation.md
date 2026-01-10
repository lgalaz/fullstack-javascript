# React Hook Form

## Introduction

React Hook Form (RHF) is a third-party library for building forms with minimal re-renders. It favors uncontrolled inputs (using refs) and only updates React state when you need it.

## Why use it

- Fewer re-renders for large forms.
- Simple API for validation and error handling.
- Easy to scale as forms grow in size and complexity.

## Basic Example

```javascript
import { useForm } from 'react-hook-form';

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      age: '',
    },
  });

  function onSubmit(data) {
    console.log('Form data:', data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /.+@.+\..+/, 
              message: 'Enter a valid email',
            },
          })}
        />
      </label>
      {errors.email && <p>{errors.email.message}</p>}

      <label>
        Age
        <input
          type="number"
          {...register('age', {
            min: { value: 5, message: 'Age must be at least 5' },
          })}
        />
      </label>
      {errors.age && <p>{errors.age.message}</p>}

      <button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

What to notice:

- `register` wires inputs to RHF without storing every keystroke in React state.
- `handleSubmit` runs validation and then calls your submit handler (in Next.js you typically send the data to a server action or API route from this handler; in other apps you can post directly to your API).
- `formState` holds field errors and status flags like `isDirty`, `isValid`, and `isSubmitting`.

## Watching values

```javascript
const { register, watch } = useForm();
const query = watch('query');
```

`watch` lets you read current field values without controlling the input.

## Using controlled inputs (Controller)

Some UI libraries require controlled inputs. RHF provides `Controller` for that case.

```javascript
import { Controller, useForm } from 'react-hook-form';

function ProfileForm() {
  const { control, handleSubmit } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="nickname"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input {...field} placeholder="Nickname" />
        )}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

## Zod validation (with resolver)

Install:

```bash
npm install zod @hookform/resolvers
```

Example:

```javascript
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  age: z.coerce.number().min(5, 'Age must be at least 5'),
});

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', age: '' },
  });

  function onSubmit(data) {
    console.log('Validated data:', data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="number" {...register('age')} placeholder="Age" />
      {errors.age && <p>{errors.age.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

## When to use RHF

- Large or complex forms where controlled inputs cause too many re-renders.
- Forms with validation rules and error messages.
- Multi-step forms or forms with dynamic fields.

## Tradeoffs

- Adds a dependency and a new API to learn.
- Some custom inputs require `Controller`.
- Debugging can feel different from plain controlled inputs.

## Summary

React Hook Form is a popular choice when you want fast forms with minimal re-renders and a clean validation story. Use it when your forms outgrow simple `useState` handling.
