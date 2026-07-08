const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Path to your Firebase service account key
const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully.');
  } else {
    console.warn('\n⚠️ WARNING: firebase-service-account.json not found in Backend_AI_Interview root.');
    console.warn('Auth verification will be bypassed for development.\n');
    // We do not initialize if missing, will handle in middleware
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

module.exports = admin;
