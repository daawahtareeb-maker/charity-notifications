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

// ==============================================================
// إضافة نظام الإحصائيات (الاستلام والنقر)
// ==============================================================

// ⚠️ ضع رابط تطبيق الويب (Web App URL) الجديد الذي نسخته من Apps Script هنا
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7emLwKClLEgeTBkYLzjRwaZyV3PbrTAiVRoZuaToRvfV-qdjKzWTXqd69B_BDIQz-/exec";

// دالة إرسال النبضات إلى جداول بيانات جوجل
function sendAnalyticsPulse(notificationId, type) {
  if (!notificationId) return;
  
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: "analytics",
      notificationId: notificationId,
      type: type // إما 'receive' أو 'click'
    })
  }).catch(err => console.log("Analytics Error: ", err));
}

// 1. مراقبة وصول الإشعار في الخلفية (تم الاستلام)
self.addEventListener('push', function(event) {
  try {
    const payload = event.data.json();
    const notificationId = payload.data ? payload.data.notificationId : null;
    
    if (notificationId) {
      sendAnalyticsPulse(notificationId, 'receive');
    }
  } catch (e) {
    console.log("خطأ في التقاط الاستلام: ", e);
  }
  // لا نوقف الحدث هنا، لكي يكمل Firebase عمله الطبيعي ويعرض الإشعار
});

// 2. مراقبة التفاعل مع الإشعار (تم النقر)
self.addEventListener('notificationclick', function(event) {
  try {
    // Firebase يقوم بتخزين البيانات الأصلية داخل كائن FCM_MSG
    const fcmData = event.notification.data && event.notification.data.FCM_MSG ? event.notification.data.FCM_MSG : null;
    const notificationId = fcmData && fcmData.data ? fcmData.data.notificationId : null;
    
    if (notificationId) {
      sendAnalyticsPulse(notificationId, 'click');
    }
  } catch (e) {
    console.log("خطأ في التقاط النقر: ", e);
  }
  // نترك Firebase يكمل عمله الطبيعي في فتح الرابط المرفق
});
