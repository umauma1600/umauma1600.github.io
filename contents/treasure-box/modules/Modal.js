/**
 * モーダル管理クラス
 * 汎用的なモーダルの表示・非表示を管理
 */
class Modal {
    /**
     * @param {string} modalId - モーダル要素のID
     * @param {number} fadeDelay - フェードアウト時間（ms）
     */
    constructor(modalId, fadeDelay = 300) {
        this.modalElement = document.getElementById(modalId);
        this.fadeDelay = fadeDelay;

        if (!this.modalElement) {
            console.error(`Modal element with ID "${modalId}" not found`);
            return;
        }

        this.setupEventListeners();
    }

    /**
     * モーダルの基本イベントリスナーを設定
     */
    setupEventListeners() {
        // バックグラウンドクリックで閉じる
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.close();
            }
        });

        // 閉じるボタンのイベント（あれば）
        const closeButton = this.modalElement.querySelector('[data-close-modal]');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
    }

    /**
     * モーダルを表示
     */
    show() {
        this.modalElement.classList.remove('hidden');
        this.modalElement.classList.add('modal-show');
    }

    /**
     * モーダルを非表示
     */
    close() {
        this.modalElement.classList.remove('modal-show');
        setTimeout(() => {
            this.modalElement.classList.add('hidden');
        }, this.fadeDelay);
    }

    /**
     * モーダルが表示されているか
     * @returns {boolean}
     */
    isVisible() {
        return this.modalElement.classList.contains('modal-show');
    }

    /**
     * 特定の閉じるボタンにイベントを追加
     * @param {string} buttonId - ボタン要素のID
     */
    addCloseButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => this.close());
        }
    }
}
