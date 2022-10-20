from django.test import TestCase

from Morningstar.lib.qrcoder import make_qrcode

class QrcodeTest(TestCase):
    def test_make_qrcode(self):
        data = "https://morningstar.com"
        back_color=(255, 255, 255)
        center_color=(255, 0, 255)
        edge_color=(75,20,147)
        qrcode_image = make_qrcode(
            data=data, 
            image_size=(400, 400), 
            box_radius_ratio=0.5, 
            back_color=back_color, 
            center_color=center_color, 
            edge_color=edge_color
        )
        self.assertEqual(qrcode_image.size,(400, 400))