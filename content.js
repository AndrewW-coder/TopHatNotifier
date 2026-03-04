// TESTING helper: call __fakeQuestion('') in console
window.__fakeQuestion = function (text = "test question") {
  chrome.runtime.sendMessage({ type: "NEW_QUESTION", text });
};

const seenQuestionIds = new Set();
let initialized = false;

function getQuestionListItems() {
  const labels = Array.from(document.querySelectorAll('span[id^="label-item-"]'));
  if (labels.length === 0) return [];

  return labels
    .map((label) => {
      const m = label.id.match(/^label-item-(\d+)/);
      if (!m) return null;

      const id = m[1];
      const raw = (label.textContent || "").trim();
      const parts = raw.split(",").map((s) => s.trim());

      const kind = (parts[0] || "").toLowerCase(); // "question"
      if (kind !== "question") return null;

      const title = parts[1] || "";
      const openClosed = parts[2] || "";
      const answeredState = parts[3] || "";

      const row = label.closest("li") || label.closest('[role="button"]') || label.parentElement;
      const isBlocked = row ? !!row.querySelector('[data-testid="BlockIcon"]') : false;

      const isUnanswered = /unanswered/i.test(answeredState);

      return { id, title, openClosed, answeredState, isUnanswered, isBlocked, raw };
    })
    .filter(Boolean);
}

function scanForNewQuestions() {
  const items = getQuestionListItems();
  if (items.length === 0) return;

  for (const item of items) {
    const firstTime = !seenQuestionIds.has(item.id);
    if (firstTime) {
      seenQuestionIds.add(item.id);

      if (!initialized) continue;

      if (item.isUnanswered && !item.isBlocked) {
        chrome.runtime.sendMessage({
          type: "NEW_QUESTION",
          text: item.title || "New question"
        });
      }
    }
  }

  initialized = true;
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