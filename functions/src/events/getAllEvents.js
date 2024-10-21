const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.getAllEvents = functions.https.onRequest(async (req, res) => {
  // Check if the request method is GET
  if (req.method !== "GET") {
    console.warn("Request has invalid method. Expected GET.");
    return res.status(405).send({
      error: {
        message: "Invalid request method. Only GET is allowed.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    // Fetch all events from the 'events' collection
    const snapshot = await db.collection("events").get();
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the list of events
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).send({
      error: {
        message: "Failed to fetch events",
        status: "INTERNAL_SERVER_ERROR",
      },
    });
  }
});
