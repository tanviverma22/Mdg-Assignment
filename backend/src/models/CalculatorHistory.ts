import mongoose from 'mongoose';

const CalculatorHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expression: { type: String, required: true },
    result: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('CalculatorHistory', CalculatorHistorySchema);