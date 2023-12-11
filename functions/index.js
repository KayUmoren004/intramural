/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/logger");
const {onObjectFinalized} = require("firebase-functions/v2/storage");
const {initializeApp} = require("firebase-admin/app");
const {getStorage} = require("firebase-admin/storage");
const {getFirestore} = require("firebase-admin/firestore");
const sharp = require("sharp");
const {encode} = require("blurhash");

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp();

exports.generateBlurhash = onObjectFinalized(async (event) => {
  console.log("event", event);
  const fileBucket = event.bucket // The Storage bucket that contains the file.
  const filePath = event.data.name; // File path in the bucket.
  const contentType = event.contentType; // File content type.

  console.log({
    fileBucket,
    filePath,
    contentType,
  });

  console.log("File change detected, function execution started");
  const bucket = getStorage().bucket(fileBucket);
  console.log("bucket", bucket)
  const file = bucket.file(filePath);
  console.log("file", file)

  console.log("Trying to download file")
  try {
    // Download file into memory
    const [fileBuffer] = await file.download();
    console.log("fileBuffer", fileBuffer)
    const {data, info} = await sharp(fileBuffer).ensureAlpha()
      .raw()
      .toBuffer({resolveWithObject: true});
      console.log("Sharp functions: ", {
        data,
        info
      })
    

    // Validate that the image is a PNG
    console.log("Validating image type")
      if (info.width * info.height * 4 !== data.length) {
        console.log("Throwing error")
        throw new ValidationError("Width and height must match the pixels array");
     }
     console.log("Image type validated")

     console.log("Generating blurhash")
    const blurhash = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      4,
      4
    );
    console.log("Blurhash generated: ", blurhash)

    // Update Firestore document with the blurhash
    console.log("Updating Firestore document")
    const userId = extractUserIdFromFilePath(filePath); // Implement based on your file naming convention
    console.log("userId", userId)
    const firestore = getFirestore();
    console.log("Firestore initialized")
    await firestore.doc(`users/${userId}`).update({image_blurhash: blurhash});
    console.log("Firestore document updated")

    console.log("Blurhash generated and saved to Firestore for user:", userId);
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image and generate blurhash");
  }
});

const extractUserIdFromFilePath = (filePath) => {
  console.log("filePath", filePath)
  // Assuming the file path is of the format 'profilePhotos/{userId}.jpg'
  const pathSegments = filePath.split("/");
  console.log("pathSegments", pathSegments)

  // Clean up the userId segment by removing the file extension
  const userId = pathSegments[1]
  console.log("userId - extractUserIdFromFilePath", userId)
  return userId;
};
