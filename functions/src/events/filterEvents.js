const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.filterEvents = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    console.warn("Request has invalid method. Expected POST.");
    return res.status(405).send({
      error: {
        message: "Invalid request method. Only POST is allowed.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  const { eventType, location, startDate, endDate } = req.body;

  if (!eventType && !location && !startDate && !endDate) {
    console.warn("Request body is missing filter criteria.");
    return res.status(400).send({
      error: {
        message: "At least one filter criterion must be provided.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    let query = db.collection("events");

    if (eventType) {
      query = query.where("eventType", "==", eventType);
    }

    if (location) {
      query = query.where("location", "==", location);
    }

    if (startDate) {
      query = query.where("date", ">=", new Date(startDate));
    }

    if (endDate) {
      query = query.where("date", "<=", new Date(endDate));
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
      console.warn("No events matched the filter criteria.");
      return res.status(200).json([]);
    }

    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });

    console.log("Filtered events retrieved successfully:", events.length);
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error filtering events:", error);
    return res.status(500).send({
      error: {
        message: "Failed to filter events.",
        status: "INTERNAL_SERVER_ERROR",
      },
    });
  }
});
