let lastQuestionText = null;
function getCurrentQuestion() {
    // 🔍 YOU MUST UPDATE THIS SELECTOR
    // Inspect Top Hat and replace with the actual class/id
    const el = document.querySelector(".question, .question-text, [data-testid='question']");
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