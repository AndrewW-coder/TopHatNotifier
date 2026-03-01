let lastQuestionText = null;

function getCurrentQuestion() {
    const el = document.querySelector(".question, .question-text, [data-testid='question'], .BaseQuestionHeaderstyles__HeaderWrapper-sc-1419q8j-0 ihWKHo StudentQuestionHeaderstyles__StyledBaseQuestionHeader-sc-8l3mag-0 liJRRb");
    return el ? el.innerText.trim() : null;
}

function checkForNewQuestion() {
    const current = getCurrentQuestion();
    if (current && current !== lastQuestionText) {
        lastQuestionText = current;
        chrome.runtime.sendMessage({
            type: "NEW_QUESTION",
            text: current
        });
    }
}

// Run once initially
setTimeout(checkForNewQuestion, 2000);

// Observe DOM changes
const observer = new MutationObserver(() => {
    checkForNewQuestion();
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Keep service worker and tab alive
setInterval(() => {
    chrome.runtime.sendMessage({ type: "KEEPALIVE" });
}, 25000);