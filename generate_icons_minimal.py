import struct

def create_bmp(width, height, filename):
    # BMP Header
    file_size = 54 + 3 * width * height
    header = b'BM' + struct.pack('<I', file_size) + b'\x00\x00\x00\x00\x36\x00\x00\x00'
    
    # DIB Header
    dib_header = struct.pack('<I', 40) + struct.pack('<i', width) + struct.pack('<i', height) + \
                 b'\x01\x00\x18\x00\x00\x00\x00\x00' + struct.pack('<I', 3 * width * height) + \
                 b'\x13\x0b\x00\x00\x13\x0b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
    
    # Pixel Data (Blue background)
    pixels = b'\xff\x00\x00' * width * height # BGR format
    
    with open(filename, 'wb') as f:
        f.write(header + dib_header + pixels)

# Create PNGs (actually BMPs but named PNG to trick Chrome? No, Chrome checks mime type usually, but let's try renaming to .bmp in manifest or just making real PNGs is hard without lib. 
# Let's just make BMPs and update manifest to point to .bmp? Chrome supports BMP icons? Yes.
# But manifest expects paths. I will update manifest to use .bmp if I create .bmp.
# Or I can try to write a raw PNG. Writing raw PNG is complex.
# I will just create 1x1 pixel PNGs using a hardcoded base64 string or bytes.

# Minimal 1x1 pixel PNG byte sequence
png_1x1 = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

with open('icons/icon16.png', 'wb') as f: f.write(png_1x1)
with open('icons/icon48.png', 'wb') as f: f.write(png_1x1)
with open('icons/icon128.png', 'wb') as f: f.write(png_1x1)
