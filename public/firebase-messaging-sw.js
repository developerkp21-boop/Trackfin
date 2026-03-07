importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// Update these configs exactly as they are in your firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyB3KJi3Pe51WYzpVM6WHrUH59ITAlD48V0",
    authDomain: "trackfin-8e4af.firebaseapp.com",
    projectId: "trackfin-8e4af",
    storageBucket: "trackfin-8e4af.firebasestorage.app",
    messagingSenderId: "605718860717",
    appId: "1:605718860717:web:703231cc8d78576fa60724",
    measurementId: "G-7N0VNDBJGJ"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/vite.svg'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
