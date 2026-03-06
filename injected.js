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
        // Find all list items that have a QuestionIcon — these are question rows
        const questionIcons = document.querySelectorAll('[data-testid="QuestionIcon"]');

        questionIcons.forEach(icon => {
            // Walk up to the list-row container
            const row = icon.closest('[data-hotkey-id="list-item"]');
            if (!row) return;

            // Extract the sanity ID from the container div (e.g. "sanity=Question2")
            const container = row.querySelector('[data-click-id*="sanity="]');
            const sanityId = container
                ? container.getAttribute('data-click-id')
                : null;

            // Skip if we've already seen this question ID
            if (sanityId && seen.has(sanityId)) return;

            // Get the question title text
            const titleEl = row.querySelector('[data-click-id*="details title"]');
            const text = titleEl?.innerText?.trim();

            if (!text) return;

            // Only alert for unanswered questions (i.e. newly posted ones)
            const subtextEl = row.querySelector('[data-click-id*="details subtext"]');
            const subtext = subtextEl?.innerText?.trim().toLowerCase();
            if (subtext && subtext !== 'unanswered') return;

            maybeDispatch(text, sanityId ?? text);
        });
    }

    // Watch for new question rows being added to the sidebar
    const observer = new MutationObserver(() => {
        scanForQuestions();
    });

    // Start observing once the body is ready
    function startObserving() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // Initial scan in case questions are already on the page
        scanForQuestions();
    }

    if (document.body) {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }

    // Testing helper — call __fakeQuestion() in DevTools console
    window.__fakeQuestion = function (text = 'test question') {
        maybeDispatch(text, '__test__' + Date.now());
    };
})();