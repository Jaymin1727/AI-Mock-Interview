const admin = require('../config/firebase');
const { User } = require('../models');
const { AppError } = require('./errorHandler');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(401, 'You are not logged in! Please log in to get access.'));
  }

  try {
    let decodedToken;
    let firebaseUid;
    let email;
    let displayName;
    let photoURL;

    // Check if Firebase admin is initialized (service account provided)
    if (admin.apps && admin.apps.length > 0) {
      decodedToken = await admin.auth().verifyIdToken(token);
      firebaseUid = decodedToken.uid;
      email = decodedToken.email;
      displayName = decodedToken.name;
      photoURL = decodedToken.picture;
    } else {
      // DEV BYPASS: If no service account, we manually decode the token without verifying the signature
      console.warn("Auth Middleware: Bypassing real verification because Firebase Admin is not initialized.");
      
      try {
        // A JWT token has 3 parts: header, payload, signature (separated by dots)
        const payloadBase64 = token.split('.')[1];
        // Decode base64 (handling URL safe base64)
        const decodedPayload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const payload = JSON.parse(decodedPayload);
        
        firebaseUid = payload.user_id || "dev-mock-uid-123";
        email = payload.email || "testuser@example.com";
        displayName = payload.name || "Test User";
        photoURL = payload.picture || "";
      } catch (e) {
        console.error("Failed to decode token manually:", e);
        firebaseUid = "dev-mock-uid-123";
        email = "testuser@example.com";
        displayName = "Test User";
        photoURL = "";
      }
    }

    // Find or create user in our DB
    let [user, created] = await User.findOrCreate({
      where: { firebaseUid },
      defaults: {
        email: email || '',
        displayName: displayName || 'User',
        photoURL: photoURL || ''
      }
    });

    // Update info if it changed
    if (!created && (user.email !== email || user.displayName !== displayName)) {
      user.email = email || user.email;
      user.displayName = displayName || user.displayName;
      user.photoURL = photoURL || user.photoURL;
      await user.save();
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return next(new AppError(401, 'Invalid or expired token.'));
  }
};

module.exports = {
  protect
};
