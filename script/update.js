function waitForElement(selector, callback) {
    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
            observer.disconnect();
            callback(el);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

waitForElement(".video", (el) => {
    if (el) {
        updated(el);
    } else {
        console.log("Элемент .video не найден");
    }
});

function updated(videoContainer) {
    const playerLayout = videoContainer.querySelector("#vjs_video_3");
    const video = playerLayout.querySelector("#vjs_video_3_html5_api");
    const videoBar = videoContainer.querySelector("#videoBar");

    const control = document.createElement("div");
    control.className = "button-container";

    const rewindBtn = document.createElement("a");
    rewindBtn.className = "rewind-btn";
    rewindBtn.addEventListener("click", () => {
        chrome.storage.sync.get('skipTime', (data) => {
            const timer = data.skipTime || 10;
            video.currentTime = Math.max(0, video.currentTime - timer);
        });
    })

    const forwardBtn = document.createElement("a");
    forwardBtn.className = "forward-btn"
    forwardBtn.addEventListener("click", () => {
        chrome.storage.sync.get('skipTime' , (data) => {
            const timer = data.skipTime || 10;
            video.currentTime = Math.min(video.duration, video.currentTime + timer);
        })
    })

    control.appendChild(rewindBtn);
    control.appendChild(forwardBtn);

    const videoBarLeft = videoBar.querySelector(".video-bar__left");
    const secondChild = videoBarLeft.children[1];
    if (secondChild && secondChild.nextSibling) videoBarLeft.insertBefore(control, secondChild);

    keyControls(video);
}

function keyControls(video) {
    document.addEventListener('keydown', (event) => {
         if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) return;

         chrome.storage.sync.get(['skipTime', 'volume'], (data) => {
            const timer = data.skipTime || 10;
            const volume = data.volume || 0.1;
            switch (event.key) {
                case 'ArrowLeft':
                case 'a': 
                    event.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - timer);
                    break;
                case 'ArrowRight':
                case 'd':
                    event.preventDefault();
                    video.currentTime = Math.min(video.duration, video.currentTime + timer);
                    break;
                case 'ArrowUp':
                case 'w':
                    event.preventDefault();
                    video.volume = Math.min(1, video.volume + volume);
                    break;
                case 'ArrowDown':
                case 's':
                    event.preventDefault();
                    video.volume = Math.max(0, video.volume - volume);
                    break;
                case ' ':
                case 'p':
                    event.preventDefault();
                    video.paused ? video.play() : video.pause();
                    break;
            }
         })
    });
}