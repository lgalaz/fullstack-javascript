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

`ModelForm` reads the `Post` model and auto-creates form fields that match the model fields listed in `fields`. When you call `form.save()`, it creates or updates a `Post` instance using the validated form data.

End-to-end flow example (request → validation → save):

```python
# app_name/views.py
from django.shortcuts import render, redirect
from .forms import PostForm

def create_post(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("post_list")
    else:
        form = PostForm()
    return render(request, "post_form.html", {"form": form})
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

## Forms vs Serializers

Use Django Forms/ModelForms for **HTML form handling** (server-rendered pages). They validate user input, render form fields, and integrate with templates.

Use DRF serializers for **API input/output** (JSON). They validate JSON payloads and serialize models for API responses.

Both solve validation and data cleaning, but they live in different layers:
- Forms = HTML/UI layer.
- Serializers = API/JSON layer.
