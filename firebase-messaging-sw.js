// firebase-messaging-sw.js
// Behsit Field System - Firebase Cloud Messaging Service Worker
// Weka kwenye root folder ya project yako (pamoja na index.html)

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Firebase Configuration
firebase.initializeApp({
    apiKey: "AIzaSyBxVQIOUJ3GpTLewkeOicYsRJgsOx_2tJ8",
    authDomain: "logbook-20424.firebaseapp.com",
    databaseURL: "https://logbook-20424-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "logbook-20424",
    storageBucket: "logbook-20424.firebasestorage.app",
    messagingSenderId: "1018154189026",
    appId: "1:1018154189026:web:6a7b5c97e5b2f5f756debb"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
    console.log('[Service Worker] Background message received:', payload);
    
    const notificationTitle = payload.notification?.title || 'Behsit Field System';
    const notificationOptions = {
        body: payload.notification?.body || 'Una ujumbe mpya!',
        icon: 'https://fra.cloud.appwrite.io/v1/storage/buckets/6a32ddf3000938f57fb8/files/6a36391e001202801f50/view?project=6a21b1440038c361fabb',
        badge: 'https://fra.cloud.appwrite.io/v1/storage/buckets/6a32ddf3000938f57fb8/files/6a36391e001202801f50/view?project=6a21b1440038c361fabb',
        tag: payload.data?.tag || 'behsit-notification',
        data: payload.data || {},
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
            { action: 'open', title: '📋 Fungua' },
            { action: 'close', title: '❌ Funga' }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // If user clicked "Funga", do nothing
    if (event.action === 'close') {
        return;
    }
    
    // Open or focus the app
    event.waitUntil(
        clients.matchAll({ 
            type: 'window', 
            includeUncontrolled: true 
        }).then(function(windowClients) {
            // Check if there's already a window open
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window open, open a new one
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Optional: Handle push events directly
self.addEventListener('push', function(event) {
    if (event.data) {
        try {
            const data = event.data.json();
            console.log('[Service Worker] Push event received:', data);
        } catch (e) {
            console.log('[Service Worker] Push event (non-JSON):', event.data.text());
        }
    }
});

// Service worker installed successfully
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installed successfully');
    self.skipWaiting();
});

// Service worker activated
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activated successfully');
    event.waitUntil(clients.claim());
});
