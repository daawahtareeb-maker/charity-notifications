importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA7GkE88wuFBkKdnhd1-zHzLewuOulRxZA",
  authDomain: "charity-notifications-6cd5e.firebaseapp.com",
  projectId: "charity-notifications-6cd5e",
  storageBucket: "charity-notifications-6cd5e.firebasestorage.app",
  messagingSenderId: "980119733083",
  appId: "1:980119733083:web:af2da1bc82c5c35a5ed07e",
  measurementId: "G-4HRKVLCZ0G"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://dawahtareeb.com/wp-content/uploads/2023/01/شعار-الجمعية-بخلفية-مميزة.jpeg', 
    image: payload.notification.image, // لالتقاط الصورة العريضة
    data: {
      url: payload.fcmOptions?.link || '/' // لالتقاط الرابط
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// دالة تفاعلية لفتح الرابط عند نقر المستخدم على الإشعار
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if(event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
