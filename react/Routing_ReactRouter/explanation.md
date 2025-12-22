# Routing with React Router - Comprehensive Study Guide

## Introduction

React Router is the most common routing library for React applications. It maps URLs to components.

## Basic Setup

```javascript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Route Params

```javascript
import { useParams } from 'react-router-dom';

function User() {
  const { id } = useParams();
  return <div>User {id}</div>;
}
```

## Nested Routes

```javascript
<Route path="/settings" element={<Settings />}
  >
  <Route path="profile" element={<Profile />} />
</Route>
```

## Interview Questions and Answers

### 1. What does React Router do?

It maps URL paths to components and manages navigation without full page reloads.

### 2. How do you read route parameters?

Using the `useParams` hook from `react-router-dom`.
