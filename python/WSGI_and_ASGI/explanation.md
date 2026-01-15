# WSGI and ASGI (Python Web Server Interfaces)

## What are they called?

- **WSGI** stands for **Web Server Gateway Interface**.
- **ASGI** stands for **Asynchronous Server Gateway Interface**.

Both are Python interface specifications that define how a web server talks to a Python web application.

Note: WSGI itself isn’t a server—it’s a spec. You can run local dev with WSGI because there are lightweight WSGI servers (including Django’s built‑in dev server) that implement the spec and can serve your app. So WSGI is the interface, and the server (gunicorn, uWSGI, Django’s dev server) is what actually runs.
Same thing for ASGI, the server is uvicorn

Design pattern: this is an interface/adapter boundary (sometimes called a "gateway"). The server calls a standardized callable, and the app conforms to that interface so it can run behind different servers without changing app code.

## What are they for?

They provide a standard contract between:

- **Your application** (Django, Flask, etc.)
- **A web server** (gunicorn, uWSGI, uvicorn, etc.)

This lets the server call your app in a predictable way, and lets your app stay server-agnostic.

## How WSGI works

WSGI is synchronous. The server calls a callable with a request environment and expects a response.

The core interface is:

- `app(environ, start_response)`

Where:

- `environ` is a dictionary of request data (headers, method, path, etc.)
- `start_response` is a callback used to start the HTTP response

The app returns an iterable of bytes for the response body. One request is handled in one thread or process at a time.

## How ASGI works

ASGI is asynchronous and supports long-lived connections like WebSockets.

The core interface is:

- `async def app(scope, receive, send)`

Where:

- `scope` describes the connection (type, path, headers, etc.)
- `receive` awaits incoming events
- `send` emits outgoing events

ASGI can handle HTTP, WebSockets, and background tasks using a single event loop.

## Key differences

- **Concurrency model**: WSGI is sync (threads/processes). ASGI is async (event loop).
- **Protocols**: WSGI is HTTP only. ASGI supports HTTP + WebSockets and other protocols.
- **Performance profile**: WSGI is great for CPU-bound or simple request/response apps. ASGI shines for I/O-heavy workloads and real-time features.
- **Server choices**: WSGI servers include gunicorn and uWSGI. ASGI servers include uvicorn and daphne.

## Where Django fits

Django ships with both:

- `wsgi.py` for WSGI deployment
- `asgi.py` for ASGI deployment

Even if your app is mostly synchronous, you can still use ASGI. Django will run sync views in a threadpool and async views in the event loop.

## Can you mix WSGI and ASGI?

You do not mix them in the same server process. A deployment is either WSGI or ASGI, because the server expects a specific interface. If you need both, the common approach is:

- Run the main app via **ASGI** (covers HTTP + WebSockets).
- Run a separate **WSGI** service only if you have legacy dependencies that require it.

In most cases, if you want both sync and async behavior, it is simpler to deploy with ASGI and let the framework run sync code in a threadpool.

## When to use which

- Use **WSGI** if the app is simple, fully synchronous, and you do not need WebSockets.
- Use **ASGI** if you need async views, WebSockets, streaming, or long-lived connections.
