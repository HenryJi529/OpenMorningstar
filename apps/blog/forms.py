import jieba

from django import forms

from .models import Comment


class CommentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['body'].widget.attrs.update({
            'class': 'auto-expend form-control rounded-xl w-full p-2 border-slate-200 bg-transparent',
            "placeholder": "留条评论呗～",
            "rows": "4",
        })

    class Meta:
        model = Comment
        fields = ['body']


class ContactForm(forms.Form):
    subject = forms.CharField(max_length=100, required=False)
    email = forms.EmailField(label='Your e-mail address', required=False)
    message = forms.CharField(max_length=300, required=True)

    def clean_message(self):
        message = self.cleaned_data['message']
        if len(list(jieba.cut(message))) < 4:
            raise forms.ValidationError("Not enough words!")
        return message
