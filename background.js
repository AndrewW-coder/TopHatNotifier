chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "NEW_QUESTION") {

        // Show notification
        chrome.notifications.create({
            type: "basic",
            iconUrl: "https://via.placeholder.com/128",
            title: "New Top Hat Question!",
            message: message.text.substring(0, 100),
            priority: 2,
        requireInteraction: true   // keeps the popup until dismissed
        });

        // Play alert sound via offscreen document
        playAlertSound();
    }
});

async function playAlertSound() {
  // Only one offscreen doc can exist at a time
  const existing = await chrome.offscreen.hasDocument?.();
  if (!existing) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play alert sound when a Top Hat question is posted"
    });
  }
  chrome.runtime.sendMessage({ type: "PLAY_SOUND" });
}