import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.FIREBASE_CONFIG_BASE64) {
    throw new Error('Missing FIREBASE_CONFIG_BASE64 env variable');
}

const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64').toString('utf-8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;
