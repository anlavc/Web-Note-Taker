from PIL import Image, ImageDraw

def create_icon(size, filename):
    img = Image.new('RGB', (size, size), color = (79, 70, 229)) # Primary color from CSS
    d = ImageDraw.Draw(img)
    d.text((size//4, size//4), "N", fill=(255, 255, 255))
    img.save(filename)

create_icon(16, 'icons/icon16.png')
create_icon(48, 'icons/icon48.png')
create_icon(128, 'icons/icon128.png')
