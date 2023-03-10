const publicVapidKey = 'BAX9ziaLXliBDsKmbn7HCYpZFcSe-I-mbw_VDkQUH2pTvyUFYUFeYNy5EIa0IYUfvVlnmpaVr9xFQYQPY3MF9uk'
const osPlace = document.querySelector('.os')
const suppPlace = document.querySelector('.support')
const userAgent = navigator.userAgent
const isIOS = /(iPad|iPhone|iPod)/i.test(userAgent);
const os = navigator.platform

// Windows
if (os.indexOf('Win') !== -1) {
  osPlace.textContent = 'Windows'
}

// macOS
if (os.indexOf('Mac') !== -1) {
  osPlace.textContent = 'macOS'
}

// Linux
if (os.indexOf('Linux') !== -1) {
  osPlace.textContent = 'Linux'
}

if (isIOS) {
  osPlace.textContent = 'iOS'
}

if ('PushManager' in window) {
  console.log('Web push is supported!');
  suppPlace.textContent = 'Поддерживается'
} else {
  suppPlace.textContent = 'Не поддерживается'
}

console.log(os)

Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    console.log('Permission granted');
  }
});


if ('serviceWorker' in navigator) {
  // Register a Service Worker
  navigator.serviceWorker.register('sw.js')
    .then(registration => {
      console.log('Service Worker registered');

      // Subscribe to push notifications
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })
      .then(subscription => {
        console.log('Subscribed to push notifications:', subscription);
        // Send the subscription object to the server
        fetch('http://localhost:3000/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'content-type': 'application/json'
          }
        });
      })
      .catch(error => {
        console.error('Failed to subscribe to push notifications:', error);
      });
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
} else {
  console.warn('Service Workers are not supported');
}



function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}