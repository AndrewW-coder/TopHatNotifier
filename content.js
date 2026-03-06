// window.__fakeQuestion = function(text = 'test question') { //FIXME TESTING
//     chrome.runtime.sendMessage({ type: 'NEW_QUESTION', text }); //FIXME TESTING
// }; //FIXME TESTING

// let lastQuestionText = null;
// //FIXME
// // helper for testing from the page console
// window.__fakeQuestion = function(text = 'test question') {
//     // bypass the usual DOM check and send a message directly
//     lastQuestionText = null; // force it to be considered new
//     chrome.runtime.sendMessage({ type: 'NEW_QUESTION', text });
// };
// //FIXME

// //FIXME: NEW GETCURRENTQUESTION FUNCTION: FALSE POSITIVES
// function getCurrentQuestion() {
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

// function checkForNewQuestion() {
//     const current = getCurrentQuestion();
//     if (current && current !== lastQuestionText) {
//         lastQuestionText = current;
//         chrome.runtime.sendMessage({
//             type: "NEW_QUESTION",
//             text: current
//         });
//     }
// }

// // Run once initially
// setTimeout(checkForNewQuestion, 2000);

// // Observe DOM changes
// const observer = new MutationObserver(() => {
//     checkForNewQuestion();
// });
// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// });

// // Keep service worker and tab alive
// setInterval(() => {
//     chrome.runtime.sendMessage({ type: "KEEPALIVE" });
// }, 25000);

const injected = document.createElement('script');
injected.src = chrome.runtime.getURL('injected.js');
injected.onload = () => injected.remove();
(document.head || document.documentElement).appendChild(injected);

window.addEventListener('__tophat_question__', (e) => {
    const { text, id } = e.detail;
    chrome.runtime.sendMessage({ type: 'NEW_QUESTION', text, id });
});

setInterval(() => {
    chrome.runtime.sendMessage({ type: 'KEEPALIVE' });
}, 25000);