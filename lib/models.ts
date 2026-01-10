import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['ongoing', 'upcoming'], required: true },
  schedule: { type: String, required: true },
  time: { type: String, required: true },
  university: { type: String, required: true },
  college: { type: String },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectCode: { type: String },
  university: { type: String, required: true },
  college: { type: String },
  branch: { type: String },
  semester: { type: String },
  type: { type: String, enum: ['notes', 'pyq', 'handwritten'], required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);
export const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
