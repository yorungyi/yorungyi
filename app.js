/**
 * KODARI AI Prompt Browser - Core Logic
 * Nebula Dark Edition
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. PWA Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('🐟 코다리 부장: PWA 엔진 가동!'))
            .catch(err => console.error(err));
    }

    // --- State & Selectors ---
    let savedPrompts = JSON.parse(localStorage.getItem('saved_prompts') || '[]');

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.view-section');
    const viewTitle = document.getElementById('view-title');

    const subject = document.getElementById('p-subject');
    const style = document.getElementById('p-style');
    const lighting = document.getElementById('p-lighting');
    const resultArea = document.getElementById('prompt-result');

    const copyBtn = document.getElementById('copy-btn');
    const saveBtn = document.getElementById('save-btn');
    const savedList = document.getElementById('saved-prompts');

    const imageFeed = document.getElementById('image-feed');
    const browserUrl = document.getElementById('browser-url');
    const browserGo = document.getElementById('browser-go');
    const targetFrame = document.getElementById('target-frame');

    const notif = document.getElementById('notif-system');
    const notifText = document.getElementById('notif-text');

    // --- Core Functions ---

    // 1. Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-view');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.add('hidden'));
            document.getElementById(`${target}-view`).classList.remove('hidden');

            const names = { dashboard: '프롬프트 빌더', browser: '앱 브라우저', analytics: '수익 통계' };
            viewTitle.textContent = names[target];
            notify(`'${names[target]}' 화면으로 이동했습니다. 🚀`);
        });
    });

    // 2. Prompt Generation Logic
    function refreshPrompt() {
        const text = `${subject.value}, ${style.value}, ${lighting.value}, highly detailed, digital masterpiece --v 6.0`;

        // Dynamic typing feel
        resultArea.value = '';
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                resultArea.value += text[i];
                i++;
            } else {
                clearInterval(interval);
            }
        }, 10);
    }

    [subject, style, lighting].forEach(el => el.addEventListener('change', refreshPrompt));

    // 3. User Actions
    copyBtn.addEventListener('click', () => {
        resultArea.select();
        document.execCommand('copy');
        notify('프롬프트가 클립보드에 복사되었습니다! 📋');
    });

    saveBtn.addEventListener('click', () => {
        const current = resultArea.value;
        if (!current) return;

        savedPrompts.unshift(current);
        if (savedPrompts.length > 5) savedPrompts.pop(); // Keep only last 5 for UI

        localStorage.setItem('saved_prompts', JSON.stringify(savedPrompts));
        updateSavedUI();
        notify('라이브러리에 프롬프트를 저장했습니다! ⭐');
    });

    function updateSavedUI() {
        if (savedPrompts.length === 0) {
            savedList.innerHTML = '<div class="empty-status">저장된 프롬프트가 없습니다. 🐟</div>';
            return;
        }
        savedList.innerHTML = savedPrompts.map((p, idx) => `
            <div class="saved-item">
                ${p.substring(0, 60)}...
            </div>
        `).join('');
    }

    // 4. Dynamic Gallery
    const galleryData = [
        { title: 'Neon Seoul 2077', tag: '#Cyberpunk', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400' },
        { title: 'Whale Navigator', tag: '#SpaceArt', url: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400' },
        { title: 'Ancient Guardian', tag: '#Fantasy', url: 'https://images.unsplash.com/photo-1542641728-6ca359b085f4?q=80&w=400' },
        { title: 'Synthwave Sunset', tag: '#Retro', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400' },
        { title: 'Ghost of Forest', tag: '#Mystery', url: 'https://images.unsplash.com/photo-1510051646651-705307293581?q=80&w=400' },
        { title: 'Robot Chess', tag: '#Minimal', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400' }
    ];

    function renderGallery() {
        imageFeed.innerHTML = galleryData.map(img => `
            <div class="img-item">
                <img src="${img.url}" alt="${img.title}">
                <div class="img-overlay">
                    <span class="item-title">${img.title}</span>
                    <span class="item-tag">${img.tag}</span>
                </div>
            </div>
        `).join('');
    }

    // 5. Browser Logic
    browserGo.addEventListener('click', () => {
        let url = browserUrl.value.trim();
        if (!url) { notify('대표님, URL을 입력하셔야죠! 🐟'); return; }
        if (!url.startsWith('http')) url = 'https://' + url;
        notify('페이지를 낚아채오는 중... 🎣');
        targetFrame.src = url;
    });

    // 6. Utility Notification
    function notify(message) {
        notifText.textContent = message;
        notif.classList.remove('hidden');
        setTimeout(() => notif.classList.add('hidden'), 3000);
    }

    // --- Init ---
    refreshPrompt();
    renderGallery();
    updateSavedUI();

    setTimeout(() => {
        notify('충성! 코다리 부장입니다. 대표님을 모시겠습니다! 🫡');
    }, 1000);
});
