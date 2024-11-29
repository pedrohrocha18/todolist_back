import admin from "firebase-admin";
import { createRequire } from "module";
import dotenv from 'dotenv'

dotenv.config()

const require = createRequire(import.meta.url);

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATA_BASE_URL,
  });
  console.log("Conectado ao firebase");
} catch (error) {
  console.log(error);
}
export const db = admin.firestore();
export const auth = admin.auth();
