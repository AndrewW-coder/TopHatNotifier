const soundToggle = document.getElementById('soundToggle');
const popupToggle = document.getElementById('popupToggle');
const sttus = document.getElementById('status');

chrome.storage.sync.get({ soundEnabled: true, popupEnabled: true }, (settings) => {
    soundToggle.checked = settings.soundEnabled;
    popupToggle.checked = settings.popupEnabled;
});

function save() {
    chrome.storage.sync.set({
        soundEnabled: soundToggle.checked,
        popupEnabled: popupToggle.checked
    }, () => {
        status.classList.add('visible');
        setTimeout(() => status.classList.remove('visible'), 1500);
    });
}

soundToggle.addEventListener('change', save);
popupToggle.addEventListener('change', save);