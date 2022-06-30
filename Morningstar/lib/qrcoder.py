import os
from PIL import Image
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask

def make_qrcode(data, box_size=10, border=4, box_radius_ratio=0.7, image_size=(500, 500), icon_path=None, width_ratio=4, back_color=None, center_color=None, edge_color=None, fill_color=None):
    """可生成含有logo的二维码

    当icon_path存在时，生成含有logo的二维码

    :param data: 二维码中的数据
    :param box_size: 单个元素大小
    :param border: 相邻元素间距离
    :param box_radius_ratio: 元素形状(0:正方形, 1: 圆形)
    :param image_size: 二维码尺寸(长、宽)
    :param icon_path: logo位置
    :param width_ratio: 二维码宽度与中央logo宽度之比
    :param back_color: 背景颜色
    :param center_color: 中央颜色
    :param edge_color: 边缘颜色
    :param fill_color: 填充颜色
    :returns: A buffered writable file descriptor
    """
    # 生成二维码主体
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=box_size,
        border=border,
    )
    qr.add_data(data)  # 向二维码写入数据
    qr.make(fit=True)
    if back_color and center_color and edge_color:
        qrcode_image = qr.make_image(image_factory=StyledPilImage, module_drawer=RoundedModuleDrawer(box_radius_ratio), color_mask=RadialGradiantColorMask(back_color=back_color, center_color=center_color,edge_color=edge_color)) \
            .resize(image_size, Image.Resampling.LANCZOS).convert('RGBA')
    elif back_color and fill_color:
        qrcode_image = qr.make_image(back_color=back_color, fill_color=fill_color, module_drawer=RoundedModuleDrawer(box_radius_ratio)) .resize(image_size, Image.Resampling.LANCZOS).convert('RGBA')
    else:
        qrcode_image = qr.make_image(image_factory=StyledPilImage, module_drawer=RoundedModuleDrawer(box_radius_ratio)) \
            .resize(image_size, Image.Resampling.LANCZOS).convert('RGBA')

    if icon_path:  # 在二维码中间贴上图标
        icon_origin = Image.open(icon_path)
        icon_size = int(image_size[0] / width_ratio), int(image_size[0] / width_ratio * icon_origin.size[1] / icon_origin.size[0])
        icon = icon_origin.resize(icon_size, Image.Resampling.LANCZOS).convert('RGBA')
        icon_margin = int((image_size[0] - icon_size[0]) / 2), int((image_size[1] - icon_size[1]) / 2)
        mask_size = (icon_size[0]+box_size*2,icon_size[1]+box_size*2)
        mask_margin = int((image_size[0] - mask_size[0]) / 2), int((image_size[1] - mask_size[1]) / 2)
        mask = Image.new('RGBA', mask_size, color='white')
        qrcode_image.paste(mask, mask_margin)
        qrcode_image.paste(icon, icon_margin, icon)

    return qrcode_image
