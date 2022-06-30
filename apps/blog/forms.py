import jieba

from django import forms

from .models import Comment


class CommentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].widget.attrs.update(
            {'style': 'width:90%; padding: 0.2em;'})
        self.fields['email'].widget.attrs.update(
            {'style': 'width:90%; padding: 0.2em;'})
        self.fields['body'].widget.attrs.update(
            {'style': 'width:100%; padding: 0.5em;'})

    class Meta:
        model = Comment
        fields = ['name', 'email', 'body']


class ContactForm(forms.Form):
    subject = forms.CharField(max_length=100, required=False)
    email = forms.EmailField(label='Your e-mail address', required=False)
    message = forms.CharField(max_length=300, required=True)

    def clean_message(self):
        message = self.cleaned_data['message']
        if len(list(jieba.cut(message))) < 4:
            raise forms.ValidationError("Not enough words!")
        return message
