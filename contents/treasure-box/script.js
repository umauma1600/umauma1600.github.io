// ===== ゲーム状態管理 =====
const gameState = {
    dialValues: [0, 0, 0, 0],
    correctDial: [1, 6, 0, 0], // 正解: 1600
    isLockUnlocked: false,
    isBottomDropped: false,
    isCleared: false,
    startTime: Date.now(),
    examinedObjects: new Set(),
    currentHintStep: 0,
};

// ===== オブジェクト情報 =====
const objectInfo = {
    painting: {
        title: '壁の絵画',
        content: `
            <p>古びた絵画が壁に掛かっている。</p>
            <p>16世紀のルネサンス期を思わせる風景画だ。</p>
            <p class="highlight mt-3">絵画の隅に小さく「16」という数字が書かれている。</p>
        `
    },
    clock: {
        title: '古い時計',
        content: `
            <p>振り子時計が静かに時を刻んでいる。</p>
            <p>文字盤を見ると、針が止まっているようだ。</p>
            <p class="highlight mt-3">時計は「4時」を指して止まっている。<br>16時...つまり午後4時だ。</p>
        `
    },
    book: {
        title: '古びた本',
        content: `
            <p>埃をかぶった厚い本が置いてある。</p>
            <p>ページを開くと、数字に関する記述がある。</p>
            <p class="highlight mt-3">「完全な数は美しい。最初の完全数は1と6だ。」</p>
            <p class="text-sm text-text/60 mt-2">※1は単位、6は1+2+3の約数の和</p>
        `
    },
    window: {
        title: '窓の外',
        content: `
            <p>窓から外を眺めると、静かな庭が見える。</p>
            <p>特に変わったものは見当たらない...</p>
            <p class="highlight mt-3">でも、窓枠に小さく「00」という落書きがある。</p>
        `
    }
};

// ===== ヒント情報 =====
const hints = [
    {
        step: 1,
        text: '部屋の中をよく調べてみましょう。<br>4つのオブジェクトには、それぞれダイヤル錠を解くヒントが隠されています。'
    },
    {
        step: 2,
        text: '見つけた数字を組み合わせてみましょう。<br>「16」「4時(16時)」「1と6」「00」...<br>4桁の数字が見えてきませんか？'
    },
    {
        step: 3,
        text: '錠は外れたのに開きません...何か別の方法があるのでは？<br>固定観念にとらわれていませんか？<br>宝箱を<span class="highlight">違う方向から</span>アプローチしてみては？'
    },
    {
        step: 4,
        text: '宝箱を<span class="highlight">上に</span>ドラッグ（持ち上げて）みてください！<br>底が抜けているかもしれません。'
    }
];

// ===== DOM要素の取得 =====
const elements = {
    // ダイヤル関連
    dialUpButtons: document.querySelectorAll('.dial-up'),
    dialDownButtons: document.querySelectorAll('.dial-down'),
    dialValues: document.querySelectorAll('.dial-value'),
    dialLock: document.getElementById('dialLock'),

    // 宝箱関連
    treasureBox: document.getElementById('treasureBox'),
    treasureBoxContainer: document.getElementById('treasureBoxContainer'),
    boxBottom: document.getElementById('boxBottom'),
    paper: document.getElementById('paper'),
    dragHint: document.getElementById('dragHint'),

    // オブジェクト関連
    objectItems: document.querySelectorAll('.object-item'),
    objectModal: document.getElementById('objectModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalContent: document.getElementById('modalContent'),
    closeModal: document.getElementById('closeModal'),

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
function updateTimer() {
    if (gameState.isCleared) return;

    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    elements.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

setInterval(updateTimer, 1000);

// ===== ダイヤル錠機能 =====
function rotateDial(index, direction) {
    // 0-9の範囲で循環
    gameState.dialValues[index] = (gameState.dialValues[index] + direction + 10) % 10;
    elements.dialValues[index].textContent = gameState.dialValues[index];

    // 正解チェック
    checkDialAnswer();
}

function checkDialAnswer() {
    if (gameState.isLockUnlocked) return;

    // 配列の比較
    const isCorrect = gameState.dialValues.every((val, idx) => val === gameState.correctDial[idx]);

    if (isCorrect) {
        unlockDial();
    }
}

function unlockDial() {
    gameState.isLockUnlocked = true;

    // 錠が外れるアニメーション
    elements.dialLock.classList.add('unlocked');

    setTimeout(() => {
        elements.dialLock.style.display = 'none';

        // 宝箱をドラッグ可能にする
        elements.treasureBox.classList.add('draggable');

        // ドラッグヒント表示
        elements.dragHint.classList.remove('hidden');

        // ヒントステップを3に更新（錠解除後のヒント）
        if (gameState.currentHintStep < 2) {
            gameState.currentHintStep = 2;
        }
    }, 800);
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

// ===== オブジェクト調査機能 =====
elements.objectItems.forEach((item) => {
    item.addEventListener('click', () => {
        const objectId = item.dataset.object;
        examineObject(objectId, item);
    });
});

function examineObject(objectId, element) {
    const info = objectInfo[objectId];

    // モーダル表示
    elements.modalTitle.textContent = info.title;
    elements.modalContent.innerHTML = info.content;
    elements.objectModal.classList.remove('hidden');
    elements.objectModal.classList.add('modal-show');

    // 調べ済みマーク
    if (!gameState.examinedObjects.has(objectId)) {
        gameState.examinedObjects.add(objectId);
        element.classList.add('examined');
    }
}

// モーダルを閉じる
elements.closeModal.addEventListener('click', closeObjectModal);
elements.objectModal.addEventListener('click', (e) => {
    if (e.target === elements.objectModal) {
        closeObjectModal();
    }
});

function closeObjectModal() {
    elements.objectModal.classList.remove('modal-show');
    setTimeout(() => {
        elements.objectModal.classList.add('hidden');
    }, 300);
}

// ===== 宝箱ドラッグ機能 =====
let isDragging = false;
let startY = 0;
let currentY = 0;
let dragThreshold = 100; // 100px以上上にドラッグで底が抜ける

// マウスイベント
elements.treasureBox.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);

// タッチイベント
elements.treasureBox.addEventListener('touchstart', startDragTouch);
document.addEventListener('touchmove', dragTouch);
document.addEventListener('touchend', endDrag);

function startDrag(e) {
    if (!gameState.isLockUnlocked || gameState.isBottomDropped) return;

    isDragging = true;
    startY = e.clientY;
    elements.treasureBox.classList.add('dragging');
}

function startDragTouch(e) {
    if (!gameState.isLockUnlocked || gameState.isBottomDropped) return;

    isDragging = true;
    startY = e.touches[0].clientY;
    elements.treasureBox.classList.add('dragging');
}

function drag(e) {
    if (!isDragging) return;

    currentY = startY - e.clientY; // 上方向が正の値

    if (currentY > 0) {
        elements.treasureBox.style.transform = `translateY(-${currentY}px)`;
    }

    if (currentY > dragThreshold) {
        dropBottom();
    }
}

function dragTouch(e) {
    if (!isDragging) return;

    currentY = startY - e.touches[0].clientY;

    if (currentY > 0) {
        elements.treasureBox.style.transform = `translateY(-${currentY}px)`;
    }

    if (currentY > dragThreshold) {
        dropBottom();
    }
}

function endDrag() {
    if (!isDragging) return;

    isDragging = false;
    elements.treasureBox.classList.remove('dragging');

    // しきい値に達していない場合は元に戻す
    if (currentY < dragThreshold) {
        elements.treasureBox.style.transform = 'translateY(0)';
    }
}

function dropBottom() {
    if (gameState.isBottomDropped) return;

    gameState.isBottomDropped = true;
    isDragging = false;

    // ドラッグヒントを非表示
    elements.dragHint.classList.add('hidden');

    // 宝箱が持ち上がる
    elements.treasureBox.classList.add('lifting');

    // 底が抜ける
    elements.boxBottom.classList.add('dropping');

    // 紙が落ちる
    setTimeout(() => {
        elements.paper.classList.remove('hidden');
        elements.paper.classList.add('falling');
    }, 500);

    // キーワード入力欄にフォーカス
    setTimeout(() => {
        elements.keywordInput.focus();
    }, 2000);
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

// 紙吹雪の生成
function createConfetti() {
    const colors = ['#c69c6d', '#3d2f23', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            elements.confettiContainer.appendChild(confetti);

            // 5秒後に削除
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 30);
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

function closeHintModal() {
    elements.hintModal.classList.remove('modal-show');
    setTimeout(() => {
        elements.hintModal.classList.add('hidden');
    }, 300);
}

function updateHintDisplay() {
    const hint = hints[gameState.currentHintStep];
    elements.hintContent.innerHTML = hint.text;
    elements.hintStep.textContent = gameState.currentHintStep + 1;

    // ボタンの有効/無効
    elements.prevHint.disabled = gameState.currentHintStep === 0;
    elements.nextHint.disabled = gameState.currentHintStep === hints.length - 1;
}

// ===== 初期化 =====
console.log('🎮 逆転の宝箱 - ゲーム開始！');
console.log('💡 ヒント: 部屋の中を調べて、ダイヤル錠の暗号を解こう！');
