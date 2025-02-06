document.addEventListener("DOMContentLoaded", function () {
    const urlInput = document.getElementById("url-input");
    const fileTypeSelect = document.getElementById("file-type");
    const resolutionSelect = document.getElementById("resolution");
    const downloadBtn = document.getElementById("download-btn");
    const videoInfo = document.getElementById("video-info");
    const thumbnail = document.getElementById("thumbnail");
    const videoTitle = document.getElementById("video-title");
    const fileSize = document.getElementById("file-size");
    const progressBar = document.getElementById("progress-bar");

    downloadBtn.addEventListener("click", function () {
        const playlistUrl = urlInput.value.trim();
        const fileType = fileTypeSelect.value;
        const resolution = resolutionSelect.value;

        if (!playlistUrl) {
            alert("Please enter a YouTube Playlist URL.");
            return;
        }

        // Step 1: Fetch Video/Playlist Info
        fetch("https://youtube-downloader-backend-8soj.onrender.com/info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: playlistUrl })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
                return;
            }

            // Display video/playlist information
            thumbnail.src = data.thumbnail;
            videoTitle.textContent = data.title;
            fileSize.textContent = "Estimated File Size: " + data.size;
            videoInfo.style.display = "block";

            // Step 2: Start Download
            return fetch("https://youtube-downloader-backend-8soj.onrender.com/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: playlistUrl,
                    fileType: fileType,
                    resolution: resolution
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Download Failed: " + data.error);
                return;
            }

            // Simulated Progress Bar (should be replaced with actual progress updates from the backend)
            let progress = 0;
            const interval = setInterval(() => {
                if (progress >= 100) {
                    clearInterval(interval);
                } else {
                    progress += 10;
                    progressBar.style.width = progress + "%";
                }
            }, 500);

            // Redirect to the download link
            window.location.href = data.download_link;
        })
        .catch(error => {
            alert("Error connecting to server.");
            console.error("Error:", error);
        });
    });
});
