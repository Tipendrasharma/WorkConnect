import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Uploads a file buffer to ImageKit and returns the result (has .url)
export const uploadToImageKit = (fileBuffer, fileName, folder = "/workerconnect/profiles") => {
  return imagekit.upload({
    file: fileBuffer,       // Buffer works directly
    fileName,                // required by ImageKit
    folder,
    transformation: { pre: "w-500,h-500,fo-face" }, // face-crop, jaisa cloudinary me tha
  });
};

export default imagekit;