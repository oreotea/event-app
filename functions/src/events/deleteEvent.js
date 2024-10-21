const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

exports.deleteEvent = onCall(async (request) => {
  const { eventId } = request.data;
  const db = admin.firestore();
  try {
    await db.collection("events").doc(eventId).delete();
    return { message: "Event deleted successfully" };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
