const imageInput = document.getElementById("imageInput");
const outputImage = document.getElementById("outputImage");
const apiKey = 'Kc57zWvYjk8JS6ygLF1BqMbn'; // Replace with your API key

imageInput.addEventListener("change", handleImageUpload);

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        try {
            const resultBlob = await removeBackgroundWithAPI(file);
            const url = URL.createObjectURL(resultBlob);
            outputImage.src = url;
            outputImage.style.visibility = 'visible'; // Show the processed image
        } catch (error) {
            console.error("Background removal failed:", error);
        }
    }
}

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

    return await response.blob(); // Return the processed image as a blob
}
