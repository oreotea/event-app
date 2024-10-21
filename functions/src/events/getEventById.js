const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.getEventById = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET") {
    console.warn("Request has invalid method. Expected GET.");
    return res.status(405).send({
      error: {
        message: "Invalid request method. Only GET is allowed.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  // Extract eventId from the request path
  const eventId = req.query.eventId || req.params.eventId;
  if (!eventId) {
    console.warn("Event ID is missing in the request.");
    return res.status(400).send({
      error: {
        message: "Event ID is required.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      console.warn(`Event with ID ${eventId} not found.`);
      return res.status(404).send({
        error: {
          message: "Event not found.",
          status: "NOT_FOUND",
        },
      });
    }

    console.log("Event retrieved successfully:", eventDoc.data());
    return res.status(200).json({ id: eventDoc.id, ...eventDoc.data() });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).send({
      error: {
        message: "Failed to fetch event.",
        status: "INTERNAL_SERVER_ERROR",
      },
    });
  }
});
