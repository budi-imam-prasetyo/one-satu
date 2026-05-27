/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

let messaging = null;

const ensureMessaging = (config) => {
  if (messaging) return;
  firebase.initializeApp(config);
  messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload?.notification?.title || 'Notifikasi baru';
    const options = {
      body: payload?.notification?.body || '',
      icon: '/favicon.ico',
      data: payload?.data || {},
    };
    self.registration.showNotification(title, options);
  });
};

self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_CONFIG' && event.data?.config) {
    ensureMessaging(event.data.config);
  }
});
