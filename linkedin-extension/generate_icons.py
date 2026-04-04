# Run this script once to generate icons: linkedin-extension/generate_icons.py
from PIL import Image, ImageDraw, ImageFont
import os

# Create icons directory if not exists
os.makedirs("icons", exist_ok=True)

for size in [16, 48, 128]:
    # #6366f1 (indigo)
    img = Image.new("RGBA", (size, size), (99, 102, 241, 255))
    draw = ImageDraw.Draw(img)
    
    if size >= 48:
        font_size = size // 3
        try:
            # Try common paths for fonts
            font_paths = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
                "arial.ttf"
            ]
            font = None
            for path in font_paths:
                if os.path.exists(path):
                    font = ImageFont.truetype(path, font_size)
                    break
            if not font:
                font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()
            
        # Draw RS text in center
        draw.text((size // 2, size // 2), "RS", fill="white", font=font, anchor="mm")
    
    img.save(f"icons/icon{size}.png")

print("Icons generated successfully in icons/ folder.")
