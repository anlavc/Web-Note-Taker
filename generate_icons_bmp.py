

def create_icon(size, filename, color):
    img = Image.new('RGB', (size, size), color = color)
    d = ImageDraw.Draw(img)
    # Simple text to distinguish
    d.text((size//4, size//4), "N", fill=(255, 255, 255))
    img.save(filename)

# Gray color: #9ca3af (RGB: 156, 163, 175)
gray = (156, 163, 175)

# Since PIL is not available, I will use the byte writing method again but for gray icons.
# I'll just write a python script that writes the bytes directly like before but I need to change the color bytes.
# Actually, the previous script wrote a 1x1 pixel. 
# I should probably just use the same "minimal" approach but maybe try to find a gray pixel PNG byte sequence?
# Or I can just use the `generate_icons_minimal.py` approach but I don't know the bytes for gray.
# 
# Alternative: I can use the `generate_image` tool? No, that's for AI images.
# 
# Let's try to write a simple BMP with gray color using struct like I tried before but didn't use.
# The previous successful one was a hardcoded PNG.
# 
# Let's use the BMP approach which I know how to control color.
# Chrome supports BMP.

import struct

def create_bmp(width, height, filename, color):
    # BMP Header
    file_size = 54 + 3 * width * height
    header = b'BM' + struct.pack('<I', file_size) + b'\x00\x00\x00\x00\x36\x00\x00\x00'
    
    # DIB Header
    dib_header = struct.pack('<I', 40) + struct.pack('<i', width) + struct.pack('<i', height) + \
                 b'\x01\x00\x18\x00\x00\x00\x00\x00' + struct.pack('<I', 3 * width * height) + \
                 b'\x13\x0b\x00\x00\x13\x0b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
    
    # Pixel Data (BGR format)
    b, g, r = color
    pixels = bytes([b, g, r]) * width * height
    
    with open(filename, 'wb') as f:
        f.write(header + dib_header + pixels)

# Blue (Original) - #4f46e5 -> RGB(79, 70, 229) -> BGR(229, 70, 79)
create_bmp(16, 16, 'icons/icon16.bmp', (229, 70, 79))
create_bmp(48, 48, 'icons/icon48.bmp', (229, 70, 79))
create_bmp(128, 128, 'icons/icon128.bmp', (229, 70, 79))

# Gray - #9ca3af -> RGB(156, 163, 175) -> BGR(175, 163, 156)
create_bmp(16, 16, 'icons/icon16_gray.bmp', (175, 163, 156))
create_bmp(48, 48, 'icons/icon48_gray.bmp', (175, 163, 156))
create_bmp(128, 128, 'icons/icon128_gray.bmp', (175, 163, 156))
