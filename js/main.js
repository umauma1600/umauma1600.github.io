/**
 * うまうまワールド - メインJavaScript
 * 共通の機能を管理
 */

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 うまうまワールドへようこそ！');

    // スムーススクロールの実装
    initSmoothScroll();

    // カードのアニメーション効果
    initCardAnimations();
});

/**
 * スムーススクロールを初期化
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * カードのアニメーション効果を初期化
 */
function initCardAnimations() {
    // Intersection Observer APIを使用して、カードが画面に入ったらフェードイン
    const cards = document.querySelectorAll('.card-hover');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * エラーハンドリング
 */
window.addEventListener('error', function(e) {
    console.error('エラーが発生しました:', e.error);
});
