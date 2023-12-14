const { default: mongoose } = require("mongoose");

const votesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    required: [true, 'Please add an email']
  },
  vote: {
    type: String,
    required: [true, 'Please add a userName']
  },
  party: {
    type: String,
    required: [true, 'Please add a text']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model("Votes", votesSchema);