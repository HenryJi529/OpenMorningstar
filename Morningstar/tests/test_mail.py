from django.core import mail
from django.test import TestCase
from Morningstar.settings.common import EMAIL_HOST_USER


class EmailTest(TestCase):
    def test_send_email(self):
        email = 'guest1@morningstar.com'
        from_email = email.replace("@", "*") + "<" + EMAIL_HOST_USER + ">"
        mail.send_mail(
            "这是主题",
            "这是消息",
            from_email,
            ['jeep.jipu@gmail.com'],
            fail_silently=False,
        )
        # Test that one message has been sent.
        self.assertEqual(len(mail.outbox), 1)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, '这是主题')
