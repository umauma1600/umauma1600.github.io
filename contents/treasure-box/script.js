// ===== 定数定義 =====
const CONSTANTS = {
    // ドラッグ関連
    DRAG_THRESHOLD: 30,           // ドラッグモード開始の移動距離（px）
    PAPER_SHOW_THRESHOLD: 50,     // 紙を表示する持ち上げ高さ（px）
    FALL_DURATION_BASE: 0.3,      // 落下アニメーションの基本時間（秒）
    FALL_DURATION_MAX: 0.6,       // 落下アニメーションの最大時間（秒）

    // テーブルサイズ
    TABLE_WIDTH_DESKTOP: 880,     // デスクトップのテーブル幅（px）
    TABLE_WIDTH_MOBILE: 600,      // モバイルのテーブル幅（px）
    BOX_WIDTH_DESKTOP: 160,       // デスクトップの宝箱幅（px）
    BOX_WIDTH_MOBILE: 128,        // モバイルの宝箱幅（px）
    MOBILE_BREAKPOINT: 768,       // モバイル/デスクトップの境界（px）

    // アニメーション
    MODAL_FADE_DELAY: 300,        // モーダルフェードアウト時間（ms）
    CONFETTI_COUNT: 100,          // 紙吹雪の数
    CONFETTI_INTERVAL: 30,        // 紙吹雪生成間隔（ms）
    CONFETTI_DURATION: 5000,      // 紙吹雪の表示時間（ms）
    PAPER_OPENING_DELAY: 800,     // 紙が開くまでの時間（ms）

    // タイマー
    TIMER_INTERVAL: 1000,         // タイマー更新間隔（ms）
};

// ===== ゲーム状態管理 =====
const gameState = {
    dialValues: [0, 0, 0, 0],
    correctDial: [1, 6, 0, 0], // 正解: 1600
    isLockUnlocked: false,
    isBottomDropped: false,
    isCleared: false,
    startTime: Date.now(),
    currentHintStep: 0,
    timerInterval: null,       // タイマーのinterval ID
};

// ===== ヒント情報 =====
const hints = [
    {
        step: 1,
        text: 'ダイヤル錠の数字は「1600」です。<br>まずはダイヤルを回して錠を開けてみましょう。'
    },
    {
        step: 2,
        text: '錠は外れたのに開きません...何か別の方法があるのでは？<br><span class="highlight">固定観念にとらわれないで</span>考えてみましょう。'
    },
    {
        step: 3,
        text: '宝箱を<span class="highlight">違う方向から</span>アプローチしてみては？<br>クリックではなく、ドラッグで動かしてみましょう。'
    },
    {
        step: 4,
        text: '宝箱を<span class="highlight">上に持ち上げて</span>みてください！<br>底が抜けて...何か落ちてくるかもしれません。'
    }
];

// ===== DOM要素の取得 =====
const elements = {
    // ダイヤル関連
    dialUpButtons: document.querySelectorAll('.dial-up'),
    dialDownButtons: document.querySelectorAll('.dial-down'),
    dialValues: document.querySelectorAll('.dial-value'),
    dialModal: document.getElementById('dialModal'),
    dialOpenButton: document.getElementById('dialOpenButton'),
    dialFeedback: document.getElementById('dialFeedback'),
    closeDialModal: document.getElementById('closeDialModal'),
    lockIcon: document.getElementById('lockIcon'),

    // 宝箱関連
    treasureBox: document.getElementById('treasureBox'),
    treasureBoxContainer: document.getElementById('treasureBoxContainer'),
    foldedPaper: document.getElementById('foldedPaper'),

    // 紙モーダル関連
    paperModal: document.getElementById('paperModal'),
    paperStep1: document.getElementById('paperStep1'),
    paperStep2: document.getElementById('paperStep2'),
    paperStep3: document.getElementById('paperStep3'),
    closePaperModal: document.getElementById('closePaperModal'),

    // キーワード入力
    keywordInput: document.getElementById('keywordInput'),
    submitButton: document.getElementById('submitButton'),
    answerFeedback: document.getElementById('answerFeedback'),

    // ヒント
    hintButton: document.getElementById('hintButton'),
    hintModal: document.getElementById('hintModal'),
    hintContent: document.getElementById('hintContent'),
    hintStep: document.getElementById('hintStep'),
    closeHintModal: document.getElementById('closeHintModal'),
    prevHint: document.getElementById('prevHint'),
    nextHint: document.getElementById('nextHint'),

    // クリア
    clearModal: document.getElementById('clearModal'),
    clearTime: document.getElementById('clearTime'),
    shareButton: document.getElementById('shareButton'),
    retryButton: document.getElementById('retryButton'),
    confettiContainer: document.getElementById('confettiContainer'),

    // タイマー
    timer: document.getElementById('timer'),
};

// ===== タイマー機能 =====
/**
 * タイマーを更新する
 */
function updateTimer() {
    if (gameState.isCleared) {
        // クリア後はタイマーを停止
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
        }
        return;
    }

    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    elements.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * タイマーを開始する
 */
function startTimer() {
    updateTimer(); // 即座に表示を更新
    gameState.timerInterval = setInterval(updateTimer, CONSTANTS.TIMER_INTERVAL);
}

// タイマー開始
startTimer();

// ===== ダイヤル錠モーダル =====
elements.lockIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // 宝箱のドラッグを防ぐ
    showDialModal();
});

function showDialModal() {
    elements.dialModal.classList.remove('hidden');
    elements.dialModal.classList.add('modal-show');
}

/**
 * ダイヤル錠モーダルを閉じる
 */
function closeDialModal() {
    elements.dialModal.classList.remove('modal-show');
    setTimeout(() => {
        elements.dialModal.classList.add('hidden');
    }, CONSTANTS.MODAL_FADE_DELAY);
}

elements.closeDialModal.addEventListener('click', closeDialModal);
elements.dialModal.addEventListener('click', (e) => {
    if (e.target === elements.dialModal) {
        closeDialModal();
    }
});

// ===== ダイヤル錠機能 =====
function rotateDial(index, direction) {
    // 0-9の範囲で循環
    gameState.dialValues[index] = (gameState.dialValues[index] + direction + 10) % 10;
    elements.dialValues[index].textContent = gameState.dialValues[index];
}

// ダイヤルボタンのイベントリスナー
elements.dialUpButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const dialIndex = parseInt(e.target.dataset.dial);
        rotateDial(dialIndex, 1);
    });
});

elements.dialDownButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const dialIndex = parseInt(e.target.dataset.dial);
        rotateDial(dialIndex, -1);
    });
});

// OPENボタン
elements.dialOpenButton.addEventListener('click', () => {
    checkDialAnswer();
});

function checkDialAnswer() {
    // 配列の比較
    const isCorrect = gameState.dialValues.every((val, idx) => val === gameState.correctDial[idx]);

    if (isCorrect) {
        // 正解だが、宝箱は開かない（ミスリード）
        gameState.isLockUnlocked = true;
        elements.dialFeedback.textContent = '✅ 錠が開きました！';
        elements.dialFeedback.classList.remove('feedback-wrong');
        elements.dialFeedback.classList.add('feedback-correct');

        // 錠アイコンをフェードアウト
        setTimeout(() => {
            elements.lockIcon.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            elements.lockIcon.style.opacity = '0';
            elements.lockIcon.style.transform = 'translate(-50%, 50%) scale(0.5)';

            setTimeout(() => {
                elements.lockIcon.style.display = 'none';
            }, 500);

            closeDialModal();
        }, 1500);
    } else {
        // 不正解
        elements.dialFeedback.textContent = '❌ 番号が違うようです...';
        elements.dialFeedback.classList.add('feedback-wrong');
        elements.dialFeedback.classList.remove('feedback-correct');
    }
}

// ===== 宝箱ドラッグ機能 =====
// ドラッグ状態管理
let isDragging = false;
let isDragMode = false; // ドラッグモードかどうか（スクロールと区別するため）
let startY = 0;         // ドラッグ開始時のY座標
let startX = 0;         // ドラッグ開始時のX座標
let currentY = 0;       // 現在のドラッグ移動量Y
let currentX = 0;       // 現在のドラッグ移動量X
let boxOffsetX = 0;     // 宝箱の累積X位置（中央からのずれ）
let boxOffsetY = 0;     // 宝箱の累積Y位置（下からの高さ）

/**
 * テーブルと宝箱のサイズからドラッグ制限を取得（レスポンシブ対応）
 * @returns {Object} maxOffset - X方向の最大移動距離
 */
function getDragLimits() {
    const isMobile = window.innerWidth <= CONSTANTS.MOBILE_BREAKPOINT;
    const tableWidth = isMobile ? CONSTANTS.TABLE_WIDTH_MOBILE : CONSTANTS.TABLE_WIDTH_DESKTOP;
    const boxWidth = isMobile ? CONSTANTS.BOX_WIDTH_MOBILE : CONSTANTS.BOX_WIDTH_DESKTOP;
    // 宝箱の中心がテーブルの端まで動けるように設定（宝箱が少しはみ出す）
    const maxOffset = tableWidth / 2;
    return { maxOffset };
}

/**
 * X座標の範囲制限を適用
 * @param {number} x - 制限したいX座標
 * @returns {number} 制限されたX座標
 */
function clampX(x) {
    const { maxOffset } = getDragLimits();
    return Math.max(-maxOffset, Math.min(maxOffset, x));
}

// マウスイベント
elements.treasureBox.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);

// タッチイベント
elements.treasureBox.addEventListener('touchstart', startDragTouch);
document.addEventListener('touchmove', dragTouch);
document.addEventListener('touchend', endDrag);

function startDrag(e) {
    // 錠アイコンをクリックした場合はドラッグしない
    if (e.target.closest('#lockIcon')) return;

    isDragging = true;
    isDragMode = false; // 最初はドラッグモードではない
    startY = e.clientY;
    startX = e.clientX;
    currentY = 0;
    currentX = 0;
}

function startDragTouch(e) {
    // 錠アイコンをタップした場合はドラッグしない
    if (e.target.closest('#lockIcon')) return;

    // 最初はpreventDefaultしない（スクロール可能）
    isDragging = true;
    isDragMode = false;
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    currentY = 0;
    currentX = 0;
}

/**
 * ドラッグ処理の共通ロジック
 * @param {number} deltaX - X方向の移動量
 * @param {number} deltaY - Y方向の移動量
 * @param {Event} event - イベントオブジェクト（タッチイベントの場合のみpreventDefaultに使用）
 * @param {boolean} isTouch - タッチイベントかどうか
 */
function handleDragMove(deltaX, deltaY, event, isTouch) {
    // ドラッグモードでない場合、移動量のしきい値をチェック
    if (!isDragMode) {
        const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (dragDistance > CONSTANTS.DRAG_THRESHOLD) {
            // しきい値を超えたらドラッグモードに
            isDragMode = true;
            elements.treasureBox.classList.add('dragging');
            // タッチイベントの場合、ドラッグモードになったらページスクロールを防止
            if (isTouch && event) {
                event.preventDefault();
            }
        } else {
            // まだしきい値に達していない場合は何もしない（スクロール可能）
            return;
        }
    } else if (isTouch && event) {
        // ドラッグモード中はページスクロールを防止
        event.preventDefault();
    }

    // ドラッグモード：位置に追従
    currentY = deltaY;
    currentX = deltaX;

    // X座標は常に更新（横方向のドラッグを許可）
    const totalX = clampX(boxOffsetX + currentX);

    // Y座標は上方向のみ許可（下には動かせない）
    let totalY = boxOffsetY;
    if (currentY > 0) {
        totalY = boxOffsetY + currentY;
    }

    // 宝箱の位置を更新
    elements.treasureBox.style.transform = `translate(calc(-50% + ${totalX}px), calc(-${totalY}px)) scale(1.02)`;

    // 一定の高さ以上持ち上げたら紙を表示
    if (totalY > CONSTANTS.PAPER_SHOW_THRESHOLD && !gameState.isBottomDropped) {
        showPaper();
    }
}

/**
 * マウスドラッグ処理
 */
function drag(e) {
    if (!isDragging) return;

    const deltaY = startY - e.clientY; // 上方向が正の値
    const deltaX = e.clientX - startX; // 右方向が正の値

    handleDragMove(deltaX, deltaY, null, false);
}

/**
 * タッチドラッグ処理
 */
function dragTouch(e) {
    if (!isDragging) return;

    const deltaY = startY - e.touches[0].clientY; // 上方向が正の値
    const deltaX = e.touches[0].clientX - startX; // 右方向が正の値

    handleDragMove(deltaX, deltaY, e, true);
}

/**
 * ドラッグ終了処理
 */
function endDrag() {
    if (!isDragging) return;

    isDragging = false;
    isDragMode = false;
    elements.treasureBox.classList.remove('dragging');

    // 累積位置を更新（前回までの位置 + 今回のドラッグ量）
    // X座標をテーブルの範囲内に制限
    boxOffsetX = clampX(boxOffsetX + currentX);
    boxOffsetY = boxOffsetY + currentY;

    // 下には動かせないので、Y位置が負の場合は0にリセット
    if (boxOffsetY < 0) {
        boxOffsetY = 0;
    }

    // 落下アニメーション：X位置を保持したまま真下に落下
    // 高さに応じて落下時間を調整
    const fallDuration = Math.min(
        CONSTANTS.FALL_DURATION_MAX,
        CONSTANTS.FALL_DURATION_BASE + boxOffsetY / 500
    );

    elements.treasureBox.style.transition =
        `transform ${fallDuration}s cubic-bezier(0.55, 0.085, 0.68, 0.53)`;

    // X位置を保持したまま、真下に落下（Y=0に戻る）
    elements.treasureBox.style.transform =
        `translate(calc(-50% + ${boxOffsetX}px), 0) scale(1)`;

    // Y位置をリセット（宝箱はテーブルの上に戻った）
    boxOffsetY = 0;

    // アニメーション終了後、transitionをクリア
    setTimeout(() => {
        elements.treasureBox.style.transition = '';
    }, fallDuration * 1000);
}

function showPaper() {
    if (gameState.isBottomDropped) return;

    gameState.isBottomDropped = true;

    // 宝箱を持ち上げると裏に紙が見える
    elements.foldedPaper.classList.remove('hidden');
}

// ===== キーワード入力・クリア判定 =====
elements.submitButton.addEventListener('click', checkAnswer);
elements.keywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function checkAnswer() {
    const input = elements.keywordInput.value.trim();

    // 正解: 「逆転の発想」（ひらがな、漢字、混在すべてOK）
    const correctAnswers = [
        '逆転の発想',
        'ぎゃくてんのはっそう',
        'ギャクテンノハッソウ'
    ];

    const isCorrect = correctAnswers.some(answer =>
        input.toLowerCase() === answer.toLowerCase()
    );

    if (isCorrect) {
        // クリア！
        elements.answerFeedback.textContent = '';
        elements.answerFeedback.classList.remove('feedback-wrong');
        clearGame();
    } else {
        // 不正解
        elements.answerFeedback.textContent = '❌ 違うようです...もう一度考えてみましょう。';
        elements.answerFeedback.classList.add('feedback-wrong');

        // 入力欄を振動させる
        elements.keywordInput.classList.add('animate-shake');
        setTimeout(() => {
            elements.keywordInput.classList.remove('animate-shake');
        }, 500);
    }
}

// ===== クリア処理 =====
function clearGame() {
    gameState.isCleared = true;

    // クリアタイムを計算
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    elements.clearTime.textContent = timeString;

    // 紙吹雪を表示
    createConfetti();

    // クリアモーダルを表示
    setTimeout(() => {
        elements.clearModal.classList.remove('hidden');
        elements.clearModal.classList.add('modal-show');
    }, 500);
}

/**
 * 紙吹雪を生成してクリア演出を表示
 */
function createConfetti() {
    const colors = ['#c69c6d', '#3d2f23', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    for (let i = 0; i < CONSTANTS.CONFETTI_COUNT; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            elements.confettiContainer.appendChild(confetti);

            // 一定時間後に削除
            setTimeout(() => {
                confetti.remove();
            }, CONSTANTS.CONFETTI_DURATION);
        }, i * CONSTANTS.CONFETTI_INTERVAL);
    }
}

// Xシェア機能
elements.shareButton.addEventListener('click', () => {
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const text = `「逆転の宝箱」をクリアしました！⏱️ ${timeString}\n固定観念を逆転させる謎解きに挑戦しよう！\n#やまーたの謎解きアトリエ`;
    const url = window.location.href;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

    window.open(tweetUrl, '_blank', 'width=550,height=420');
});

// リトライ機能
elements.retryButton.addEventListener('click', () => {
    location.reload();
});

// ===== ヒント機能 =====
elements.hintButton.addEventListener('click', showHintModal);
elements.closeHintModal.addEventListener('click', closeHintModal);
elements.hintModal.addEventListener('click', (e) => {
    if (e.target === elements.hintModal) {
        closeHintModal();
    }
});

elements.prevHint.addEventListener('click', () => {
    if (gameState.currentHintStep > 0) {
        gameState.currentHintStep--;
        updateHintDisplay();
    }
});

elements.nextHint.addEventListener('click', () => {
    if (gameState.currentHintStep < hints.length - 1) {
        gameState.currentHintStep++;
        updateHintDisplay();
    }
});

function showHintModal() {
    updateHintDisplay();
    elements.hintModal.classList.remove('hidden');
    elements.hintModal.classList.add('modal-show');
}

/**
 * ヒントモーダルを閉じる
 */
function closeHintModal() {
    elements.hintModal.classList.remove('modal-show');
    setTimeout(() => {
        elements.hintModal.classList.add('hidden');
    }, CONSTANTS.MODAL_FADE_DELAY);
}

function updateHintDisplay() {
    const hint = hints[gameState.currentHintStep];
    elements.hintContent.innerHTML = hint.text;
    elements.hintStep.textContent = gameState.currentHintStep + 1;

    // ボタンの有効/無効
    elements.prevHint.disabled = gameState.currentHintStep === 0;
    elements.nextHint.disabled = gameState.currentHintStep === hints.length - 1;
}

// ===== 紙モーダル機能 =====
let paperCurrentStep = 1;

// 落ちた紙をクリックしてモーダル表示
elements.foldedPaper.addEventListener('click', () => {
    paperCurrentStep = 1;
    showPaperStep(1);
    elements.paperModal.classList.remove('hidden');
    elements.paperModal.classList.add('modal-show');
});

elements.closePaperModal.addEventListener('click', closePaperModal);
elements.paperModal.addEventListener('click', (e) => {
    if (e.target === elements.paperModal) {
        closePaperModal();
    }
});

/**
 * 紙モーダルを閉じる
 */
function closePaperModal() {
    elements.paperModal.classList.remove('modal-show');
    setTimeout(() => {
        elements.paperModal.classList.add('hidden');
        // モーダルを閉じたときにステップをリセット
        paperCurrentStep = 1;
        showPaperStep(1);
    }, CONSTANTS.MODAL_FADE_DELAY);
}

// 紙のステップ表示を管理
function showPaperStep(step) {
    elements.paperStep1.classList.add('hidden');
    elements.paperStep2.classList.add('hidden');
    elements.paperStep3.classList.add('hidden');

    if (step === 1) {
        elements.paperStep1.classList.remove('hidden');
    } else if (step === 2) {
        elements.paperStep2.classList.remove('hidden');
    } else if (step === 3) {
        elements.paperStep3.classList.remove('hidden');
    }
}

// ステップ1: 閉じた紙をクリック → ステップ2（開きかけ）へ
elements.paperStep1.addEventListener('click', (e) => {
    e.stopPropagation(); // モーダル閉じイベントの伝播を防止
    if (paperCurrentStep === 1) {
        paperCurrentStep = 2;
        showPaperStep(2);

        // 一定時間後にステップ3（完全に開いた状態）へ
        setTimeout(() => {
            paperCurrentStep = 3;
            showPaperStep(3);

            // キーワード入力欄にフォーカス
            setTimeout(() => {
                elements.keywordInput.focus();
            }, 500);
        }, CONSTANTS.PAPER_OPENING_DELAY);
    }
});

// ステップ2: 開きかけの紙をクリック（自動遷移中でも手動で進められる）
elements.paperStep2.addEventListener('click', (e) => {
    e.stopPropagation(); // モーダル閉じイベントの伝播を防止
    if (paperCurrentStep === 2) {
        paperCurrentStep = 3;
        showPaperStep(3);

        // キーワード入力欄にフォーカス
        setTimeout(() => {
            elements.keywordInput.focus();
        }, 500);
    }
});

// ステップ3: 完全に開いた紙をクリック → モーダルを閉じる
elements.paperStep3.addEventListener('click', (e) => {
    e.stopPropagation(); // モーダル閉じイベントの伝播を防止
    if (paperCurrentStep === 3) {
        closePaperModal();
    }
});

// ===== 初期化 =====
console.log('🎮 逆転の宝箱 - ゲーム開始！');
console.log('💡 ヒント: ダイヤル錠を開けて宝箱の中身を取り出そう！');
console.log('💡 でも...それだけで本当に開くのかな？');
