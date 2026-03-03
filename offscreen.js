chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "PLAY_SOUND") {
        const audio = new Audio(chrome.runtime.getURL("notification.mp3"));
        audio.volume = 1.0;
        audio.play().catch(console.error);

        // Close the offscreen doc after sound finishes to free resources
        audio.addEventListener("ended", () => {
        chrome.offscreen.closeDocument();
        });
    }
});