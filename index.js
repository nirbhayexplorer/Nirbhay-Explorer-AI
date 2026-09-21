const admin = require("firebase-admin");
admin.initializeApp();

// Split by concern, matching the recommended project structure
// (spec section 46): auth (admin-claim bootstrap), ai (secure Gemini
// proxy + key management), admin (announcements/maintenance writes).
const auth = require("./auth");
const ai = require("./ai");
const adminPanel = require("./admin");

exports.setAdminClaim = auth.setAdminClaim;
exports.chatWithGemini = ai.chatWithGemini;
exports.saveGeminiKey = ai.saveGeminiKey;
exports.testGeminiConfig = ai.testGeminiConfig;
exports.publishAnnouncement = adminPanel.publishAnnouncement;
exports.setMaintenanceMode = adminPanel.setMaintenanceMode;
