const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.updateEvent = functions.https.onRequest(async (req, res) => {
  // Ensure the request is using the PUT method
  if (req.method !== "PUT") {
    console.warn("Request has invalid method. Expected PUT.");
    return res.status(405).send({
      error: {
        message: "Invalid request method. Only PUT is allowed.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  // Extract eventId and fields to be updated from the request body
  const { eventId, title, description, date, location, organizer, eventType } = req.body;

  // Validate the presence of eventId
  if (!eventId) {
    console.warn("Request body is missing 'eventId'.");
    return res.status(400).send({
      error: {
        message: "Event ID is required.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const eventRef = db.collection("events").doc(eventId);
    const updatedData = {};

    // Add fields to be updated if they are provided in the request
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (date !== undefined) updatedData.date = new Date(date);
    if (location !== undefined) updatedData.location = location;
    if (organizer !== undefined) updatedData.organizer = organizer;
    if (eventType !== undefined) updatedData.eventType = eventType;

    // Always update the 'updatedAt' field to the current server timestamp
    updatedData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Update the event document in Firestore
    await eventRef.update(updatedData);
    console.log("Event updated successfully:", eventId);
    return res.status(200).send({ message: "Event updated successfully." });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).send({
      error: {
        message: "Failed to update event.",
        status: "INTERNAL_SERVER_ERROR",
      },
    });
  }
});
