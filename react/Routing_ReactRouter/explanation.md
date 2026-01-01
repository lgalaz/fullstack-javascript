# Routing with React Router 

## Introduction

React Router is the most common routing library for React applications. It maps URLs to components.

## Basic Setup (All in App)

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

Same idea, but in a typical app you move `BrowserRouter` to the entry file and keep routes inside `App` (or a separate routes file).

Typical app setup (entry + routes in a separate file):

```javascript
// main.jsx (entry)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```javascript
// routes.jsx (external routes file)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import User from './User';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/users/:id" element={<User />} />
    </Routes>
  );
}
```

```javascript
// App.jsx (uses the routes)
import React from 'react';
import { Link } from 'react-router-dom';
import AppRoutes from './routes';

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/42">User 42</Link>
      </nav>
      <AppRoutes />
    </>
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

Explanation: this component is rendered by a route that matches `/users/:id`. The `User` name is just a component label; the path determines the URL. `useParams()` returns the named params from the matched path, so `id` comes from the URL `/users/42`. The param name (`id`) is your choice and can be anything, as long as it matches the `:paramName` in the route.

## Nested Routes

```javascript
<Route path="/settings" element={<Settings />}>
  <Route path="profile" element={<Profile />} />
</Route>
```

Deep nesting example (3+ levels):

```javascript
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="teams" element={<Teams />}>
    <Route path=":teamId" element={<Team />}>
      <Route path="members" element={<Members />} />
    </Route>
  </Route>
</Route>
```

Render children with `Outlet` in the parent route.

```javascript
import { Outlet } from 'react-router-dom';

function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <Outlet />
    </div>
  );
}
```
Explanation: visiting `/settings/profile` renders `Settings`, and the nested `Profile` route is inserted where `<Outlet />` appears.

Deep nesting with `Outlet` (each parent renders the next level):

```javascript
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}

function Teams() {
  return (
    <div>
      <h2>Teams</h2>
      <Outlet />
    </div>
  );
}

function Team() {
  return (
    <div>
      <h3>Team</h3>
      <Outlet />
    </div>
  );
}
```
## Navigation

```javascript
import { useNavigate } from 'react-router-dom';

function SaveButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/settings')}>Save</button>;
}
```

Explanation: `useNavigate` returns a function for programmatic navigation, useful after actions like saving a form.

## Interview Questions and Answers

### 1. What does React Router do?

It maps URL paths to components and manages navigation without full page reloads.

### 2. How do you read route parameters?

Using the `useParams` hook from `react-router-dom`, which reads params defined in the route path (e.g., `/users/:id`).
