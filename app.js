/**
 * AI 개발부장 코다리의 야심작
 * '구글애드센서 수익화 앱브라우저' 핵심 로직
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('🐟 코다리 부장: PWA 엔진 가동! (Service Worker Registered)'))
            .catch(err => console.error('PWA Fail:', err));
    }

    console.log('🐟 코다리 부장: 시스템 가동 준비 완료! 충성!');

    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const viewTitle = document.getElementById('view-title');
    const urlInput = document.getElementById('url-input');
    const goBtn = document.getElementById('go-btn');
    const browserFrame = document.getElementById('browser-frame');
    const browserPlaceholder = document.getElementById('browser-placeholder');
    const toast = document.getElementById('kodari-toast');
    const toastMessage = document.getElementById('toast-message');

    // 1. Navigation Logic (Updated)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetView = item.getAttribute('data-view');
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            views.forEach(view => view.classList.add('hidden'));
            document.getElementById(`${targetView}-view`).classList.remove('hidden');

            const viewNames = {
                dashboard: 'AI Prompt 빌더',
                browser: '프리미엄 앱브라우저',
                analytics: '정밀 수익 분석',
                settings: '시스템 설정'
            };
            viewTitle.textContent = viewNames[targetView];
            showKodariToast(`대표님, ${viewNames[targetView]} 화면입니다! 🚀`);
        });
    });

    // 2. AI Prompt Builder Logic
    const subjectSelect = document.getElementById('prompt-subject');
    const styleSelect = document.getElementById('prompt-style');
    const lightingSelect = document.getElementById('prompt-lighting');
    const finalPrompt = document.getElementById('final-prompt');
    const copyBtn = document.getElementById('copy-prompt-btn');

    function updatePrompt() {
        const text = `${subjectSelect.value}, ${styleSelect.value}, ${lightingSelect.value}, masterpiece, highly detailed --v 6.0`;
        finalPrompt.value = text;
    }

    [subjectSelect, styleSelect, lightingSelect].forEach(el => {
        el.addEventListener('change', updatePrompt);
    });

    copyBtn.addEventListener('click', () => {
        finalPrompt.select();
        document.execCommand('copy');
        showKodariToast('프롬프트를 복사했습니다! 이제 AI 도구에서 사용하세요! 📋');
    });

    // 3. Dynamic Gallery Rendering (Simulated for high engagement)
    const galleryGrid = document.getElementById('ai-gallery');
    const sampleImages = [
        { title: 'Neon Samurai', tag: '#Cyberpunk', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop' },
        { title: 'Forest Spirit', tag: '#Fantasy', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' },
        { title: 'Space Whale', tag: '#Sci-Fi', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400&auto=format&fit=crop' },
        { title: 'Vintage Cyborg', tag: '#Portrait', url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=400&auto=format&fit=crop' }
    ];

    function renderGallery() {
        galleryGrid.innerHTML = ''; // Clear skeletons
        sampleImages.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${img.url}" alt="${img.title}">
                <div class="gallery-overlay">
                    <span class="item-title">${img.title}</span>
                    <span class="item-tag">${img.tag}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                showKodariToast(`'${img.title}' 스타일로 이동합니다 (연결된 애드센스 페이지로!) 🎣`);
                // 실제 서비스라면 특정 제휴/애드센스 페이지로 window.open(url)
            });
            galleryGrid.appendChild(item);
        });
    }

    // Initial Render
    updatePrompt();
    setTimeout(renderGallery, 1500); // 1.5초 후 낚아올리기 완료 시뮬레이션

    // 4. Browser Logic
    function loadUrl() {
        let url = urlInput.value.trim();
        if (!url) {
            showKodariToast('대표님, URL을 먼저 입력해주셔야 합니다! 🐟');
            return;
        }
        if (!url.startsWith('http')) url = 'https://' + url;
        showKodariToast('부장 코다리가 페이지를 낚아채오는 중입니다... 🎣');
        browserFrame.src = url;
        browserPlaceholder.classList.add('hidden');
    }

    goBtn.addEventListener('click', loadUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadUrl();
    });

    // 5. Kodari Toast Utility
    function showKodariToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    // Initial Greetings
    setTimeout(() => {
        showKodariToast('대표님, AI 프롬프트 수익화 프로젝트 가동합니다! 😎🚀');
    }, 1000);
});
