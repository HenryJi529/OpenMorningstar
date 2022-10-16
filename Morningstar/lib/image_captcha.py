import random
import os

from PIL import Image, ImageDraw, ImageFont, ImageFilter
from urllib.request import urlopen

from Morningstar.settings.common import MEDIA_ROOT


def generate_image(width=120, height=40, char_length=5, font_size=30):
    code = []
    # font_file = urlopen(truetype_url)
    font_file = os.path.join(MEDIA_ROOT, 'font/MONACO.TTF')
    img = Image.new(mode='RGB', size=(width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img, mode='RGB')

    def rndChar():
        """
        生成随机字母
        :return:
        """
        return chr(random.randint(65, 90))

    def rndColor():
        """
        生成随机颜色
        :return:
        """
        return (random.randint(0, 255), random.randint(10, 255), random.randint(64, 255))

    # 写文字
    font = ImageFont.truetype(font_file, font_size)
    for i in range(char_length):
        char = rndChar()
        code.append(char)
        h = random.randint(0, 4)
        draw.text([i * width / char_length, h],
                    char, font=font, fill=rndColor())

    # 写干扰点
    for i in range(40):
        draw.point([random.randint(0, width),
                    random.randint(0, height)], fill=rndColor())

    # 写干扰圆圈
    for i in range(40):
        draw.point([random.randint(0, width),
                    random.randint(0, height)], fill=rndColor())
        x = random.randint(0, width)
        y = random.randint(0, height)
        draw.arc((x, y, x + 4, y + 4), 0, 90, fill=rndColor())

    # 画干扰线
    for i in range(5):
        x1 = random.randint(0, width)
        y1 = random.randint(0, height)
        x2 = random.randint(0, width)
        y2 = random.randint(0, height)

        draw.line((x1, y1, x2, y2), fill=rndColor())

    img = img.filter(ImageFilter.EDGE_ENHANCE_MORE)
    return img, ''.join(code)


if __name__ == '__main__':
    image_object, code = generate_image()

    # 把图片写入文件
    with open('code.png', 'wb') as f:
        image_object.save(f, format='png')

    # 把图片的内容写到内存 stream
    """
    from io import BytesIO
    stream = BytesIO()
    image_object.save(stream, 'png')
    stream.getvalue()
    """
