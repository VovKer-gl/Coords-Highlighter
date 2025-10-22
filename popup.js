document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('highlighter-toggle');
    const statusEl = document.getElementById('status');

    chrome.storage.sync.get(['highlighterEnabled'], (result) => {
        toggle.checked = !!result.highlighterEnabled;
        updateStatus(toggle.checked);
    });

    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.sync.set({ highlighterEnabled: isEnabled });
        updateStatus(isEnabled);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: 'updateHighlighterSettings',
                    payload: { highlighterEnabled: isEnabled }
                });
            }
        });
    });

    function updateStatus(isEnabled) {
        statusEl.textContent = `Status: ${isEnabled ? 'Enabled' : 'Disabled'}`;
    }
});