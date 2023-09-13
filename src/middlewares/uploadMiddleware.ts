import multer from 'multer';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';


dotenv.config();

const serviceAccount = require("../../firebase-admin-sdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const bucket = admin.storage().bucket(`${process.env.GCLOUD_STORAGE_BUCKET}`);


export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
export async function uploadToFirebase(file: Express.Multer.File, name: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        // Logic to upload image to Firebase
        console.log(name)
        const blob = bucket.file(`images${name}`);
        const blobStream = await blob.createWriteStream({
            metadata: { contentType: file.mimetype },
        });
        let url = '';
        blobStream.on('finish', () => {
            url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;
            resolve(url);
        });
        blobStream.on('error', (err) => {
            reject(`Unable to upload image, something went wrong: ${err}`);
        });

        blobStream.end(file.buffer);

    });
}

export async function deleteFromFirebase(url: string) {
    const patten = /o\/(.*?)\?/;
    const image = url.match(patten);
    if (!image) return;
    const file = bucket.file(`${image[1]}`);
    await file.delete();
}

export async function editFromFirebase(url: string, file: Express.Multer.File): Promise<string> {
    return new Promise(async (resolve, reject) => {
        // Logic to edit image from Firebase
        let newUrl = '';
        try {
            await deleteFromFirebase(url);
            newUrl = await uploadToFirebase(file,);
            resolve(newUrl);
        } catch (error) {
            reject(`Unable to edit image, something went wrong: ${error}`);
        }

    });
}
