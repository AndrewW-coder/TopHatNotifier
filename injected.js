(function () {
    const seen = new Set();

    function maybeDispatch(questionText, questionId) {
        if (!questionText || seen.has(questionId ?? questionText)) return;
        seen.add(questionId ?? questionText);
        window.dispatchEvent(new CustomEvent('__tophat_question__', {
            detail: { text: questionText, id: questionId }
        }));
    }

    function scanForQuestions() {
        const questionIcons = document.querySelectorAll('[data-testid="QuestionIcon"]');

        questionIcons.forEach(icon => {
            const row = icon.closest('[data-hotkey-id="list-item"]');
            if (!row) return;

            const container = row.querySelector('[data-click-id*="sanity="]');
            const sanityId = container
                ? container.getAttribute('data-click-id')
                : null;

            if (sanityId && seen.has(sanityId)) return;

            const titleEl = row.querySelector('[data-click-id*="details title"]');
            const text = titleEl?.innerText?.trim();

            if (!text) return;

            const subtextEl = row.querySelector('[data-click-id*="details subtext"]');
            const subtext = subtextEl?.innerText?.trim().toLowerCase();
            if (subtext && subtext !== 'unanswered') return;

            maybeDispatch(text, sanityId ?? text);
        });
    }

    function startObserving() {
        const observer = new MutationObserver(() => {
            scanForQuestions();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        scanForQuestions();
    }

    if (document.body) {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }
})();