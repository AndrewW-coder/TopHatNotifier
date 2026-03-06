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