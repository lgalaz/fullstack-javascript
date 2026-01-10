# Forms and ModelForms

## Forms

Forms handle validation and cleaned data.

```python
from django import forms

class SignupForm(forms.Form):
    email = forms.EmailField()
    age = forms.IntegerField(min_value=5)
```

```python
form = SignupForm(request.POST)
if form.is_valid():
    data = form.cleaned_data
```

## ModelForms

ModelForms bind forms to models:

```python
from django.forms import ModelForm
from .models import Post

class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'body']
```

## Validation Hooks

- `clean_fieldname`
- `clean`

```python
def clean_title(self):
    title = self.cleaned_data['title']
    if 'spam' in title:
        raise forms.ValidationError('No spam')
    return title
```

## Rendering

You can render forms manually or with helpers:

```html
{{ form.as_p }}
```

## CSRF

Always include CSRF tokens in POST forms:

```html
{% csrf_token %}
```
