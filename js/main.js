/**
 * やまーた - メインJavaScript
 * 共通の機能を管理
 */

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 やまーたへようこそ！');

    // ハンバーガーメニューの初期化
    initHamburgerMenu();

    // スムーススクロールの実装
    initSmoothScroll();

    // アクティブリンクの管理
    initActiveLinks();
});

/**
 * ハンバーガーメニューを初期化
 */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');

    if (!hamburger || !mobileMenu || !overlay) {
        return; // 要素が存在しない場合は何もしない
    }

    // ハンバーガーボタンのクリックイベント
    hamburger.addEventListener('click', function() {
        toggleMenu();
    });

    // オーバーレイのクリックイベント（メニューを閉じる）
    overlay.addEventListener('click', function() {
        closeMenu();
    });

    // モバイルメニュー内のリンクがクリックされたらメニューを閉じる
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // メニューの開閉を切り替える
    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');

        // bodyのスクロールを制御
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // メニューを閉じる
    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * スムーススクロールを初期化
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // ハッシュのみの場合はトップへスクロール
            if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // サイドバーまたはモバイルヘッダーの高さを考慮
                const isMobile = window.innerWidth <= 768;
                const offset = isMobile ? 80 : 0;

                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * アクティブリンクの管理
 * スクロール位置に応じてナビゲーションリンクをハイライト
 */
function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a, .mobile-menu a');

    if (sections.length === 0 || navLinks.length === 0) {
        return;
    }

    function updateActiveLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === `#${current}` || (current === '' && href === '#home')) {
                link.classList.add('active');
            }
        });
    }

    // スクロール時にアクティブリンクを更新
    window.addEventListener('scroll', updateActiveLink);

    // 初期表示時にも実行
    updateActiveLink();
}

/**
 * エラーハンドリング
 */
window.addEventListener('error', function(e) {
    console.error('エラーが発生しました:', e.error);
});
