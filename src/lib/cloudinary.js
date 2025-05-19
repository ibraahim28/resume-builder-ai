import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, options = {}) => {
  if (!file) return null;

  // If file is a base64 data URL
  if (typeof file === "string" && file.startsWith("data:")) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file,
        {
          folder: "resume_photos",
          ...options,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
  }

  // If file is a File object
  if (typeof File !== "undefined" && file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = await cloudinary.uploader.upload(
            e.target.result,
            {
              folder: "resume_photos",
              ...options,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  return null;
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  // Extract public ID from URL if a full URL was provided
  if (publicId.includes("cloudinary.com")) {
    const urlParts = publicId.split("/");

    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
      const relevantParts = urlParts.slice(uploadIndex + 1);
      const fileName = relevantParts[relevantParts.length - 1].split(".")[0];
      const folder = relevantParts.slice(0, -1).join("/");
      publicId = folder ? `${folder}/${fileName}` : fileName;
    }
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
