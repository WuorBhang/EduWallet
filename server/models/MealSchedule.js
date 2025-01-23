import mongoose from 'mongoose';

const mealScheduleSchema = new mongoose.Schema({
  mealType: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('MealSchedule', mealScheduleSchema);