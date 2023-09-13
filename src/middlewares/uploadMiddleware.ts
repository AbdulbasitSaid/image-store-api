import multer from 'multer';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';


dotenv.config();

const serviceAccount = require("../../firebase-admin-sdk.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const bucket = admin.storage().bucket(`${process.env.GCLOUD_STORAGE_BUCKET}`);

function getFileName(filename: string): string | null {
    let patten = /o\/(.*?)\?/;
    let FileName = filename.match(patten);
    if (!FileName) return null;
    return FileName[1];
}
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
export async function uploadToFirebase(file: Express.Multer.File, name: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const blob = bucket.file(`${name}`);
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
    const file = bucket.file(`${getFileName(url)}`);
    await file.delete();
}

export async function editFromFirebase(url: string, file: Express.Multer.File): Promise<string> {
    return new Promise(async (resolve, reject) => {
        // Logic to edit image from Firebase
        try {
            await deleteFromFirebase(url);
            await uploadToFirebase(file, getFileName(url)!);
            resolve(getFileName(url)!);
        } catch (error) {
            reject(`Unable to edit image, something went wrong: ${error}`);
        }

    });
}
