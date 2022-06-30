from django import template

register = template.Library()


@register.filter(name='toStr')
def toStr(value):
    return ",".join(value)


@register.filter(name='removeSpace')
def removeSpace(value):
    return "".join(value.split(" "))
