import { initializeApp, cert, getApps, getApp, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";


// You may need to provide your service account credentials as a JSON file
// For vercel/next, you can inject config from env vars if required
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

let app: App;

if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount as any),
  });
} else {
  app = getApp();
}

const db = getFirestore(app);
export { db, app };
