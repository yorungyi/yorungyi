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
        galleryData: generateGalleryData()
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

    // 7. Gallery Data Generator (Expanded with Categories)
    function generateGalleryData() {
        return [
            // Architecture
            { id: 1, category: 'Architecture', title: 'Neo Brutalist Tower', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300', prompt: 'Neo-brutalist concrete tower, angular design, sunset light, architectural photography, 8k' },
            { id: 2, category: 'Architecture', title: 'Parametric Pavilion', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=300', prompt: 'Parametric architecture pavilion, fluid organic forms, white material, minimal lighting' },
            { id: 3, category: 'Architecture', title: 'Glass Skyscraper', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=300', prompt: 'Modern glass skyscraper, reflective facade, blue hour photography, cityscape' },

            // Nature
            { id: 4, category: 'Nature', title: 'Mountain Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300', prompt: 'Misty mountain peak at dawn, soft purple and orange light, ethereal atmosphere, landscape photography' },
            { id: 5, category: 'Nature', title: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=300', prompt: 'Vast sand dunes, golden hour, long shadows, minimalist composition' },
            { id: 6, category: 'Nature', title: 'Coastal Cliffs', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300', prompt: 'Dramatic coastal cliffs, crashing waves, moody sky, wide angle lens' },

            // Portrait
            { id: 7, category: 'Portrait', title: 'Cyberpunk Wanderer', url: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=300', prompt: 'Cyberpunk style portrait, neon accents, futuristic fashion, dramatic lighting, cinematic' },
            { id: 8, category: 'Portrait', title: 'Golden Hour Beauty', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300', prompt: 'Portrait of a woman, golden hour natural light, soft bokeh, professional fashion photography' },
            { id: 9, category: 'Portrait', title: 'Street Style', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300', prompt: 'Urban street style portrait, gritty texture, shallow depth of field, editorial look' },

            // Abstract
            { id: 10, category: 'Abstract', title: 'Fluid Dynamics', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300', prompt: 'Abstract fluid art, iridescent colors, macro photography, dynamic flow' },
            { id: 11, category: 'Abstract', title: 'Geometric Patterns', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=300', prompt: 'Geometric abstract patterns, vibrant colors, symmetry, modern design' },
            { id: 12, category: 'Abstract', title: 'Light Painting', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=300', prompt: 'Long exposure light painting, neon trails, dark background, creative photography' },

            // Technology
            { id: 13, category: 'Technology', title: 'Circuit Board', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300', prompt: 'Macro circuit board photography, copper traces, electronic components, tech aesthetic' },
            { id: 14, category: 'Technology', title: 'Robot Chess', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300', prompt: 'Robotic arm, industrial design, minimalist composition, studio lighting' },
            { id: 15, category: 'Technology', title: 'Data Visualization', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300', prompt: 'Digital data visualization, glowing particles, futuristic interface, blue tones' },

            // Fantasy
            { id: 16, category: 'Fantasy', title: 'Enchanted Forest', url: 'https://images.unsplash.com/photo-1510051646651-705307293581?q=80&w=300', prompt: 'Mystical enchanted forest, bioluminescent plants, magical atmosphere, fantasy art' },
            { id: 17, category: 'Fantasy', title: 'Dragon Realm', url: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=300', prompt: 'Epic dragon in mountainous realm, cinematic composition, dramatic clouds, fantasy landscape' },
            { id: 18, category: 'Fantasy', title: 'Crystal Cavern', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300', prompt: 'Underground crystal cavern, glowing gems, mystical ambience, detailed textures' }
        ];
    }

    // 8. Interactive Gallery Rendering
    function renderFeed() {
        feedContainer.innerHTML = state.galleryData.map(item => `
            <div class="card-item" data-id="${item.id}">
                <img src="${item.url}" class="card-img" alt="${item.title}">
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

    // 9. Prompt Modal System
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

    // 10. Web Navigator Logic
    btnGo.addEventListener('click', () => {
        let url = urlInput.value.trim();
        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;
        mainFrame.src = url;
        showToast(`Loading ${url}...`);
    });

    // 11. Toast Notification
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

    console.log('ProVision AI Engine Initialized with Dual-Theme Support.');
});
