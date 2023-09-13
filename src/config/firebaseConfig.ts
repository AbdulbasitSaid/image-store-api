import * as admin from 'firebase-admin';
const serviceAccount = require('./path/to/firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const bucket = admin.storage().bucket(process.env.GCLOUD_STORAGE_BUCKET);
