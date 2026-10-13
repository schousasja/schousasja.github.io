import subprocess
import os

def generate_logos():
    print("Converting logo-original.png to raw RGBA...")
    subprocess.run(['convert', 'public/assets/images/logo-original.png', 'rgba:orig.raw'], check=True)
    
    with open('orig.raw', 'rb') as f:
        raw_orig = f.read()

    w_orig, h_orig = 1200, 600
    crop_x, crop_y = 65, 192
    w, h = 1042, 210

    logo_rgba = bytearray(w * h * 4)
    white_rgba = bytearray(w * h * 4)

    for y in range(h):
        for x in range(w):
            ox = x + crop_x
            oy = y + crop_y
            idx_orig = (oy * w_orig + ox) * 4
            r, g, b, _ = raw_orig[idx_orig:idx_orig+4]
            
            idx_out = (y * w + x) * 4
            
            dist = max(255 - r, 255 - g, 255 - b)
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            
            # 1. Dark logo (Full color with true alpha de-matting from white background)
            if dist <= 3:
                logo_rgba[idx_out:idx_out+4] = b'\x00\x00\x00\x00'
            else:
                a_float = min(1.0, max(0.0, dist / 180.0))
                a_int = int(round(a_float * 255.0))
                if a_int == 0:
                    logo_rgba[idx_out:idx_out+4] = b'\x00\x00\x00\x00'
                else:
                    fr = min(255, max(0, int(round((r - (1.0 - a_float) * 255.0) / a_float))))
                    fg = min(255, max(0, int(round((g - (1.0 - a_float) * 255.0) / a_float))))
                    fb = min(255, max(0, int(round((b - (1.0 - a_float) * 255.0) / a_float))))
                    logo_rgba[idx_out] = fr
                    logo_rgba[idx_out+1] = fg
                    logo_rgba[idx_out+2] = fb
                    logo_rgba[idx_out+3] = a_int
                    
            # 2. White logo (Pure white with calibrated optical alpha matching original stroke width)
            if dist <= 3 or lum >= 252.0:
                white_rgba[idx_out:idx_out+4] = b'\x00\x00\x00\x00'
            else:
                norm = min(1.0, max(0.0, (255.0 - lum) / (255.0 - 28.0)))
                # Optical calibration factor (1.10) compensates for irradiation effect on dark backgrounds
                a_white_float = pow(norm, 1.10)
                a_white_int = int(round(a_white_float * 255.0))
                if a_white_int == 0:
                    white_rgba[idx_out:idx_out+4] = b'\x00\x00\x00\x00'
                else:
                    white_rgba[idx_out] = 255
                    white_rgba[idx_out+1] = 255
                    white_rgba[idx_out+2] = 255
                    white_rgba[idx_out+3] = a_white_int

    with open('logo_out.raw', 'wb') as f:
        f.write(logo_rgba)
    with open('white_out.raw', 'wb') as f:
        f.write(white_rgba)

    # Convert to PNG
    subprocess.run(['convert', '-size', f'{w}x{h}', '-depth', '8', 'rgba:logo_out.raw', 'logo_gen.png'], check=True)
    subprocess.run(['convert', '-size', f'{w}x{h}', '-depth', '8', 'rgba:white_out.raw', 'white_gen.png'], check=True)

    destinations = [
        ('public/assets/images/logo.png', 'public/assets/images/logo-white.png'),
        ('public/logo.png', 'public/logo-white.png'),
        ('src/assets/images/logo.png', 'src/assets/images/logo-white.png'),
    ]

    for dark_dest, white_dest in destinations:
        os.makedirs(os.path.dirname(dark_dest), exist_ok=True)
        os.makedirs(os.path.dirname(white_dest), exist_ok=True)
        subprocess.run(['cp', 'logo_gen.png', dark_dest], check=True)
        subprocess.run(['cp', 'white_gen.png', white_dest], check=True)
        print(f"Updated {dark_dest} and {white_dest}")

    # Clean up temp files
    for temp in ['orig.raw', 'logo_out.raw', 'white_out.raw', 'logo_gen.png', 'white_gen.png', 'tl.raw', 'tw.raw', 'test_logo.raw', 'test_white.raw', 'test_logo.png', 'test_white.png', 'logo.raw', 'logo_white.raw']:
        if os.path.exists(temp):
            os.remove(temp)

    print("All logos generated and synchronized successfully!")

if __name__ == '__main__':
    generate_logos()
