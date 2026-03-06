chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "PLAY_SOUND") {
        const audio = new Audio(chrome.runtime.getURL("Notification.mp3"));
        audio.volume = 1.0;
        audio.play().catch(console.error);

        audio.addEventListener("ended", () => {
            chrome.offscreen.closeDocument();
        });
    }
});