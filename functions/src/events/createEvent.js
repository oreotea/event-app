const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore"); // Import FieldValue directly

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.createEvent = functions.https.onRequest(async (req, res) => {
  console.log("Received request with method:", req.method);

  if (req.method !== "POST") {
    console.error("Method not allowed:", req.method);
    return res.status(405).send("Method Not Allowed");
  }

  const data = req.body;
  console.log("Request body data:", data);

  if (!data.title || !data.description || !data.date || !data.location || !data.organizer || !data.eventType) {
    console.error("Missing required fields in request:", data);
    return res.status(400).send("Missing required fields");
  }

  try {
    const newEvent = {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      location: data.location,
      organizer: data.organizer,
      eventType: data.eventType,
      updatedAt: FieldValue.serverTimestamp(), 
    };
    console.log("New event data to be saved:", newEvent);

    const eventRef = await db.collection("events").add(newEvent);
    console.log("Event created with ID:", eventRef.id);

    return res.status(200).send({ message: "Event created successfully" });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
});
