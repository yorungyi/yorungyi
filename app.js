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
        galleryData: [],
        displayLimit: 12,
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

    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    const themeToggle = document.querySelector('.btn-theme-toggle');
    const refreshGallery = document.getElementById('refresh-gallery');
    const exploreMore = document.getElementById('explore-more');

    const modalPrivacy = document.getElementById('modal-privacy');
    const btnPrivacy = document.getElementById('btn-privacy');
    const btnTerms = document.getElementById('btn-terms');
    const btnCloseModal = document.querySelector('.btn-close-modal');

    // Pro Options Selectors
    const btnTogglePro = document.getElementById('btn-toggle-pro');
    const proOptionsGrid = document.getElementById('pro-options');
    const negPromptInput = document.getElementById('neg-prompt');
    const selAspect = document.getElementById('sel-aspect');
    const selEngine = document.getElementById('sel-engine');

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

            const titles = {
                studio: 'Prompt Studio',
                discovery: 'Discovery Gallery',
                guide: 'AI Mastering Guide'
            };
            viewTitle.textContent = titles[target] || 'ProVision AI';

            showToast(`Navigated to ${titles[target]}`);
        });
    });

    // 4a. Modal Engine
    [btnPrivacy, btnTerms].forEach(btn => {
        btn.addEventListener('click', () => {
            modalPrivacy.classList.add('active');
        });
    });

    btnCloseModal.addEventListener('click', () => {
        modalPrivacy.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modalPrivacy) modalPrivacy.classList.remove('active');
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

    // Pro Options Toggle
    btnTogglePro.addEventListener('click', () => {
        proOptionsGrid.classList.toggle('active');
        btnTogglePro.querySelector('svg').style.transform = proOptionsGrid.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
    });

    // 6. AI Prompt Enhancement Engine
    function enhancePrompt(rawInput) {
        if (!rawInput || rawInput.trim().length === 0) {
            showToast('⚠️ Please describe what you want to create');
            return;
        }

        const input = rawInput.toLowerCase();

        // 6a. Korean to English Translation Engine
        function translateToEnglish(text) {
            const dictionary = {
                '강아지': 'dog', '강아지가': 'a dog', '흰색': 'white', '노는': 'playing', '수영장': 'swimming pool',
                '수영장에서': 'in a swimming pool', '모습': 'scene', '고양이': 'cat', '고양이가': 'a cat',
                '건물': 'building', '도시': 'city', '석양': 'sunset', '하늘': 'sky', '바다': 'ocean',
                '숲': 'forest', '꽃': 'flower', '산': 'mountain', '우주': 'space', '인간': 'human',
                '로봇': 'robot', '기계': 'machine', '여신': 'goddess', '전사': 'warrior', '사무라이': 'samurai',
                '벚꽃': 'cherry blossom', '네온': 'neon', '미래': 'future', '전통': 'traditional',
                '럭셔리': 'luxury', '스포츠카': 'sports car', '우주 정거장': 'space station', '바이킹': 'viking',
                '수정 궁전': 'crystal palace', '시간 여행자': 'time traveler', '불사조': 'phoenix',
                '달리는': 'running', '웃는': 'smiling', '요리하는': 'cooking', '비행하는': 'flying',
                '아름다운': 'beautiful', '장엄한': 'majestic', '화려한': 'vibrant', '어두운': 'dark',
                '차가운': 'cold', '따뜻한': 'warm', '신비로운': 'mystical'
            };

            let translated = text;
            const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

            sortedKeys.forEach(kr => {
                const regex = new RegExp(kr, 'g');
                translated = translated.replace(regex, dictionary[kr]);
            });

            translated = translated.replace(/[이가을를은는]/g, ' ').replace(/\s+/g, ' ').trim();
            return translated;
        }

        const translatedInput = translateToEnglish(rawInput);

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

        for (const [style, keywords] of Object.entries(styleKeywords)) {
            if (keywords.some(kw => input.includes(kw))) {
                if (style === 'realistic') detectedStyle = 'photorealistic rendering, ultra-detailed, 8k';
                else if (style === 'painting') detectedStyle = 'oil painting style, rich brushstrokes';
                else if (style === 'animation') detectedStyle = 'Pixar animation style, vibrant colors';
                else if (style === 'cinematic') detectedStyle = 'cinematic composition, Unreal Engine 5';
                break;
            }
        }

        for (const [atm, keywords] of Object.entries(atmosphereKeywords)) {
            if (keywords.some(kw => input.includes(kw))) {
                if (atm === 'golden') detectedAtmosphere = 'golden hour lighting, warm glow';
                else if (atm === 'dark') detectedAtmosphere = 'high contrast noir, dramatic shadows';
                else if (atm === 'mystical') detectedAtmosphere = 'ethereal glow, magical atmosphere';
                break;
            }
        }

        const negInput = negPromptInput.value.trim();
        const aspectVal = selAspect.value;
        const engineLabel = selEngine.options[selEngine.selectedIndex].text;

        let enhancedPrompt = `${detectedSubject} featuring ${translatedInput}, ${detectedStyle}, ${detectedAtmosphere}, masterfully crafted, award-winning quality`;

        if (negInput) enhancedPrompt += ` --no ${negInput}`;
        enhancedPrompt += ` ${aspectVal}`;
        enhancedPrompt += ` [Optimized for ${engineLabel}]`;

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
        btnEnhance.addEventListener('click', () => {
            const rawText = userInput.value.trim();
            enhancePrompt(rawText);
        });

        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                btnEnhance.click();
            }
        });
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

    // 7. Dynamic Gallery Data Loading
    async function loadGalleryData() {
        try {
            const response = await fetch('data/gallery.json');
            if (!response.ok) throw new Error('Failed to load gallery data');
            state.galleryData = await response.json();
            renderFeed();
            console.log(`ProVision AI Engine Initialized with ${state.galleryData.length} Shared Items.`);
        } catch (err) {
            console.error('Gallery Load Error:', err);
            showToast('⚠️ Failed to load gallery items');
        }
    }

    // 8. Improved Shuffle Algorithm
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function renderFeed() {
        if (!state.galleryData || state.galleryData.length === 0) return;
        const itemsToShow = state.isExpanded ? state.galleryData : shuffleArray(state.galleryData).slice(0, state.displayLimit);

        feedContainer.innerHTML = itemsToShow.map(item => `
            <div class="card-item" data-id="${item.id}">
                <button class="btn-remix" onclick="window.remixPrompt('${item.prompt.replace(/'/g, "\\'")}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M21 2v6h-6M3 22v-6h6M21 13a9 9 0 1 1-3-7.7L21 8M3 11a9 9 0 0 1 3 7.7L3 16" />
                    </svg>
                    Remix
                </button>
                <img src="${item.url}" class="card-img" alt="${item.title}" loading="lazy">
                <div class="card-content">
                    <div class="card-header-info">
                        <span class="category-tag">${item.category}</span>
                        <h5 class="card-title">${item.title}</h5>
                    </div>
                    <p class="prompt-preview">${item.prompt}</p>
                    <button class="btn-copy-mini">Copy Prompt</button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.card-item').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-remix') || e.target.closest('.btn-copy-mini')) {
                    e.stopPropagation();
                    return;
                }
                const id = parseInt(card.getAttribute('data-id'));
                const item = state.galleryData.find(d => d.id === id);
                if (item) showPromptModal(item);
            });
        });

        document.querySelectorAll('.btn-copy-mini').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardItem = e.target.closest('.card-item');
                if (cardItem) {
                    const id = parseInt(cardItem.getAttribute('data-id'));
                    const item = state.galleryData.find(d => d.id === id);
                    if (item) {
                        navigator.clipboard.writeText(item.prompt).then(() => {
                            showToast('Prompt copied from gallery!');
                        });
                    }
                }
            });
        });
    }

    // Remix Global Function
    window.remixPrompt = function (promptText) {
        const studioBtn = document.querySelector('[data-view="studio"]');
        if (studioBtn) studioBtn.click();

        userInput.value = promptText;
        showToast('✨ Remixed to Studio!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        userInput.style.boxShadow = '0 0 20px var(--primary)';
        setTimeout(() => { userInput.style.boxShadow = ''; }, 1000);
    };

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

        modal.querySelector('.btn-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('#modal-copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(item.prompt).then(() => {
                showToast('Prompt copied from gallery!');
                modal.remove();
            });
        });
    }

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
    loadGalleryData();
    renderLibrary();

    console.log("ProVision AI Engine Initialized.");
});
