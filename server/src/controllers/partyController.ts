import { Response } from 'express';
import { Party } from '../models/Party.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function listPartiesInRange(req: AuthenticatedRequest, res: Response) {
  try {
    const { from, to } = req.query as { from: string; to: string };

    // Parse dates and set to start/end of day
    const fromDate = new Date(from + 'T00:00:00.000Z');
    const toDate = new Date(to + 'T23:59:59.999Z');

    // Validate date range (max 3 months)
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 90) {
      return res.status(400).json({ message: 'Date range cannot exceed 3 months' });
    }

    const parties = await Party.find({
      partyDate: {
        $gte: fromDate,
        $lte: toDate
      }
    }).sort({ partyDate: 1, startTime: 1 });

    res.json(parties);
  } catch (error) {
    console.error('List parties error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createParty(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const partyData = {
      ...req.body,
      partyDate: new Date(req.body.partyDate + 'T00:00:00.000Z'),
      createdBy: req.user._id
    };

    // Remove empty optional fields
    if (partyData.parentEmail === '') {
      delete partyData.parentEmail;
    }

    const party = new Party(partyData);
    await party.save();

    res.status(201).json(party);
  } catch (error) {
    console.error('Create party error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteParty(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    const party = await Party.findById(id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }

    // Check if user owns the party
    if (party.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this party' });
    }

    await Party.findByIdAndDelete(id);
    res.json({ message: 'Party deleted successfully' });
  } catch (error) {
    console.error('Delete party error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
