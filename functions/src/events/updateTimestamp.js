const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.updateTimestampOnWrite = functions.firestore.onDocumentWritten(
  "events/{eventId}",
  async (event) => {
    const { eventId } = event.params;
    const change = event.data;

    try {
      // If the document was deleted, no need to update the timestamp
      if (!change.after.exists) {
        console.log(`Event with ID ${eventId} was deleted`);
        return;
      }

      const afterData = change.after.data();

      // Check if the timestamp has already been updated
      if (afterData.timestampUpdated) {
        console.log("Timestamp has already been updated, skipping further updates");
        return;
      }

      // Update the `updatedAt` field and set `timestampUpdated` to true
      console.log(`Updating timestamp for event: ${eventId}`);
      await db.collection("events").doc(eventId).update({
        updatedAt: FieldValue.serverTimestamp(),
        timestampUpdated: true, // Prevent further updates by setting this flag
      });
      console.log("Timestamp updated successfully and flag set");
    } catch (error) {
      console.error("Failed to update timestamp:", error);
    }
  }
);
