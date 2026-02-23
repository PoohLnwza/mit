from PIL import Image

in_path = "/Users/attachatchannakorn/.gemini/antigravity/brain/24ff6156-d9b4-4502-b72c-5457df09e190/media__1771777420684.jpg"
out_path = "/Users/attachatchannakorn/secure-sensei/assets/images/bot-avatar.png"

try:
    img = Image.open(in_path)

    # 764x1024 image
    # Cat head estimation: Centered, upper half
    # Crop a square around the head
    left = 210
    top = 210
    right = 560
    bottom = 560

    img_cropped = img.crop((left, top, right, bottom))
    # Resize to a smaller avatar size, e.g., 128x128
    img_cropped = img_cropped.resize((128, 128), Image.Resampling.LANCZOS)
    img_cropped.save(out_path)
    print("Successfully cropped and saved to", out_path)
except Exception as e:
    print("Error:", e)
