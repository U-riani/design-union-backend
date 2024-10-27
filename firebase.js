const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with the service account
const serviceAccount = {
  type: "service_account",
  project_id: "uriani",
  private_key_id: "9fa510a751632a16660a6401154c1a04ce7b6ae6",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFGHmRI8YrPgwj\n+brZhHdV4c92mokKzR/2l+IHG4neREviWhAPK9HejRXjoM/0Qm4xSaoZ2NEMvuRl\nD+yDQdDv/48EPEvOPwg1nJjJ97uvgjsqEOjxh7bRkBQlLT10cDzUwpqQ+h9Mae/Z\ncms6AzvJbuwSysox7hKBUxJhq5Yve2Cu05KaQgLwyoezvSnVNpHE+ysvTkGCZ/HF\nHUgE0ZwoKScGT1mBX1PyUswmKP3dZIj56dAwyiicQsc0NtFEhZYvontvr0fEVY+H\n7Z8BiCRrTOL0IC/P/lKmwhUCSPdQg7wnABCUysl+MzJZRrQm0iR+uatqYoUZ492q\n2boMDFu/AgMBAAECggEAEzTLBo64N+yISFUvP7+91UZM7jTUQpOHQti9c43bxdIH\n8bBvEjC7THbueXZpQqyFNROwRMExFeSK4yJFx5X5TfnXA5r7PseQ/ZBwqcsUpLS0\nc+lJRIgXaPJ4/r/FgPw9oUoEFTlFJYVz6aT8Yp8qtfqzfIf7DhncqceLlK2g0/2D\nlP7E1psEVOxIGCoUs9u1ZnM2JeN6qFzhs6mQpynB7co4s5gyqdqaHJk8vDM+opgf\n/OTryjj2BFfa+TR7jW25Kz4Z6/kViiwiofAG+iCD7jHkkSLR6KWfAaCP8RkrewJR\nVFvX48mO2QrE5v2Dv5VwN432cH+cQZ89Ia3QzOlCcQKBgQD1YT5J7FisOXGsaLK3\nKgvPsTAvVfwvt0cOxTsR6jblxpDZIJhXXyBkHbJfE0x3M6yLxgJx6qtcH4W8ZZ/p\neVfwdSIA7fEHPpa4Do1dDV76SQiavM2IJS3ou085lG1o4YyzcBFTRTfd2bXhKFpK\n+nL7fex4KkWxZ/4R48TNtP+diQKBgQDNoECW9wG2mnX8Gvide4P3BicTlsRHOHXa\nLBnIuKHNy8aR8X2fRGo0NWSGWaPaAePRwzakvRdLDVGnT+aUIA4hJ0iKB8MwUUzA\npi25+irRtAnVXqUK3EItXf2SEp5LteJuCYdZSQx5ghWvS4YK7ZqCGbABN+7iozTa\nzLj5bqhlBwKBgQCn16hfsEbHJ1PV9peoKh6CJlUrS8mAagE03TwWePqsGTKjEmSh\n/vONB7MmzXCUaMgxo3OwsDAeh4FW6LyFWvcIB1cHA7rGlc1KgMm5SJga4zH7hgGg\niq3ob5c1b42XHBC9/H4dU09vdKewJ4X7m2xjEjNZzrB1NQjY+892VcQy4QKBgQCi\nAsVhLLTY3tJfFBEWY58SHnLjaEK1qrKQd3bJQ0+ZChkmHBNSTWEwSXEuuanzttF9\nEEYZfjLAG3peTQHra2Y2kPECcCNGCohisYwNoCHkn+mvh6aZ6/joLcoAMVMva9s/\nv5o4qul9QxU6zFKMgbDfGMYn7530S4r1aZ/ER3++OQKBgAP0FUvZj8a/sPmBXFX6\nFAUAnputwcaHFF0f0SCHQd+nRakWKL32tgGBgYghxMBBcXubYqEclLK8vSg64J34\nRa6UWwshLAeEk90EUo6hQsWNwB0YVlUduWQJUgFr2k+tX5vDK/XqEjpvKub8vLC2\nkxApvB/nrK9jv9SiTf1MpcBG\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-kng3n@uriani.iam.gserviceaccount.com",
  client_id: "108982710777712636313",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kng3n%40uriani.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'uriani.appspot.com', // Replace with your bucket name
});

const bucket = admin.storage().bucket();

module.exports = bucket;
