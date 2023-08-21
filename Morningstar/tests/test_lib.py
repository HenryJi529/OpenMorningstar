from django.core import mail
from django.test import TestCase
from Morningstar.settings.common import EMAIL_HOST_USER
from Morningstar.lib.print import colored_format
from Morningstar.lib.qrcoder import make_qrcode
from Morningstar.lib.check import is_identity_belong_phone, is_identity_belong_email
from Morningstar.lib.passwd import generate_password


class CheckTest(TestCase):
    def test_is_identity_belong_phone(self):
        self.assertTrue(is_identity_belong_phone("13800138000"))
        self.assertFalse(is_identity_belong_phone("1380013800"))
        self.assertFalse(is_identity_belong_phone("11800138000"))
        self.assertFalse(is_identity_belong_phone("admin@morningstar.com"))

    def test_is_identity_belong_email(self):
        self.assertTrue(is_identity_belong_email("admin@morningstar.com"))
        self.assertFalse(is_identity_belong_email("admin*morningstar.com"))
        self.assertFalse(is_identity_belong_email("13800138000"))


class PasswdTest(TestCase):
    def test_generate_password(self):
        self.assertTrue(len(generate_password(length=9)) == 9)
        self.assertTrue(len(generate_password()) == 8)


class EmailTest(TestCase):
    def test_send_email(self):
        email = "guest1@morningstar.com"
        from_email = email.replace("@", "*") + "<" + EMAIL_HOST_USER + ">"
        mail.send_mail(
            "这是主题",
            "这是消息",
            from_email,
            ["admin@morningstar.com"],
            fail_silently=False,
        )
        # Test that one message has been sent.
        self.assertEqual(len(mail.outbox), 1)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, "这是主题")


class PrintTest(TestCase):
    def test_colored_format(self):
        self.assertTrue("test" in colored_format("test"))


class QrcodeTest(TestCase):
    def test_make_qrcode(self):
        data = "https://morningstar.com"
        back_color = (255, 255, 255)
        center_color = (255, 0, 255)
        edge_color = (75, 20, 147)
        qrcode_image = make_qrcode(
            data=data,
            image_size=(400, 400),
            box_radius_ratio=0.5,
            back_color=back_color,
            center_color=center_color,
            edge_color=edge_color,
        )
        self.assertEqual(qrcode_image.size, (400, 400))
