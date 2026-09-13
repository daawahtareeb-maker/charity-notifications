importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA7GkE88wuFBkKdnhd1-zHzLewuOulRxZA",
  projectId: "charity-notifications-6cd5e",
  messagingSenderId: "980119733083",
  appId: "1:980119733083:web:af2da1bc82c5c35a5ed07e"
});

const messaging = firebase.messaging();
// فايربيز سيتولى تلقائياً إظهار الإشعار وفتح الرابط بناءً على البيانات القادمة من الخادم
