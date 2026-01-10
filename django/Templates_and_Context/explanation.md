# Templates and Context

## Template Basics

Django templates are HTML with template tags:

```html
<h1>{{ title }}</h1>
{% if user.is_authenticated %}
  <p>Hello {{ user.username }}</p>
{% endif %}
```

## Context

You pass a context dict from views:

```python
return render(request, 'home.html', {'title': 'Home'})
```

## Template Inheritance

```html
<!-- base.html -->
<html>
  <body>{% block content %}{% endblock %}</body>
</html>
```

```html
<!-- page.html -->
{% extends "base.html" %}
{% block content %}
  <p>Page content</p>
{% endblock %}
```

## Filters and Tags

```html
{{ created_at|date:"Y-m-d" }}
{% for item in items %}...{% endfor %}
```

## Auto-Escaping and Security

Templates escape HTML by default to prevent XSS.
Use `|safe` only for trusted content.

## Static Files in Templates

```html
{% load static %}
<img src="{% static 'img/logo.png' %}" />
```
