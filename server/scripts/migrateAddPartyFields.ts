import mongoose from 'mongoose';
import { Party } from '../src/models/Party.js';
import { config } from '../src/config/env.js';

async function migratePartyFields() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update parties to set default depositCurrency where depositAmount exists but depositCurrency is missing
    const depositCurrencyResult = await Party.updateMany(
      { 
        depositAmount: { $exists: true, $ne: null },
        depositCurrency: { $exists: false }
      },
      { 
        $set: { depositCurrency: 'лв.' }
      }
    );

    console.log(`Updated depositCurrency for ${depositCurrencyResult.modifiedCount} parties`);

    // Update parties to set kidsCount from guestsCount if present and kidsCount is missing
    const kidsCountResult = await Party.updateMany(
      {
        guestsCount: { $exists: true, $ne: null },
        kidsCount: { $exists: false }
      },
      [
        {
          $set: {
            kidsCount: '$guestsCount'
          }
        }
      ]
    );

    console.log(`Updated kidsCount for ${kidsCountResult.modifiedCount} parties`);

    // Generate reservationTitle for existing parties that don't have it
    const parties = await Party.find({
      reservationTitle: { $exists: false },
      kidName: { $exists: true },
      kidAge: { $exists: true }
    });

    for (const party of parties) {
      party.reservationTitle = `Резервация на: ${party.kidName} ${party.kidAge} г.`;
      await party.save();
    }

    console.log(`Updated reservationTitle for ${parties.length} parties`);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePartyFields();
}

export { migratePartyFields };
