import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

// Firebase Web API keys are public identifiers for the client SDK, not
// secrets — safe to ship in frontend code. Real protection comes from
// Firebase Authentication, Firestore Security Rules and server-side
// authorization (see functions/src and firestore.rules).
const firebaseConfig = {
  apiKey: "AIzaSyAonhZ3EsqnuXvOv-EB9INPgYVd4LDWUTM",
  authDomain: "nirbhay-explorer-ai.firebaseapp.com",
  projectId: "nirbhay-explorer-ai",
  storageBucket: "nirbhay-explorer-ai.firebasestorage.app",
  messagingSenderId: "108295797294",
  appId: "1:108295797294:web:e3aebc1637f8855e4cfdbf",
  measurementId: "G-M4YHKSNMD3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export let analytics = null;
analyticsSupported().then((supported) => {
  if (supported) analytics = getAnalytics(app);
});

// Central, configurable non-secret app settings.
// Legal URLs are stored in Firestore (appConfig/legal) so the admin can
// map the three supplied Drive links to Terms / Privacy / Limitations
// without a redeploy — this is just the local fallback shape.
export const appConfig = {
  appName: "Nirbhay Explorer AI",
  adminEmail: "contact.nirbheexplorer@gmail.com",
  legal: {
    termsUrl: "",
    privacyUrl: "",
    limitationsUrl: "",
    documentationUrl: ""
  },
  features: {
    readAloud: true,
    screenshot: true,
    share: true,
    announcements: true,
    maintenanceMode: true
  }
};
