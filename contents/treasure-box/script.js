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
        text: 'ダイヤル錠の暗号は解けましたか？<br>でも...それだけで宝箱は開くのでしょうか？<br><span class="highlight">固定観念にとらわれないで</span>考えてみましょう。'
    },
    {
        step: 4,
        text: '宝箱を<span class="highlight">違う方向から</span>アプローチしてみては？<br>上に持ち上げてみると...何か起こるかもしれません。'
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

// ===== ダイヤル錠モーダル =====
elements.lockIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // 宝箱のドラッグを防ぐ
    showDialModal();
});

function showDialModal() {
    elements.dialModal.classList.remove('hidden');
    elements.dialModal.classList.add('modal-show');
}

function closeDialModal() {
    elements.dialModal.classList.remove('modal-show');
    setTimeout(() => {
        elements.dialModal.classList.add('hidden');
    }, 300);
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
let isDragMode = false; // ドラッグモードかどうか
let startY = 0;
let startX = 0;
let currentY = 0;
let currentX = 0;
let boxOffsetX = 0; // 宝箱の累積X位置（中央からのずれ）
let boxOffsetY = 0; // 宝箱の累積Y位置（下からの高さ）
let dragModeThreshold = 30; // 上方向に30px以上でドラッグモード開始
let paperShowThreshold = 50; // 50px以上持ち上げると紙が見える

// テーブルと宝箱のサイズ（レスポンシブ対応）
function getDragLimits() {
    const isMobile = window.innerWidth <= 768;
    const tableWidth = isMobile ? 600 : 880; // テーブルの幅
    const boxWidth = isMobile ? 128 : 160;   // 宝箱の幅（w-32 = 128px, w-40 = 160px）
    const maxOffset = (tableWidth - boxWidth) / 2; // 中央から左右に動ける最大距離
    return { maxOffset };
}

// X座標の範囲制限を適用
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

function drag(e) {
    if (!isDragging) return;

    const deltaY = startY - e.clientY; // 上方向が正の値
    const deltaX = e.clientX - startX; // 右方向が正の値

    // ドラッグモードでない場合、上方向のしきい値をチェック
    if (!isDragMode) {
        if (deltaY > dragModeThreshold) {
            // 上方向に30px以上動いたらドラッグモードに
            isDragMode = true;
            elements.treasureBox.classList.add('dragging');
        } else {
            // まだしきい値に達していない場合は何もしない（スクロール可能）
            return;
        }
    }

    // ドラッグモード：マウス位置に追従
    currentY = deltaY;
    currentX = deltaX;

    // 上方向のドラッグのみ許可（下には動かせない）
    // boxOffsetX（前回までの累積X位置）+ currentX（今回のドラッグ量）
    // boxOffsetY（前回までの累積Y位置）+ currentY（今回のドラッグ量）
    if (currentY > 0) {
        // X座標をテーブルの範囲内に制限
        const totalX = clampX(boxOffsetX + currentX);
        const totalY = boxOffsetY + currentY;
        elements.treasureBox.style.transform = `translate(calc(-50% + ${totalX}px), calc(-${totalY}px)) scale(1.02)`;

        // 一定の高さ以上持ち上げたら紙を表示
        if (totalY > paperShowThreshold && !gameState.isBottomDropped) {
            showPaper();
        }
    }
}

function dragTouch(e) {
    if (!isDragging) return;

    const deltaY = startY - e.touches[0].clientY; // 上方向が正の値
    const deltaX = e.touches[0].clientX - startX; // 右方向が正の値

    // ドラッグモードでない場合、上方向のしきい値をチェック
    if (!isDragMode) {
        if (deltaY > dragModeThreshold) {
            // 上方向に30px以上動いたらドラッグモードに
            isDragMode = true;
            elements.treasureBox.classList.add('dragging');
            // ドラッグモードになったらページスクロールを防止
            e.preventDefault();
        } else {
            // まだしきい値に達していない場合は何もしない（スクロール可能）
            return;
        }
    } else {
        // ドラッグモード中はページスクロールを防止
        e.preventDefault();
    }

    // ドラッグモード：タッチ位置に追従
    currentY = deltaY;
    currentX = deltaX;

    // 上方向のドラッグのみ許可（下には動かせない）
    // boxOffsetX（前回までの累積X位置）+ currentX（今回のドラッグ量）
    // boxOffsetY（前回までの累積Y位置）+ currentY（今回のドラッグ量）
    if (currentY > 0) {
        // X座標をテーブルの範囲内に制限
        const totalX = clampX(boxOffsetX + currentX);
        const totalY = boxOffsetY + currentY;
        elements.treasureBox.style.transform = `translate(calc(-50% + ${totalX}px), calc(-${totalY}px)) scale(1.02)`;

        // 一定の高さ以上持ち上げたら紙を表示
        if (totalY > paperShowThreshold && !gameState.isBottomDropped) {
            showPaper();
        }
    }
}

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
    // 高さに応じて落下時間を調整（最大0.6秒）
    const fallDuration = Math.min(0.6, 0.3 + boxOffsetY / 500);

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

function closePaperModal() {
    elements.paperModal.classList.remove('modal-show');
    setTimeout(() => {
        elements.paperModal.classList.add('hidden');
        // モーダルを閉じたときにステップをリセット
        paperCurrentStep = 1;
        showPaperStep(1);
    }, 300);
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

        // 0.8秒後にステップ3（完全に開いた状態）へ
        setTimeout(() => {
            paperCurrentStep = 3;
            showPaperStep(3);

            // キーワード入力欄にフォーカス
            setTimeout(() => {
                elements.keywordInput.focus();
            }, 500);
        }, 800);
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
console.log('💡 ヒント: 部屋の中を調べて、ダイヤル錠の暗号を解こう！');
console.log('💡 でも...それだけで本当に開くのかな？');
