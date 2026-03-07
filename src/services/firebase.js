// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3KJi3Pe51WYzpVM6WHrUH59ITAlD48V0",
    authDomain: "trackfin-8e4af.firebaseapp.com",
    projectId: "trackfin-8e4af",
    storageBucket: "trackfin-8e4af.firebasestorage.app",
    messagingSenderId: "605718860717",
    appId: "1:605718860717:web:703231cc8d78576fa60724",
    measurementId: "G-7N0VNDBJGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

// Function to request notification permission and get token
export const requestForToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
                // Replaced with .env config
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY_HERE'
            });

            if (currentToken) {
                console.log('FCM Token generated successfully');
                return currentToken;
            } else {
                console.log('No registration token available. Request permission to generate one.');
                return null;
            }
        } else {
            console.log('Notification permission denied by user.');
            return null;
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
        return null;
    }
};

// Function to handle foreground messages
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });