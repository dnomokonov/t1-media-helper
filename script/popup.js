document.addEventListener('DOMContentLoaded', () => {
    const skip = document.querySelector('#skipper');
    const volumeCount = document.querySelector('#volumeCount')
    const saveBtn = document.querySelector('#saveSetting');
    const statusField = document.querySelector('#status');

    chrome.storage.sync.get(['skipTime', 'volume'], (data) => {
        skip.value = data.skipTime || 10;
        volumeCount.value = data.volume || 0.1;
    });

    saveBtn.addEventListener('click', () => {
        chrome.storage.sync.set({
            skipTime: parseInt(skip.value),
            volume: parseFloat(volumeCount.value)
        }, () => {
            statusField.textContent = "Настройки сохранены!"
            statusField.style.color = "green";

            setTimeout(() => {
                statusField.textContent = "";
                statusField.style.color = "black";
            }, 4000)
        })
    })

});