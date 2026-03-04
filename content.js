// TESTING helper: call __fakeQuestion('') in console
window.__fakeQuestion = function (text = "test question") {
  chrome.runtime.sendMessage({ type: "NEW_QUESTION", text });
};

//NEW GETCURRENTQUESTION FUNCTION: FALSE POSITIVES AND NEGATIVES

//   // Family A: student preview / section header
//   const a =
//     document.querySelector('[data-click-id="student question preview title"] h1') ||
//     document.querySelector('[data-click-id="student question preview title"]') ||
//     document.querySelector('[data-hotkey-id="section-header"] h1') ||
//     document.querySelector('[data-hotkey-id="section-header"]');

//   if (a) {
//     const txt = a.innerText.trim();
//     if (txt) return txt;
//   }

//   // Family B: question header with QuestionIcon
//   const icon = document.querySelector('[data-testid="QuestionIcon"]');
//   if (icon) {
//     const container = icon.closest('div');
//     if (container) {
//       const h1 = container.parentElement?.querySelector('h1');
//       const txt = h1?.innerText?.trim();
//       if (txt) return txt;
//     }
//   }

//   // Fallback: any visible heading level 1/2 near the top
//   const fallback = document.querySelector('h1, [role="heading"][aria-level="2"]');
//   return fallback ? fallback.innerText.trim() : null;
// }



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