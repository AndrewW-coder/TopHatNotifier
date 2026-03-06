// chrome.runtime.onMessage.addListener((message) => {
//     if (message.type === "KEEPALIVE") return;

//     if (message.type === "NEW_QUESTION") {
//         chrome.storage.sync.get(
//             { soundEnabled: true, popupEnabled: true },
//             (settings) => {
//                 if (settings.popupEnabled) {
//                     console.log('[TopHat] Creating notification with text:', message.text.substring(0, 100));
//                     chrome.notifications.create({
//                         type: "basic",
//                         iconUrl: chrome.runtime.getURL("icon.png"),
//                         title: "New Top Hat Question!",
//                         message: message.text.substring(0, 100),
//                         priority: 2,
//                         requireInteraction: true
//                     });
//                 }
//                 if (settings.soundEnabled) {
//                     playAlertSound();
//                 }
//             }
//         );
//     }
// });

// async function playAlertSound() {
//     const existing = await chrome.offscreen.hasDocument?.();
//     if (!existing) {
//         await chrome.offscreen.createDocument({
//             url: "offscreen.html",
//             reasons: ["AUDIO_PLAYBACK"],
//             justification: "Play alert sound when a Top Hat question is posted"
//         });
//     }
//     chrome.runtime.sendMessage({ type: "PLAY_SOUND" });
// }

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "KEEPALIVE") return;

    if (message.type === "NEW_QUESTION") {
        chrome.storage.sync.get(
            { soundEnabled: true, popupEnabled: true },
            (settings) => {
                if (settings.popupEnabled) {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: chrome.runtime.getURL("icon.png"),
                        title: "New Top Hat Question!",
                        message: message.text.substring(0, 100),
                        priority: 2,
                        requireInteraction: true
                    });
                }
                if (settings.soundEnabled) {
                    playAlertSound();
                }
            }
        );
    }
});

async function playAlertSound() {
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