import { Request, Response } from 'express';
import { Party } from '../models/Party.js';

export async function listPartiesInRange(req: Request, res: Response) {
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

export async function createParty(req: Request, res: Response) {
  try {
    // Debug logging
    console.log('Received party data:', req.body);
    console.log('partyType from request:', req.body.partyType);
    console.log('deposit from request:', req.body.deposit);
    console.log('phoneNumber from request:', req.body.phoneNumber);
    
    // MVP: Auth disabled - skip user check and use default admin user
    // TODO: Re-enable auth for production with external users
    /* COMMENTED OUT FOR MVP - KEEP FOR FUTURE USE
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    */

    // MVP: Use a default admin user ID (get the first admin user from DB)
    const User = (await import('../models/User.js')).User;
    const adminUser = await User.findOne({ email: 'admin@partyzala.com' });
    const defaultUserId = adminUser?._id || '000000000000000000000000';

    const partyData = {
      ...req.body,
      partyDate: new Date(req.body.partyDate + 'T00:00:00.000Z'),
      createdBy: defaultUserId // MVP: Use default admin user instead of req.user._id
    };

    console.log('Party data before save:', partyData);
    console.log('partyType in partyData:', partyData.partyType);

    // Remove empty optional fields
    if (partyData.parentEmail === '') {
      delete partyData.parentEmail;
    }

    const party = new Party(partyData);
    await party.save();

    console.log('Saved party:', party.toJSON());
    console.log('Saved partyType:', party.partyType);

    res.status(201).json(party);
  } catch (error: any) {
    console.error('Create party error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateParty(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // MVP: Auth disabled - skip user check and ownership validation
    // TODO: Re-enable auth for production with external users
    /* COMMENTED OUT FOR MVP - KEEP FOR FUTURE USE
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    */

    const party = await Party.findById(id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }

    // MVP: Skip ownership check - anyone can edit any party
    /* COMMENTED OUT FOR MVP - KEEP FOR FUTURE USE
    // Check if user owns the party
    if (party.createdBy.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this party' });
    }
    */

    const partyData = { ...req.body };

    // Handle partyDate if provided
    if (partyData.partyDate) {
      partyData.partyDate = new Date(partyData.partyDate + 'T00:00:00.000Z');
    }

    // Remove empty optional fields
    if (partyData.parentEmail === '') {
      delete partyData.parentEmail;
    }

    const updatedParty = await Party.findByIdAndUpdate(id, partyData, { 
      new: true, 
      runValidators: true 
    });

    res.json(updatedParty);
  } catch (error: any) {
    console.error('Update party error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteParty(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const party = await Party.findById(id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }

    // MVP: Auth disabled - skip ownership check, anyone can delete any party
    // TODO: Re-enable auth for production with external users
    /* COMMENTED OUT FOR MVP - KEEP FOR FUTURE USE
    // Check if user owns the party
    if (party.createdBy.toString() !== (req.user as any)?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this party' });
    }
    */

    await Party.findByIdAndDelete(id);
    res.json({ message: 'Party deleted successfully' });
  } catch (error) {
    console.error('Delete party error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get ALL parties without date restrictions
export async function listAllParties(req: Request, res: Response) {
  try {
    const parties = await Party.find({})
      .sort({ partyDate: 1, startTime: 1 });

    res.json(parties);
  } catch (error) {
    console.error('List all parties error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete all parties (admin only - be careful!)
export async function deleteAllParties(req: Request, res: Response) {
  try {
    const result = await Party.deleteMany({});
    
    res.json({ 
      message: 'All parties deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete all parties error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete parties in a date range
export async function deletePartiesInRange(req: Request, res: Response) {
  try {
    const { from, to } = req.query as { from: string; to: string };

    if (!from || !to) {
      return res.status(400).json({ message: 'Both from and to dates are required' });
    }

    const fromDate = new Date(from + 'T00:00:00.000Z');
    const toDate = new Date(to + 'T23:59:59.999Z');

    const result = await Party.deleteMany({
      partyDate: {
        $gte: fromDate,
        $lte: toDate
      }
    });

    res.json({ 
      message: 'Parties deleted successfully',
      deletedCount: result.deletedCount,
      from,
      to
    });
  } catch (error) {
    console.error('Delete parties in range error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
