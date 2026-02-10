import json
import os
import random
from datetime import datetime

# Paths (Relative paths for compatibility with GitHub Actions/Local)
# Get the directory where the script is located (scripts/) and go one level up
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
GALLERY_PATH = os.path.join(BASE_DIR, "data", "gallery.json")

# Curated Prompt Pool for Automation (Enriched with 20+ Professional Items)
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
    },
    {
        "category": "Fashion",
        "title": "Vogue Editorial Desert",
        "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200",
        "prompt": "High-fashion editorial photography in a vast desert, flowing silk garments, dramatic harsh shadows, cinematic desert landscape, Hasselblad H6D, professional color grading"
    },
    {
        "category": "Portrait",
        "title": "Cybernetic Oracle",
        "url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200",
        "prompt": "Close-up portrait of a woman with subtle cybernetic facial implants, glowing ethereal eyes, soft neon rim lighting, depth of field, Sony A7R IV, 85mm lens"
    },
    {
        "category": "Abstract",
        "title": "Crystalline Fluidity",
        "url": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200",
        "prompt": "Macro shot of crystalline structures merging with liquid gold, prismatic refraction, light leaks, hyper-detailed texture, 8k, abstract art masterpiece"
    },
    {
        "category": "Technology",
        "title": "Nano-Architecture Hub",
        "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
        "prompt": "Futuristic server room with nano-fiber light conduits, holographic interfaces, deep blue and cool white lighting, professional tech photography, wide angle"
    },
    {
        "category": "Fantasy",
        "title": "Emerald Dragon Peak",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200",
        "prompt": "Epic fantasy landscape with a dragon perched on a mist-covered emerald peak, soaring mountains, magical atmosphere, Digital Art, concept art style"
    },
    {
        "category": "Food",
        "title": "Zen Saffron Plate",
        "url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
        "prompt": "Michelin star food styling, molecular gastronomy dessert, intricate plating, soft diffused lighting, macro food photography, Canon 5DS R, extreme detail"
    },
    {
        "category": "Portrait",
        "title": "Vintage Soul",
        "url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200",
        "prompt": "1950s style vintage portrait, classic grain, soft focus, nostalgic warm tones, high-end fashion magazine look, elegant composition"
    },
    {
        "category": "Architecture",
        "title": "Brutalist Zenith",
        "url": "https://images.unsplash.com/photo-1490234199853-481395562770?w=1200",
        "prompt": "Grand brutalist concrete library, massive monolithic columns, natural light streaming through high slits, soft shadows, architectural photography"
    },
    {
        "category": "Nature",
        "title": "Icelandic Aurora",
        "url": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200",
        "prompt": "Stunning Aurora Borealis over a frozen Icelandic lagoon, crystal clear ice reflections, long exposure, Nikon D850, ultra sharp, breathtaking nature"
    }
]

def update_gallery():
    if not os.path.exists(GALLERY_PATH):
        print(f"Error: {GALLERY_PATH} not found (Search Path: {GALLERY_PATH})")
        return

    try:
        with open(GALLERY_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    # Filter out items already in data to avoid immediate repeats
    existing_titles = {item['title'] for item in data}
    available_pool = [item for item in PROMPT_POOL if item['title'] not in existing_titles]
    
    # If pool is exhausted relative to history, just use the full pool
    if not available_pool:
        available_pool = PROMPT_POOL

    new_item = random.choice(available_pool).copy()
    
    # Calculate new ID
    if data:
        new_item['id'] = max([item['id'] for item in data]) + 1
    else:
        new_item['id'] = 1
        
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
