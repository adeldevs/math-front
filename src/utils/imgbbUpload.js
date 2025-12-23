// Utility to upload images to imgbb
// Usage: await uploadToImgbb(file)

const API_KEY = "c31b5340081dec80f2fdc7b4c878a037"; // imgbb API key

export async function uploadToImgbb(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  const data = await res.json();
  return data.data.url;
}
