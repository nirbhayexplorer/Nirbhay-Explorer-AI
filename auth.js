const functions = require("firebase-functions");
const admin = require("firebase-admin");

const ADMIN_EMAIL = "contact.nirbheexplorer@gmail.com";

/**
 * Runs on every new user creation. If the account's email matches the
 * designated admin address, grants the `role: "admin"` custom claim.
 * This is the ONLY place admin status is decided — the frontend only
 * ever reads the resulting claim from the user's ID token
 * (spec section 2: "frontend route hiding is NOT sufficient").
 */
exports.setAdminClaim = functions.auth.user().onCreate(async (user) => {
  if (user.email === ADMIN_EMAIL) {
    await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });
  }
});
