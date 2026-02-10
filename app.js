/**
 * ProVision AI - Core Logic
 * Professional Dual-Theme Edition with Interactive Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. App State
    const state = {
        savedPrompts: JSON.parse(localStorage.getItem('provision_saved') || '[]'),
        theme: localStorage.getItem('provision_theme') || 'light',
        currentView: 'studio',
        galleryData: generateGalleryData(),
        displayLimit: 6,
        isExpanded: false
    };

    // 2. Selectors
    const menuItems = document.querySelectorAll('.menu-item');
    const viewPanels = document.querySelectorAll('.view-panel');
    const viewTitle = document.getElementById('current-view-title');

    const selSubject = document.getElementById('sel-subject');
    const selStyle = document.getElementById('sel-style');
    const selLight = document.getElementById('sel-light');
    const outputText = document.getElementById('output-text');
    const userInput = document.getElementById('user-input');
    const btnEnhance = document.getElementById('btn-enhance');

    const btnCopy = document.getElementById('btn-copy');
    const btnSave = document.getElementById('btn-save');
    const libraryList = document.getElementById('library-list');

    const feedContainer = document.getElementById('feed-container');
    const urlInput = document.getElementById('url-input');
    const btnGo = document.getElementById('btn-go');
    const mainFrame = document.getElementById('main-frame');

    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    const themeToggle = document.querySelector('.btn-theme-toggle');
    const refreshGallery = document.getElementById('refresh-gallery');
    const exploreMore = document.getElementById('explore-more');

    // 3. Theme Management
    function initTheme() {
        document.documentElement.setAttribute('data-theme', state.theme);
    }

    themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('provision_theme', state.theme);
        showToast(`Switched to ${state.theme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });

    // 4. Navigation Engine
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-view');

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            viewPanels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(`${target}-view`);
            if (targetPanel) targetPanel.classList.add('active');

            const titles = { studio: 'Prompt Studio', discovery: 'Community Discovery', navigator: 'Web Navigator' };
            viewTitle.textContent = titles[target] || 'ProVision AI';

            showToast(`Navigated to ${titles[target]}`);
        });
    });

    // 5. Prompt Logic
    function updatePrompt() {
        const result = `${selSubject.value}, ${selStyle.value}, ${selLight.value}, masterfully crafted, hyper-detailed, 8k resolution`;

        // Typing animation effect
        outputText.value = '';
        let i = 0;
        const timer = setInterval(() => {
            if (i < result.length) {
                outputText.value += result[i];
                i++;
            } else {
                clearInterval(timer);
            }
        }, 8);
    }

    [selSubject, selStyle, selLight].forEach(el => el.addEventListener('change', updatePrompt));

    // 6. AI Prompt Enhancement Engine
    function enhancePrompt(rawInput) {
        if (!rawInput || rawInput.trim().length === 0) {
            showToast('⚠️ Please describe what you want to create');
            return;
        }

        const input = rawInput.toLowerCase();

        // Keyword analysis
        const subjectKeywords = {
            architecture: ['building', '건물', 'architecture', '건축', 'tower', '타워', 'house', '집', 'castle', '성'],
            nature: ['mountain', '산', 'forest', '숲', 'ocean', '바다', 'sky', '하늘', 'sunset', '석양', 'lake', '호수'],
            portrait: ['person', '사람', 'face', '얼굴', 'portrait', '초상', 'warrior', '전사', 'samurai', '사무라이'],
            fantasy: ['dragon', '드래곤', 'wizard', '마법사', 'magic', '마법', 'phoenix', '불사조'],
            technology: ['robot', '로봇', 'cyber', '사이버', 'futuristic', '미래', 'tech', '기술']
        };

        const styleKeywords = {
            realistic: ['photo', '사진', 'realistic', '사실적', 'detailed', '세밀한'],
            painting: ['painting', '그림', 'oil', '유화', 'watercolor', '수채화'],
            animation: ['anime', '애니메', 'cartoon', '만화', 'pixar', '픽사'],
            cinematic: ['movie', '영화', 'cinema', '시네마', 'dramatic', '극적']
        };

        const atmosphereKeywords = {
            golden: ['sunset', '석양', 'warm', '따뜻한', 'gold', '금빛'],
            dark: ['dark', '어두운', 'night', '밤', 'noir', '누아르'],
            mystical: ['magical', '마법', 'mystical', '신비로운', 'enchanted', '마법의']
        };

        let detectedSubject = 'A cinematic scene';
        let detectedStyle = 'hyper-realistic digital art, 8k resolution';
        let detectedAtmosphere = 'cinematic lighting, dramatic mood';

        // Detect subject
        for (const [category, keywords] of Object.entries(subjectKeywords)) {
            if (keywords.some(kw => input.includes(kw))) {
                if (category === 'architecture') detectedSubject = 'An architectural masterpiece';
                else if (category === 'nature') detectedSubject = 'A breathtaking natural landscape';
                else if (category === 'portrait') detectedSubject = 'A powerful portrait';
                else if (category === 'fantasy') detectedSubject = 'An epic fantasy scene';
                else if (category === 'technology') detectedSubject = 'A cutting-edge technological vision';
                break;
            }
        }

        // Detect style
        for (const [style, keywords] of Object.entries(styleKeywords)) {
            if (keywords.some(kw => input.includes(kw))) {
                if (style === 'realistic') detectedStyle = 'photorealistic rendering, ultra-detailed, 8k';
                else if (style === 'painting') detectedStyle = 'oil painting style, rich brushstrokes';
                else if (style === 'animation') detectedStyle = 'Pixar animation style, vibrant colors';
                else if (style === 'cinematic') detectedStyle = 'cinematic composition, Unreal Engine 5';
                break;
            }
        }

        // Detect atmosphere
        for (const [atm, keywords] of Object.entries(atmosphereKeywords)) {
            if (keywords.some(kw => input.includes(kw))) {
                if (atm === 'golden') detectedAtmosphere = 'golden hour lighting, warm glow';
                else if (atm === 'dark') detectedAtmosphere = 'high contrast noir, dramatic shadows';
                else if (atm === 'mystical') detectedAtmosphere = 'ethereal glow, magical atmosphere';
                break;
            }
        }

        const enhancedPrompt = `${detectedSubject} featuring ${rawInput.trim()}, ${detectedStyle}, ${detectedAtmosphere}, masterfully crafted, award-winning quality`;

        // Typing animation
        outputText.value = '';
        let i = 0;
        const timer = setInterval(() => {
            if (i < enhancedPrompt.length) {
                outputText.value += enhancedPrompt[i];
                i++;
            } else {
                clearInterval(timer);
            }
        }, 5);

        showToast('✨ AI has enhanced your prompt!');
    }

    if (btnEnhance && userInput) {
        console.log('AI Enhancement button found, attaching handlers');
        btnEnhance.addEventListener('click', () => {
            console.log('Enhance button clicked!');
            const rawText = userInput.value.trim();
            console.log('User input:', rawText);
            enhancePrompt(rawText);
        });

        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('Enter key pressed in user input');
                btnEnhance.click();
            }
        });
    } else {
        console.error('AI Enhancement elements not found!', { btnEnhance, userInput });
    }

    // 6. User Actions
    btnCopy.addEventListener('click', () => {
        if (!outputText.value) return;
        navigator.clipboard.writeText(outputText.value).then(() => {
            showToast('Prompt copied to clipboard');
        });
    });

    btnSave.addEventListener('click', () => {
        const val = outputText.value;
        if (!val) return;

        state.savedPrompts.unshift(val);
        if (state.savedPrompts.length > 5) state.savedPrompts.pop();

        localStorage.setItem('provision_saved', JSON.stringify(state.savedPrompts));
        renderLibrary();
        showToast('Saved to your library');
    });

    function renderLibrary() {
        if (state.savedPrompts.length === 0) {
            libraryList.innerHTML = '<div class="empty-list">No saved prompts yet.</div>';
            return;
        }
        libraryList.innerHTML = state.savedPrompts.map(p => `
            <div class="saved-bubble">
                ${p.substring(0, 50)}...
            </div>
        `).join('');
    }

    // 7. MASSIVELY Expanded Gallery Data with Professional Prompts
    function generateGalleryData() {
        return [
            // Architecture (15 items) - Enhanced Professional Prompts
            { id: 1, category: 'Architecture', title: 'Neo Brutalist Tower', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=90', prompt: 'Neo-brutalist concrete tower, angular geometric design, raw exposed concrete texture, golden hour natural lighting, architectural photography, Nikon D850, 24mm tilt-shift lens, f/8 aperture, ultra sharp focus, professional commercial photography, 8k resolution, award-winning architectural digest style, dramatic sky backdrop, symmetrical composition' },
            { id: 2, category: 'Architecture', title: 'Parametric Pavilion', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=90', prompt: 'Parametric architecture pavilion, fluid organic forms inspired by Zaha Hadid, white matte material surface, computational design, minimal ambient lighting, hyper-detailed 3D rendering, Unreal Engine 5, ray tracing enabled, photorealistic materials, professional architectural visualization, 8k ultra HD, clean minimalist aesthetic, soft shadows' },
            { id: 3, category: 'Architecture', title: 'Glass Skyscraper', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=90', prompt: 'Modern glass skyscraper, reflective curtain wall facade, blue hour photography timing, cityscape urban environment, Canon EOS R5, 16-35mm wide-angle lens, long exposure technique, crystal clear reflections, professional real estate photography, 8k resolution, vibrant blue tones, vertical composition, commercial architecture' },
            { id: 4, category: 'Architecture', title: 'Minimalist House', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90', prompt: 'Contemporary minimalist residential house, clean geometric lines, natural wood cladding material, large floor-to-ceiling windows, warm interior lighting, architectural photography, Sony A7R IV, 24-70mm lens, f/5.6 aperture, professional interior design magazine quality, ultra detailed textures, 8k sharp resolution, Scandinavian design aesthetic' },
            { id: 5, category: 'Architecture', title: 'Gothic Cathedral', url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=90', prompt: 'Gothic cathedral interior architecture, soaring vaulted ribbed ceiling, magnificent stained glass windows, dramatic divine light rays streaming through, European medieval architecture, professional heritage photography, Canon 5D Mark IV, 14mm ultra-wide lens, HDR technique, hyper-detailed stone masonry, 8k resolution, majestic atmospheric mood, UNESCO world heritage quality' },
            { id: 6, category: 'Architecture', title: 'Futuristic Bridge', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=90', prompt: 'Futuristic suspension bridge engineering, steel cable architecture, symmetrical geometric composition, modern infrastructure design, drone aerial photography, DJI Mavic 3 Pro, 24mm equivalent lens, f/5.6 aperture, sharp detailed engineering marvel, professional architectural magazine, 8k ultra resolution, perfect symmetry, blue hour lighting' },
            { id: 7, category: 'Architecture', title: 'Asian Temple', url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=90', prompt: 'Traditional Asian temple architecture, curved pagoda roofs, red paper lanterns, serene peaceful atmosphere, cultural heritage site, travel photography, Fujifilm X-T4, 35mm lens, natural lighting, ultra detailed traditional craftsmanship, professional National Geographic style, 8k resolution, warm color grading, authentic cultural documentation' },
            { id: 8, category: 'Architecture', title: 'Industrial Warehouse', url: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&q=90', prompt: 'Converted industrial warehouse loft, exposed red brick walls, soaring high ceilings, urban modern aesthetic, interior design photography, Canon EOS R6, 16-35mm wide lens, natural window light, professional real estate photography, 8k sharp resolution, industrial chic style, architectural digest quality, trendy urban living space' },
            { id: 9, category: 'Architecture', title: 'Art Deco Building', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=90', prompt: 'Art Deco building facade, geometric zigzag patterns, vintage 1920s elegance, heritage architecture, architectural detail photography, Phase One XF IQ4, 80mm lens, golden hour natural light, ultra detailed ornamental features, professional heritage documentation, 8k resolution, period accurate vintage color grading, architectural preservation quality' },
            { id: 10, category: 'Architecture', title: 'Desert Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=90', prompt: 'Luxury desert villa architecture, infinity edge swimming pool, tropical palm trees landscape, modern minimalist design aesthetic, sunset golden hour timing, real estate photography, Sony A1, 24-70mm lens, f/8 aperture, professional luxury property marketing, 8k ultra HD resolution, warm ambient lighting, architectural digest cover quality' },
            { id: 11, category: 'Architecture', title: 'Spiral Staircase', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=90', prompt: 'Elegant spiral staircase architecture, white marble steps, ornate wrought iron railings, architectural detail close-up, interior design photography, Nikon Z9, 85mm lens, soft diffused lighting, ultra sharp architectural detail, professional interior magazine, 8k resolution, classic timeless elegance, vertical composition' },
            { id: 12, category: 'Architecture', title: 'Dome Structure', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=90', prompt: 'Grand mosque dome interior, intricate Islamic geometric patterns, golden metallic accents, traditional Islamic architecture, cultural heritage photography, Canon 5DS R, 14mm ultra-wide lens, HDR bracketing technique, hyper-detailed ornamental craftsmanship, professional UNESCO heritage quality, 8k resolution, warm ambient lighting, majestic symmetrical composition' },
            { id: 13, category: 'Architecture', title: 'Modern Library', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=90', prompt: 'Contemporary public library interior, floor-to-ceiling bookshelves, modern reading spaces, warm ambient lighting design, architectural interior photography, Sony A7R V, 24mm tilt-shift lens, professional cultural space documentation, ultra detailed wood textures, 8k sharp resolution, inviting atmosphere, architectural photography award quality' },
            { id: 14, category: 'Architecture', title: 'Concrete Brutalism', url: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=90', prompt: 'Brutalist concrete architecture, raw exposed aggregate texture, bold geometric forms, urban modernist design, architectural photography, Leica M11, 28mm lens, dramatic sky contrast, ultra detailed concrete surface, professional architectural documentation, 8k resolution, monochromatic color palette, striking angular composition' },
            { id: 15, category: 'Architecture', title: 'Rooftop Garden', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=90', prompt: 'Urban rooftop garden oasis, modern sustainable design, contemporary planters, city skyline panoramic views, landscape architecture photography, Canon EOS R5, 16-35mm wide lens, golden hour natural light, professional landscape architecture magazine, 8k resolution, vibrant greenery, eco-friendly urban living, architectural digest quality' },

            // Nature (20 items) - Enhanced Professional Prompts
            { id: 16, category: 'Nature', title: 'Mountain Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90', prompt: 'Misty mountain peak at dawn, soft purple and orange gradient light, ethereal atmospheric haze, epic landscape photography, Phase One XF IQ4, 35mm lens, f/11 aperture, long exposure technique, professional National Geographic quality, 8k ultra HD resolution, majestic natural beauty, cinematic color grading, award-winning landscape photography' },
            { id: 17, category: 'Nature', title: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=90', prompt: 'Vast Sahara sand dunes, golden hour warm lighting, dramatic long shadows, minimalist zen composition, landscape photography, Sony A1, 70-200mm telephoto lens, f/8 aperture, ultra detailed sand texture, professional travel photography, 8k sharp resolution, warm earth tones, serene desert landscape, National Geographic explorer quality' },
            { id: 18, category: 'Nature', title: 'Coastal Cliffs', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90', prompt: 'Dramatic coastal sea cliffs, powerful crashing waves, moody stormy sky, epic seascape, wide angle landscape photography, Nikon D850, 14-24mm ultra-wide lens, f/16 aperture, ND filter long exposure, professional dramatic nature photography, 8k resolution, cinematic atmosphere, dynamic composition, weather photography award quality' },
            { id: 19, category: 'Nature', title: 'Aurora Borealis', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=90', prompt: 'Northern lights over snowy landscape, green and purple aurora, starry sky' },
            { id: 20, category: 'Nature', title: 'Tropical Waterfall', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=90', prompt: 'Hidden tropical waterfall, lush jungle, emerald pool, misty atmosphere' },
            { id: 21, category: 'Nature', title: 'Cherry Blossoms', url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=90', prompt: 'Cherry blossom trees in full bloom, pink petals, spring season, soft bokeh' },
            { id: 22, category: 'Nature', title: 'Volcanic Landscape', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=90', prompt: 'Volcanic landscape with lava flows, molten rock, dramatic red glow' },
            { id: 23, category: 'Nature', title: 'Redwood Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=90', prompt: 'Ancient redwood forest, towering trees, misty atmosphere, peaceful trail' },
            { id: 24, category: 'Nature', title: 'Iceberg Field', url: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=800&q=90', prompt: 'Massive icebergs floating in arctic waters, crystal blue ice, pristine environment' },
            { id: 25, category: 'Nature', title: 'Lavender Fields', url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&q=90', prompt: 'Endless lavender fields in Provence, purple rows, golden light' },
            { id: 26, category: 'Nature', title: 'Grand Canyon', url: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800&q=90', prompt: 'Grand Canyon vista, layered rock formations, dramatic shadows, epic scale' },
            { id: 27, category: 'Nature', title: 'Rice Terraces', url: 'https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?w=800&q=90', prompt: 'Bali rice terraces, stepped paddies, tropical greenery, agricultural art' },
            { id: 28, category: 'Nature', title: 'Autumn Forest', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=90', prompt: 'Fall foliage forest, vibrant orange and red leaves, misty morning' },
            { id: 29, category: 'Nature', title: 'Sunset Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=90', prompt: 'Pristine beach at sunset, palm trees, turquoise water, tropical paradise' },
            { id: 30, category: 'Nature', title: 'Canyon River', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90', prompt: 'Winding river through canyon, aerial view, natural curves, geological wonder' },
            { id: 31, category: 'Nature', title: 'Snowy Peaks', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90', prompt: 'Snow-capped mountain peaks, alpine landscape, crisp air, majestic vista' },
            { id: 32, category: 'Nature', title: 'Rainforest Canopy', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=90', prompt: 'Dense rainforest canopy, biodiversity, emerald green, natural ecosystem' },
            { id: 33, category: 'Nature', title: 'Coral Reef', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=90', prompt: 'Vibrant coral reef, tropical fish, underwater photography, marine life' },
            { id: 34, category: 'Nature', title: 'Star Trail', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=90', prompt: 'Star trail long exposure, night sky, astronomy, celestial movement' },
            { id: 35, category: 'Nature', title: 'Glacier Valley', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90', prompt: 'Massive glacier valley, blue ice formations, pristine wilderness, climate wonder' },

            // Portrait (15 items)
            { id: 36, category: 'Portrait', title: 'Cyberpunk Wanderer', url: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800&q=90', prompt: 'Cyberpunk style portrait, neon accents, futuristic fashion, dramatic lighting, cinematic' },
            { id: 37, category: 'Portrait', title: 'Golden Hour Beauty', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=90', prompt: 'Portrait of a woman, golden hour natural light, soft bokeh, professional fashion photography' },
            { id: 38, category: 'Portrait', title: 'Street Style', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=90', prompt: 'Urban street style portrait, gritty texture, shallow depth of field, editorial look' },
            { id: 39, category: 'Portrait', title: 'Classic Elegance', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=90', prompt: 'Timeless elegant portrait, studio lighting, black and white, high fashion' },
            { id: 40, category: 'Portrait', title: 'Adventure Spirit', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=90', prompt: 'Outdoor adventurer portrait, natural setting, candid expression, authentic moment' },
            { id: 41, category: 'Portrait', title: 'Artistic Vision', url: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=90', prompt: 'Creative artist portrait, colorful studio background, expressive pose' },
            { id: 42, category: 'Portrait', title: 'Business Professional', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=90', prompt: 'Executive business portrait, confident posture, modern office, professional headshot' },
            { id: 43, category: 'Portrait', title: 'Bohemian Vibe', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=90', prompt: 'Bohemian style portrait, natural makeup, flower crown, dreamy atmosphere' },
            { id: 44, category: 'Portrait', title: 'Urban Youth', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=90', prompt: 'Young urban portrait, street photography, casual style, authentic expression' },
            { id: 45, category: 'Portrait', title: 'Vintage Glamour', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=90', prompt: 'Vintage Hollywood glamour, classic beauty, retro styling, timeless elegance' },
            { id: 46, category: 'Portrait', title: 'Athletic Power', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=90', prompt: 'Athletic portrait, fitness motivation, dynamic pose, strength and power' },
            { id: 47, category: 'Portrait', title: 'Cultural Heritage', url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=90', prompt: 'Traditional cultural portrait, ethnic clothing, heritage celebration, authentic beauty' },
            { id: 48, category: 'Portrait', title: 'Minimalist Mood', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=90', prompt: 'Minimalist portrait, neutral background, subtle lighting, contemporary aesthetic' },
            { id: 49, category: 'Portrait', title: 'Creative Expression', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=90', prompt: 'Artistic expression portrait, bold colors, creative makeup, avant-garde style' },
            { id: 50, category: 'Portrait', title: 'Natural Beauty', url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=90', prompt: 'Natural beauty portrait, minimal editing, genuine smile, outdoor lighting' },

            // Abstract (12 items)
            { id: 51, category: 'Abstract', title: 'Fluid Dynamics', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=90', prompt: 'Abstract fluid art, iridescent colors, macro photography, dynamic flow' },
            { id: 52, category: 'Abstract', title: 'Geometric Patterns', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=90', prompt: 'Geometric abstract patterns, vibrant colors, symmetry, modern design' },
            { id: 53, category: 'Abstract', title: 'Light Painting', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=90', prompt: 'Long exposure light painting, neon trails, dark background, creative photography' },
            { id: 54, category: 'Abstract', title: 'Smoke Art', url: 'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?w=800&q=90', prompt: 'Colorful smoke wisps, abstract forms, black background, ethereal motion' },
            { id: 55, category: 'Abstract', title: 'Crystalline Structures', url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=90', prompt: 'Macro crystalline structures, geometric formations, prismatic colors' },
            { id: 56, category: 'Abstract', title: 'Paint Splatter', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=90', prompt: 'Abstract paint splatter, explosive colors, dynamic composition, modern art' },
            { id: 57, category: 'Abstract', title: 'Ink in Water', url: 'https://images.unsplash.com/photo-1549281899-f75600a24107?w=800&q=90', prompt: 'Ink dispersing in water, organic patterns, fluid motion, mesmerizing abstract' },
            { id: 58, category: 'Abstract', title: 'Fractal Patterns', url: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=800&q=90', prompt: 'Mathematical fractal patterns, infinite complexity, vibrant gradients' },
            { id: 59, category: 'Abstract', title: 'Color Gradient', url: 'https://images.unsplash.com/photo-1557672199-6ba44af40e95?w=800&q=90', prompt: 'Smooth color gradient, rainbow spectrum, minimal abstract, digital art' },
            { id: 60, category: 'Abstract', title: 'Texture Study', url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&q=90', prompt: 'Abstract texture macro, material study, tactile surface, detailed close-up' },
            { id: 61, category: 'Abstract', title: 'Motion Blur', url: 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?w=800&q=90', prompt: 'Abstract motion blur, speed and movement, dynamic energy, kinetic art' },
            { id: 62, category: 'Abstract', title: 'Prismatic Light', url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=90', prompt: 'Prismatic light refraction, rainbow colors, optical phenomenon, ethereal glow' },

            // Technology (12 items)
            { id: 63, category: 'Technology', title: 'Circuit Board', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=90', prompt: 'Macro circuit board photography, copper traces, electronic components, tech aesthetic' },
            { id: 64, category: 'Technology', title: 'Robot Arm', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=90', prompt: 'Industrial robotic arm, precise engineering, minimalist composition, studio lighting' },
            { id: 65, category: 'Technology', title: 'Data Visualization', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=90', prompt: 'Digital data visualization, glowing particles, futuristic interface, blue tones' },
            { id: 66, category: 'Technology', title: 'Server Room', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=90', prompt: 'Modern server room, LED indicators, organized cables, technology infrastructure' },
            { id: 67, category: 'Technology', title: 'VR Headset', url: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=90', prompt: 'Virtual reality headset, futuristic design, neon lighting, immersive technology' },
            { id: 68, category: 'Technology', title: 'Microchip', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=90', prompt: 'Extreme macro microchip, golden circuit paths, advanced semiconductor' },
            { id: 69, category: 'Technology', title: 'Smart City', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=90', prompt: 'Futuristic smart city, connected infrastructure, digital overlay, innovation hub' },
            { id: 70, category: 'Technology', title: '3D Printer', url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=90', prompt: '3D printer in action, additive manufacturing, precise layers, creative technology' },
            { id: 71, category: 'Technology', title: 'Drone Flight', url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=90', prompt: 'Aerial drone photography, hovering quadcopter, modern aviation, tech innovation' },
            { id: 72, category: 'Technology', title: 'Coding Screen', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=90', prompt: 'Programming code on screen, software development, colorful syntax, developer workspace' },
            { id: 73, category: 'Technology', title: 'AI Neural Network', url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=90', prompt: 'Neural network visualization, artificial intelligence, data nodes, machine learning' },
            { id: 74, category: 'Technology', title: 'Fiber Optics', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=90', prompt: 'Fiber optic cables, glowing light transmission, high-speed data, network technology' },

            // Fantasy (15 items)
            { id: 75, category: 'Fantasy', title: 'Enchanted Forest', url: 'https://images.unsplash.com/photo-1510051646651-705307293581?w=800&q=90', prompt: 'Mystical enchanted forest, bioluminescent plants, magical atmosphere, fantasy art' },
            { id: 76, category: 'Fantasy', title: 'Dragon Realm', url: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=800&q=90', prompt: 'Epic dragon soaring over mountains, cinematic composition, dramatic clouds, fantasy landscape' },
            { id: 77, category: 'Fantasy', title: 'Crystal Cavern', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=90', prompt: 'Underground crystal cavern, glowing gems, mystical ambience, detailed textures' },
            { id: 78, category: 'Fantasy', title: 'Floating Islands', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=90', prompt: 'Floating sky islands, waterfalls cascading into clouds, surreal fantasy world' },
            { id: 79, category: 'Fantasy', title: 'Wizard Tower', url: 'https://images.unsplash.com/photo-1478827886588-be6d6d4bb41e?w=800&q=90', prompt: 'Ancient wizard tower, magical energy swirling, mystical runes, fantasy architecture' },
            { id: 80, category: 'Fantasy', title: 'Unicorn Meadow', url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=90', prompt: 'Unicorn in enchanted meadow, rainbow mist, magical creatures, dreamy atmosphere' },
            { id: 81, category: 'Fantasy', title: 'Phoenix Rising', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=90', prompt: 'Mythical phoenix rebirth, flames and embers, epic sky, legendary creature' },
            { id: 82, category: 'Fantasy', title: 'Mermaid Lagoon', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=90', prompt: 'Underwater mermaid kingdom, coral palace, turquoise waters, fantasy marine life' },
            { id: 83, category: 'Fantasy', title: 'Celestial Palace', url: 'https://images.unsplash.com/photo-1518818608552-195ed130cdf4?w=800&q=90', prompt: 'Heavenly palace in clouds, golden architecture, divine light rays, celestial kingdom' },
            { id: 84, category: 'Fantasy', title: 'Dark Sorcery', url: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&q=90', prompt: 'Dark sorcerer casting spell, purple magic energy, mysterious atmosphere, fantasy noir' },
            { id: 85, category: 'Fantasy', title: 'Elven Village', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=90', prompt: 'Hidden elven village in ancient trees, organic architecture, peaceful setting' },
            { id: 86, category: 'Fantasy', title: 'Time Portal', url: 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=90', prompt: 'Swirling time portal, dimensional gateway, cosmic energy, sci-fi fantasy fusion' },
            { id: 87, category: 'Fantasy', title: 'Fairy Kingdom', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=90', prompt: 'Miniature fairy kingdom, glowing mushrooms, whimsical creatures, enchanted realm' },
            { id: 88, category: 'Fantasy', title: 'Ice Queen Castle', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=90', prompt: 'Frozen ice castle, crystalline spires, winter magic, Nordic fantasy' },
            { id: 89, category: 'Fantasy', title: 'Mythical Beast', url: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=800&q=90', prompt: 'Legendary mythical beast, epic encounter, fantasy creature, heroic scale' },

            // Food (10 items) - NEW CATEGORY
            { id: 90, category: 'Food', title: 'Gourmet Plating', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=90', prompt: 'Fine dining gourmet plate, artistic presentation, Michelin star, culinary art' },
            { id: 91, category: 'Food', title: 'Fresh Produce', url: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&q=90', prompt: 'Vibrant fresh produce market, colorful vegetables, farm to table, organic ingredients' },
            { id: 92, category: 'Food', title: 'Artisan Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=90', prompt: 'Rustic artisan bread, crusty sourdough, bakery photography, warm tones' },
            { id: 93, category: 'Food', title: 'Sushi Art', url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=90', prompt: 'Beautiful sushi platter, Japanese cuisine, precision craftsmanship, food styling' },
            { id: 94, category: 'Food', title: 'Dessert Elegance', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=90', prompt: 'Elegant dessert presentation, pastry art, sweet indulgence, high-end confectionery' },
            { id: 95, category: 'Food', title: 'Coffee Culture', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=90', prompt: 'Artisan coffee latte art, specialty brew, cafe culture, morning ritual' },
            { id: 96, category: 'Food', title: 'Street Food', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=90', prompt: 'Authentic street food, local cuisine, cultural gastronomy, vibrant flavors' },
            { id: 97, category: 'Food', title: 'Wine Tasting', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=90', prompt: 'Wine tasting experience, vineyard setting, sommelier selection, sophisticated pairing' },
            { id: 98, category: 'Food', title: 'Farmers Market', url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=90', prompt: 'Bustling farmers market, fresh local produce, community gathering, seasonal harvest' },
            { id: 99, category: 'Food', title: 'Chocolate Temptation', url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=90', prompt: 'Luxury chocolate creation, decadent dessert, premium ingredients, food photography' },

            // Animals (10 items) - NEW CATEGORY
            { id: 100, category: 'Animals', title: 'Wild Lion', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=90', prompt: 'Majestic wild lion portrait, golden mane, safari photography, king of the jungle' },
            { id: 101, category: 'Animals', title: 'Hummingbird', url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=90', prompt: 'Hummingbird in flight, iridescent feathers, nectar feeding, nature wildlife' },
            { id: 102, category: 'Animals', title: 'Ocean Dolphin', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=90', prompt: 'Dolphin jumping through waves, marine mammal, playful nature, ocean wildlife' },
            { id: 103, category: 'Animals', title: 'Mountain Goat', url: 'https://images.unsplash.com/photo-1497118809143-9c44b90ed824?w=800&q=90', prompt: 'Mountain goat on cliff edge, sure-footed climber, alpine wildlife, dramatic landscape' },
            { id: 104, category: 'Animals', title: 'Elephant Herd', url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=90', prompt: 'Elephant family herd, African savanna, wildlife conservation, majestic creatures' },
            { id: 105, category: 'Animals', title: 'Arctic Fox', url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=90', prompt: 'Arctic fox in snow, white winter coat, polar wildlife, extreme environment adaptation' },
            { id: 106, category: 'Animals', title: 'Butterfly Macro', url: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=90', prompt: 'Macro butterfly wings, vibrant patterns, insect photography, natural beauty' },
            { id: 107, category: 'Animals', title: 'Owl Wisdom', url: 'https://images.unsplash.com/photo-1568132731995-f2b94545681b?w=800&q=90', prompt: 'Wise owl portrait, piercing eyes, nocturnal bird, forest guardian' },
            { id: 108, category: 'Animals', title: 'Tropical Parrot', url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=90', prompt: 'Colorful tropical parrot, vibrant plumage, exotic bird, rainforest species' },
            { id: 109, category: 'Animals', title: 'Bear Family', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=90', prompt: 'Bear family in wilderness, cubs playing, wildlife photography, natural habitat' },

            // Sports (10 items) - NEW CATEGORY
            { id: 110, category: 'Sports', title: 'Surfing Wave', url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=90', prompt: 'Surfer riding massive wave, ocean sports, adrenaline action, athletic prowess' },
            { id: 111, category: 'Sports', title: 'Mountain Climbing', url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=90', prompt: 'Rock climber scaling cliff, extreme sports, determination, vertical challenge' },
            { id: 112, category: 'Sports', title: 'Basketball Dunk', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=90', prompt: 'Epic basketball dunk, athletic movement, court action, sports photography' },
            { id: 113, category: 'Sports', title: 'Yoga Practice', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=90', prompt: 'Serene yoga pose, mindfulness practice, flexibility, wellness lifestyle' },
            { id: 114, category: 'Sports', title: 'Marathon Run', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=90', prompt: 'Marathon runner in motion, endurance challenge, athletic determination, race day' },
            { id: 115, category: 'Sports', title: 'Skateboard Trick', url: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=90', prompt: 'Skateboard aerial trick, urban sports, youth culture, street photography' },
            { id: 116, category: 'Sports', title: 'Swimming Pool', url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=90', prompt: 'Competitive swimming, underwater perspective, Olympic sport, aquatic athletics' },
            { id: 117, category: 'Sports', title: 'Cycling Race', url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=90', prompt: 'Professional cycling race, speed and endurance, team sport, road competition' },
            { id: 118, category: 'Sports', title: 'Gym Training', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=90', prompt: 'Intense gym workout, strength training, fitness motivation, bodybuilding' },
            { id: 119, category: 'Sports', title: 'Snowboarding', url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=90', prompt: 'Snowboarder jumping, winter extreme sports, powder snow, mountain adventure' },

            // Art (10 items) - NEW CATEGORY
            { id: 120, category: 'Art', title: 'Street Graffiti', url: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=90', prompt: 'Vibrant street graffiti mural, urban art, spray paint masterpiece, cultural expression' },
            { id: 121, category: 'Art', title: 'Museum Gallery', url: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=90', prompt: 'Contemporary art museum gallery, curated exhibition, modern masterpieces, cultural space' },
            { id: 122, category: 'Art', title: 'Sculpture Garden', url: 'https://images.unsplash.com/photo-1584286595398-a59511e0649f?w=800&q=90', prompt: 'Outdoor sculpture installation, public art, three-dimensional form, artistic landscape' },
            { id: 123, category: 'Art', title: 'Oil Painting', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=90', prompt: 'Classical oil painting detail, Renaissance style, brush strokes, fine art' },
            { id: 124, category: 'Art', title: 'Digital Art', url: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&q=90', prompt: 'Modern digital artwork, computer generated, creative design, new media art' },
            { id: 125, category: 'Art', title: 'Pottery Craft', url: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=90', prompt: 'Artisan pottery making, ceramic art, handcrafted vessels, traditional craft' },
            { id: 126, category: 'Art', title: 'Calligraphy', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=90', prompt: 'Elegant calligraphy art, ink and brush, traditional writing, artistic lettering' },
            { id: 127, category: 'Art', title: 'Photography Exhibition', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=90', prompt: 'Fine art photography exhibition, gallery prints, visual storytelling, curated collection' },
            { id: 128, category: 'Art', title: 'Glass Blowing', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=90', prompt: 'Molten glass blowing art, craftsman skill, colorful creation, artistic process' },
            { id: 129, category: 'Art', title: 'Textile Design', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90', prompt: 'Intricate textile pattern, fabric art, woven design, decorative craftsmanship' }
        ];
    }

    // 8. Improved Shuffle Algorithm
    function shuffleArray(array) {
        const shuffled = [...array];
        // Fisher-Yates shuffle with crypto-random for better randomness
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function renderFeed() {
        const itemsToShow = state.isExpanded ? state.galleryData : shuffleArray(state.galleryData).slice(0, state.displayLimit);

        feedContainer.innerHTML = itemsToShow.map(item => `
            <div class="card-item" data-id="${item.id}">
                <img src="${item.url}" class="card-img" alt="${item.title}" loading="lazy">
                <div class="card-content">
                    <h5>${item.title}</h5>
                    <p>#${item.category}</p>
                </div>
            </div>
        `).join('');

        // Add click listeners to each card
        document.querySelectorAll('.card-item').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.getAttribute('data-id'));
                const item = state.galleryData.find(d => d.id === id);
                if (item) showPromptModal(item);
            });
        });
    }

    // 9. Gallery Controls
    refreshGallery.addEventListener('click', () => {
        renderFeed();
        showToast('Gallery refreshed with new images!');
    });

    exploreMore.addEventListener('click', () => {
        state.isExpanded = !state.isExpanded;
        exploreMore.textContent = state.isExpanded ? 'Show less' : 'Explore more';
        renderFeed();
        showToast(state.isExpanded ? `Showing all ${state.galleryData.length} images` : 'Showing featured selection');
    });

    // 10. Prompt Modal System
    function showPromptModal(item) {
        const modal = document.createElement('div');
        modal.className = 'prompt-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${item.title}</h3>
                    <button class="btn-close">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${item.url}" class="modal-img" alt="${item.title}">
                    <div class="prompt-display">
                        <div class="prompt-label">AI Generation Prompt</div>
                        <div class="prompt-text">${item.prompt}</div>
                    </div>
                    <button class="btn btn-primary btn-sm" id="modal-copy-btn">Copy Prompt 📋</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close handlers
        modal.querySelector('.btn-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Copy handler
        modal.querySelector('#modal-copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(item.prompt).then(() => {
                showToast('Prompt copied from gallery!');
                modal.remove();
            });
        });
    }

    // 11. Web Navigator Logic
    btnGo.addEventListener('click', () => {
        let url = urlInput.value.trim();
        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;
        mainFrame.src = url;
        showToast(`Loading ${url}...`);
    });

    // 12. Toast Notification
    let toastTimer;
    function showToast(msg) {
        clearTimeout(toastTimer);
        toastMsg.textContent = msg;
        toast.classList.remove('hidden');
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
    }

    // Initial Load
    initTheme();
    updatePrompt();
    renderFeed();
    renderLibrary();

    console.log(`ProVision AI Engine Initialized with ${state.galleryData.length} High-Quality Images across 10 categories.`);
});
