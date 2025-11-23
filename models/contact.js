const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/Project');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", contactSchema);
