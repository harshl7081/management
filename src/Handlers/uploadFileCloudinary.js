export const uploadFileCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "xhysvstn");
  formData.append("folder", "EduProjectLog");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dbdydwgys/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  return data;
};
