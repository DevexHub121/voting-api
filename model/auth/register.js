const { default: mongoose } = require("mongoose");

const registerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a firstName']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a lastName']
  },
  email: {
    type: String,
    required: [true, 'Please add an email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  voterId: {
    type: String,
    required: [true, 'Please add a voterId']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  state: {
    type: String,
    required: [true, 'Please add a state']
  },
  profileFile: {
    type: String,
    required: [true, 'Please add a profileFile']
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

module.exports = mongoose.model("Register", registerSchema);