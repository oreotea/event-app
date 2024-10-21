const { createEvent } = require("./src/events/createEvent");
const { getAllEvents } = require("./src/events/getAllEvents");
const { getEventById } = require("./src/events/getEventById");
const { updateEvent } = require("./src/events/updateEvent");
const { deleteEvent } = require("./src/events/deleteEvent");
const { filterEvents } = require("./src/events/filterEvents");
const { updateTimestampOnWrite } = require("./src/events/updateTimestamp");

exports.createEvent = createEvent;
exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.filterEvents = filterEvents;
exports.updateTimestampOnWrite = updateTimestampOnWrite;
