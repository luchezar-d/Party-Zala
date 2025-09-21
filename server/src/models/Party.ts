import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IParty extends Document {
  partyDate: Date;
  kidName: string;
  kidAge: number;
  locationName: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  parentName?: string;
  parentEmail?: string;
  guestsCount?: number;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const partySchema = new Schema<IParty>({
  partyDate: {
    type: Date,
    required: true,
    index: true
  },
  kidName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  kidAge: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  locationName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  startTime: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format']
  },
  endTime: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format']
  },
  address: {
    type: String,
    trim: true,
    maxlength: 300
  },
  parentName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  parentEmail: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  guestsCount: {
    type: Number,
    min: 0,
    max: 500
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for efficient date range queries
partySchema.index({ partyDate: 1 });
partySchema.index({ createdBy: 1, partyDate: 1 });

export const Party = mongoose.model<IParty>('Party', partySchema);
