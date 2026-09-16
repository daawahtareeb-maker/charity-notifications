importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA7GkE88wuFBkKdnhd1-zHzLewuOulRxZA",
  projectId: "charity-notifications-6cd5e",
  messagingSenderId: "980119733083",
  appId: "1:980119733083:web:af2da1bc82c5c35a5ed07e"
});

const messaging = firebase.messaging();

// ==============================================================
// نظام الإحصائيات (الاستلام والنقر) مع تجاوز قيود CORS
// ==============================================================

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7emLwKClLEgeTBkYLzjRwaZyV3PbrTAiVRoZuaToRvfV-qdjKzWTXqd69B_BDIQz-/exec";

// دالة إرسال النبضات إلى جداول بيانات جوجل
function sendAnalyticsPulse(notificationId, type) {
  if (!notificationId) return;
  
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // تم الإضافة: لتجاوز حظر CORS وتوجيهات جوجل في الخلفية
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: "analytics",
      notificationId: notificationId,
      type: type
    })
  }).catch(err => console.log("Analytics Error: ", err));
}

// 1. مراقبة وصول الإشعار في الخلفية (تم الاستلام)
self.addEventListener('push', function(event) {
  if (!event.data) return;
  
  try {
    const payload = event.data.json();
    // استخراج معرف الإشعار من حزمة البيانات
    const notificationId = (payload.data && payload.data.notificationId) || 
                           (payload.notification && payload.notification.data && payload.notification.data.notificationId);
    
    if (notificationId) {
      sendAnalyticsPulse(notificationId, 'receive');
    }
  } catch (e) {
    console.log("خطأ في التقاط الاستلام: ", e);
  }
});

// 2. مراقبة التفاعل مع الإشعار (تم النقر)
self.addEventListener('notificationclick', function(event) {
  try {
    let notificationId = null;
    
    if (event.notification && event.notification.data) {
      const data = event.notification.data;
      if (data.notificationId) {
        notificationId = data.notificationId;
      } else if (data.FCM_MSG && data.FCM_MSG.data && data.FCM_MSG.data.notificationId) {
        notificationId = data.FCM_MSG.data.notificationId;
      }
    }
    
    if (notificationId) {
      sendAnalyticsPulse(notificationId, 'click');
    }
  } catch (e) {
    console.log("خطأ في التقاط النقر: ", e);
  }
});
