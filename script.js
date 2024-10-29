const imageInput = document.getElementById("imageInput");
const outputImage = document.getElementById("outputImage");
const apiKey = 'YourAPIkeys';
const dropArea = document.getElementById("drop-area");
const progressBar = document.getElementById("progress-bar"); 
const downloadLink = document.getElementById("downloadLink");

// Trigger file selection dialog on drop area click
dropArea.addEventListener("click", () => imageInput.click());

// Handle file selection and drag-and-drop uploads
imageInput.addEventListener("change", (e) => handleFiles(e.target.files));
dropArea.addEventListener("dragover", (e) => { e.preventDefault(); dropArea.classList.add("highlight"); });
dropArea.addEventListener("dragleave", () => dropArea.classList.remove("highlight"));
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("highlight");
    handleFiles(e.dataTransfer.files);
});

// Handle both drag-and-drop and file selection uploads
async function handleFiles(files) {
    const file = files[0];
    if (file) {
        showProgress(true);
        try {
            const resultBlob = await removeBackgroundWithAPI(file);
            const url = URL.createObjectURL(resultBlob);
            outputImage.src = url;
            outputImage.style.visibility = 'visible';

            // Set up the download link
            downloadLink.href = url; // Set the href to the blob URL
            downloadLink.download = 'processed-image.png'; // Set the default filename
            downloadLink.style.display = 'block'; // Show the download link

        } catch (error) {
            console.error("Background removal failed:", error);
        } finally {
            showProgress(false);
        }
    }
}

// Background removal function using the Remove.bg API
async function removeBackgroundWithAPI(imageFile) {
    const formData = new FormData();
    formData.append("image_file", imageFile);
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": apiKey },
        body: formData,
    });

    if (!response.ok) throw new Error("Error with Remove.bg API");

    return await response.blob();
}

// Show and hide progress bar
function showProgress(isLoading) {
    progressBar.style.visibility = isLoading ? 'visible' : 'hidden';
    progressBar.style.width = isLoading ? '100%' : '0';
}
