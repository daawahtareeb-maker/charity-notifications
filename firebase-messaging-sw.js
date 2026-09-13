importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// تهيئة إعدادات فايربيز (نفس الإعدادات الخاصة بمشروعك)
firebase.initializeApp({
  apiKey: "AIzaSyA7GkE88wuFBkKdnhd1-zHzLewuOulRxZA",
  projectId: "charity-notifications-6cd5e",
  messagingSenderId: "980119733083",
  appId: "1:980119733083:web:af2da1bc82c5c35a5ed07e"
});

const messaging = firebase.messaging();

// استلام الإشعار في الخلفية وعرضه بشكل آمن يمنع تحذيرات المتصفح
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification?.title || "تنبيه من الجمعية";
  const notificationOptions = {
    body: payload.notification?.body || "",
    // يمكنك لاحقاً وضع رابط شعار الجمعية هنا بدلاً من icon.png
    icon: '/icon.png', 
    data: {
      url: payload.fcmOptions?.link || 'https://daawahtareeb-maker.github.io/charity-notifications/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// التعامل مع حدث النقر على الإشعار لفتح الرابط وإغلاق الإشعار فوراً
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data.url;
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});
