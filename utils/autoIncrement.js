const mongoose = require('mongoose');

// Define the counter schema
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Define the counter model
const Counter = mongoose.model('Counter', counterSchema);

// Function to generate auto-incremented IDs
async function getNextSequenceValue(sequenceName) {
  try {
    const sequenceDocument = await Counter.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return sequenceDocument.seq;
  } catch (error) {
    console.error(`Error generating sequence value for ${sequenceName}:`, error);
    throw error;
  }
}

module.exports = getNextSequenceValue;