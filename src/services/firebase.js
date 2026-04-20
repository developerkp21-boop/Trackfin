import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB3KJi3Pe51WYzpVM6WHrUH59ITAlD48V0",
  authDomain: "trackfin-8e4af.firebaseapp.com",
  projectId: "trackfin-8e4af",
  storageBucket: "trackfin-8e4af.firebasestorage.app",
  messagingSenderId: "605718860717",
  appId: "1:605718860717:web:703231cc8d78576fa60724",
  measurementId: "G-7N0VNDBJGJ",
};

const app = initializeApp(firebaseConfig);
let messaging = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn("Firebase messaging is not available in this browser.", err);
  }
}

export { messaging };

export const requestForToken = async () => {
  if (!messaging || typeof Notification === "undefined") {
    return null;
  }

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey || vapidKey === "YOUR_VAPID_KEY_HERE") {
    console.warn("VITE_FIREBASE_VAPID_KEY is missing; skipping FCM token sync.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    const swRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    const currentToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swRegistration,
    });

    return currentToken || null;
  } catch (err) {
    console.warn("An error occurred while retrieving FCM token.", err);
    return null;
  }
};

export const subscribeToForegroundMessages = (callback) => {
  if (!messaging || typeof callback !== "function") {
    return () => {};
  }

  try {
    return onMessage(messaging, callback);
  } catch (err) {
    console.warn("Unable to subscribe to foreground FCM messages.", err);
    return () => {};
  }
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (!messaging) {
      resolve(null);
      return;
    }

    try {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      reject(err);
    }
  });
