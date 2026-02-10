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

    // 7. Expanded Gallery Data Generator (50+ High-Quality Images)
    function generateGalleryData() {
        return [
            // Architecture (10 items)
            { id: 1, category: 'Architecture', title: 'Neo Brutalist Tower', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=90', prompt: 'Neo-brutalist concrete tower, angular design, golden hour light, architectural photography, ultra sharp, 8k' },
            { id: 2, category: 'Architecture', title: 'Parametric Pavilion', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=90', prompt: 'Parametric architecture pavilion, fluid organic forms, white material, minimal lighting, hyper-detailed' },
            { id: 3, category: 'Architecture', title: 'Glass Skyscraper', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=90', prompt: 'Modern glass skyscraper, reflective facade, blue hour photography, cityscape, crystal clear' },
            { id: 4, category: 'Architecture', title: 'Minimalist House', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90', prompt: 'Contemporary minimalist house, clean lines, natural wood, large windows, architectural digest' },
            { id: 5, category: 'Architecture', title: 'Gothic Cathedral', url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=90', prompt: 'Gothic cathedral interior, vaulted ceiling, stained glass, dramatic light rays, highly detailed' },
            { id: 6, category: 'Architecture', title: 'Futuristic Bridge', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=90', prompt: 'Futuristic suspension bridge, steel and cable, symmetrical composition, engineering marvel' },
            { id: 7, category: 'Architecture', title: 'Asian Temple', url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=90', prompt: 'Traditional Asian temple, curved roofs, red lanterns, serene atmosphere, cultural heritage' },
            { id: 8, category: 'Architecture', title: 'Industrial Warehouse', url: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&q=90', prompt: 'Converted industrial warehouse, exposed brick, high ceilings, urban loft aesthetic' },
            { id: 9, category: 'Architecture', title: 'Art Deco Building', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=90', prompt: 'Art deco building facade, geometric patterns, vintage elegance, 1920s architecture' },
            { id: 10, category: 'Architecture', title: 'Desert Oasis Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=90', prompt: 'Luxury desert villa, infinity pool, palm trees, modern minimalism, sunset ambiance' },

            // Nature (12 items)
            { id: 11, category: 'Nature', title: 'Mountain Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90', prompt: 'Misty mountain peak at dawn, soft purple and orange light, ethereal atmosphere, landscape photography, razor sharp' },
            { id: 12, category: 'Nature', title: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=90', prompt: 'Vast sand dunes, golden hour, long shadows, minimalist composition, crisp details' },
            { id: 13, category: 'Nature', title: 'Coastal Cliffs', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90', prompt: 'Dramatic coastal cliffs, crashing waves, moody sky, wide angle lens, ultra HD' },
            { id: 14, category: 'Nature', title: 'Aurora Borealis', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=90', prompt: 'Northern lights over snowy landscape, green and purple aurora, starry sky, long exposure' },
            { id: 15, category: 'Nature', title: 'Tropical Waterfall', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=90', prompt: 'Hidden tropical waterfall, lush jungle, emerald pool, misty atmosphere, paradise' },
            { id: 16, category: 'Nature', title: 'Cherry Blossoms', url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=90', prompt: 'Cherry blossom trees in full bloom, pink petals, spring season, soft bokeh background' },
            { id: 17, category: 'Nature', title: 'Volcanic Landscape', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=90', prompt: 'Volcanic landscape with lava flows, molten rock, dramatic red glow, geological wonder' },
            { id: 18, category: 'Nature', title: 'Redwood Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=90', prompt: 'Ancient redwood forest, towering trees, misty atmosphere, peaceful hiking trail' },
            { id: 19, category: 'Nature', title: 'Iceberg Field', url: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=800&q=90', prompt: 'Massive icebergs floating in arctic waters, crystal blue ice, pristine environment' },
            { id: 20, category: 'Nature', title: 'Lavender Fields', url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&q=90', prompt: 'Endless lavender fields in Provence, purple rows, golden light, aromatic summer' },
            { id: 21, category: 'Nature', title: 'Grand Canyon', url: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800&q=90', prompt: 'Grand Canyon vista, layered rock formations, dramatic shadows, epic scale' },
            { id: 22, category: 'Nature', title: 'Rice Terraces', url: 'https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?w=800&q=90', prompt: 'Bali rice terraces, stepped paddies, tropical greenery, agricultural art' },

            // Portrait (10 items)
            { id: 23, category: 'Portrait', title: 'Cyberpunk Wanderer', url: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800&q=90', prompt: 'Cyberpunk style portrait, neon accents, futuristic fashion, dramatic lighting, cinematic, ultra sharp' },
            { id: 24, category: 'Portrait', title: 'Golden Hour Beauty', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=90', prompt: 'Portrait of a woman, golden hour natural light, soft bokeh, professional fashion photography, high resolution' },
            { id: 25, category: 'Portrait', title: 'Street Style', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=90', prompt: 'Urban street style portrait, gritty texture, shallow depth of field, editorial look, crystal clear' },
            { id: 26, category: 'Portrait', title: 'Classic Elegance', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=90', prompt: 'Timeless elegant portrait, studio lighting, black and white, high fashion, sophisticated' },
            { id: 27, category: 'Portrait', title: 'Adventure Spirit', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=90', prompt: 'Outdoor adventurer portrait, natural setting, candid expression, authentic moment' },
            { id: 28, category: 'Portrait', title: 'Artistic Vision', url: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=90', prompt: 'Creative artist portrait, colorful studio background, expressive pose, vibrant lighting' },
            { id: 29, category: 'Portrait', title: 'Business Professional', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=90', prompt: 'Executive business portrait, confident posture, modern office, professional headshot' },
            { id: 30, category: 'Portrait', title: 'Bohemian Vibe', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=90', prompt: 'Bohemian style portrait, natural makeup, flower crown, dreamy atmosphere' },
            { id: 31, category: 'Portrait', title: 'Urban Youth', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=90', prompt: 'Young urban portrait, street photography, casual style, authentic expression' },
            { id: 32, category: 'Portrait', title: 'Vintage Glamour', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=90', prompt: 'Vintage Hollywood glamour, classic beauty, retro styling, timeless elegance' },

            // Abstract (8 items)
            { id: 33, category: 'Abstract', title: 'Fluid Dynamics', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=90', prompt: 'Abstract fluid art, iridescent colors, macro photography, dynamic flow, ultra detailed' },
            { id: 34, category: 'Abstract', title: 'Geometric Patterns', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=90', prompt: 'Geometric abstract patterns, vibrant colors, symmetry, modern design, sharp edges' },
            { id: 35, category: 'Abstract', title: 'Light Painting', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=90', prompt: 'Long exposure light painting, neon trails, dark background, creative photography, high contrast' },
            { id: 36, category: 'Abstract', title: 'Smoke Art', url: 'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?w=800&q=90', prompt: 'Colorful smoke wisps, abstract forms, black background, ethereal motion' },
            { id: 37, category: 'Abstract', title: 'Crystalline Structures', url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=90', prompt: 'Macro crystalline structures, geometric formations, prismatic colors, scientific beauty' },
            { id: 38, category: 'Abstract', title: 'Paint Splatter', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=90', prompt: 'Abstract paint splatter, explosive colors, dynamic composition, modern art' },
            { id: 39, category: 'Abstract', title: 'Ink in Water', url: 'https://images.unsplash.com/photo-1549281899-f75600a24107?w=800&q=90', prompt: 'Ink dispersing in water, organic patterns, fluid motion, mesmerizing abstract' },
            { id: 40, category: 'Abstract', title: 'Fractal Patterns', url: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=800&q=90', prompt: 'Mathematical fractal patterns, infinite complexity, vibrant gradients, digital art' },

            // Technology (8 items)
            { id: 41, category: 'Technology', title: 'Circuit Board', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=90', prompt: 'Macro circuit board photography, copper traces, electronic components, tech aesthetic, extreme detail' },
            { id: 42, category: 'Technology', title: 'Robot Arm', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=90', prompt: 'Industrial robotic arm, precise engineering, minimalist composition, studio lighting, razor sharp' },
            { id: 43, category: 'Technology', title: 'Data Visualization', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=90', prompt: 'Digital data visualization, glowing particles, futuristic interface, blue tones, high tech' },
            { id: 44, category: 'Technology', title: 'Server Room', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=90', prompt: 'Modern server room, LED indicators, organized cables, technology infrastructure' },
            { id: 45, category: 'Technology', title: 'VR Headset', url: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=90', prompt: 'Virtual reality headset, futuristic design, neon lighting, immersive technology' },
            { id: 46, category: 'Technology', title: 'Microchip', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=90', prompt: 'Extreme macro microchip, golden circuit paths, advanced semiconductor, precision engineering' },
            { id: 47, category: 'Technology', title: 'Smart City', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=90', prompt: 'Futuristic smart city, connected infrastructure, digital overlay, innovation hub' },
            { id: 48, category: 'Technology', title: '3D Printer', url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=90', prompt: '3D printer in action, additive manufacturing, precise layers, creative technology' },

            // Fantasy (12 items)
            { id: 49, category: 'Fantasy', title: 'Enchanted Forest', url: 'https://images.unsplash.com/photo-1510051646651-705307293581?w=800&q=90', prompt: 'Mystical enchanted forest, bioluminescent plants, magical atmosphere, fantasy art, ethereal glow' },
            { id: 50, category: 'Fantasy', title: 'Dragon Realm', url: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=800&q=90', prompt: 'Epic dragon soaring over mountains, cinematic composition, dramatic clouds, fantasy landscape, highly detailed' },
            { id: 51, category: 'Fantasy', title: 'Crystal Cavern', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=90', prompt: 'Underground crystal cavern, glowing gems, mystical ambience, detailed textures, magical lighting' },
            { id: 52, category: 'Fantasy', title: 'Floating Islands', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=90', prompt: 'Floating sky islands, waterfalls cascading into clouds, surreal fantasy world, vibrant colors' },
            { id: 53, category: 'Fantasy', title: 'Wizard Tower', url: 'https://images.unsplash.com/photo-1478827886588-be6d6d4bb41e?w=800&q=90', prompt: 'Ancient wizard tower, magical energy swirling, mystical runes, fantasy architecture' },
            { id: 54, category: 'Fantasy', title: 'Unicorn Meadow', url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=90', prompt: 'Unicorn in enchanted meadow, rainbow mist, magical creatures, dreamy atmosphere' },
            { id: 55, category: 'Fantasy', title: 'Phoenix Rising', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=90', prompt: 'Mythical phoenix rebirth, flames and embers, epic sky, legendary creature, radiant wings' },
            { id: 56, category: 'Fantasy', title: 'Mermaid Lagoon', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=90', prompt: 'Underwater mermaid kingdom, coral palace, turquoise waters, fantasy marine life' },
            { id: 57, category: 'Fantasy', title: 'Celestial Palace', url: 'https://images.unsplash.com/photo-1518818608552-195ed130cdf4?w=800&q=90', prompt: 'Heavenly palace in clouds, golden architecture, divine light rays, celestial kingdom' },
            { id: 58, category: 'Fantasy', title: 'Dark Sorcery', url: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&q=90', prompt: 'Dark sorcerer casting spell, purple magic energy, mysterious atmosphere, fantasy noir' },
            { id: 59, category: 'Fantasy', title: 'Elven Village', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=90', prompt: 'Hidden elven village in ancient trees, organic architecture, peaceful setting, high fantasy' },
            { id: 60, category: 'Fantasy', title: 'Time Portal', url: 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=90', prompt: 'Swirling time portal, dimensional gateway, cosmic energy, sci-fi fantasy fusion' }
        ];
    }

    // 8. Gallery Display Logic
    function shuffleArray(array) {
        const shuffled = [...array];
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
        showToast(state.isExpanded ? 'Showing all images' : 'Showing featured selection');
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

    console.log('ProVision AI Engine Initialized with 60+ High-Quality Images.');
});
