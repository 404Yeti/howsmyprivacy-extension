# HowsMyPrivacy Icons

Place the following icon files in this directory:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)  
- icon128.png (128x128 pixels)

## Icon Design Guidelines

The icons should incorporate the HowsMyPrivacy branding:
- Primary color: #fcc800 (bright yellow)
- Secondary color: #0a0a0a (black)
- Design should include a shield or lock symbol
- Should be recognizable at small sizes
- Use a simple, bold design

## Quick Icon Generation

You can use online tools like:
- Canva (canva.com)
- Figma (figma.com)
- Icon generators like favicon.io

Or create them programmatically with ImageMagick:

```bash
# Example: Create a simple yellow shield on black background
convert -size 128x128 xc:'#0a0a0a' \
  -fill '#fcc800' \
  -draw "polygon 64,20 100,50 100,100 64,120 28,100 28,50" \
  icon128.png
```
