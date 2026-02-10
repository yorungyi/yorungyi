import json
import os
import random
from datetime import datetime

# Paths (Absolute paths for reliability)
BASE_DIR = r"c:\Users\emmao\OneDrive\바탕 화면\구글애드센서 수익화 앱브라우저"
GALLERY_PATH = os.path.join(BASE_DIR, "data", "gallery.json")

# Curated Prompt Pool for Automation
PROMPT_POOL = [
    {
        "category": "Cinematic",
        "title": "Neon Samurai Night",
        "url": "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=1200",
        "prompt": "Cinematic cyberpunk samurai standing in a rainy Tokyo street, neon signs reflecting in puddles, Arri Alexa, 8k, vaporwave color palette, hyper-detailed"
    },
    {
        "category": "Architecture",
        "title": "Floating Glass Pavilion",
        "url": "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200",
        "prompt": "Futuristic glass pavilion floating above a calm lake, parametric design, Zaha Hadid style, soft morning mist, Unreal Engine 5 render, architectural digest quality"
    },
    {
        "category": "Nature",
        "title": "Bioluminescent Forest",
        "url": "https://images.unsplash.com/photo-1510051646651-705307293581?w=1200",
        "prompt": "Glowing bioluminescent forest at night, magical teal and violet energy, floating spores, ethereal atmosphere, macro photography, 8k, otherworldly beauty"
    },
    {
        "category": "Interior",
        "title": "Luxury Cloud Loft",
        "url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
        "prompt": "Luxury penthouse loft in the clouds, floor-to-ceiling glass walls, minimalist furniture, golden hour warmth, 8k, architectural visualization masterpiece"
    }
]

def update_gallery():
    if not os.path.exists(GALLERY_PATH):
        print(f"Error: {GALLERY_PATH} not found.")
        return

    try:
        with open(GALLERY_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    # Select a random unique prompt from pool
    new_item = random.choice(PROMPT_POOL)
    new_item['id'] = max([item['id'] for item in data]) + 1
    new_item['date_added'] = datetime.now().strftime("%Y-%m-%d")

    data.insert(0, new_item) # Add to top

    try:
        with open(GALLERY_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Successfully added: {new_item['title']}")
    except Exception as e:
        print(f"Error writing JSON: {e}")

if __name__ == "__main__":
    update_gallery()
