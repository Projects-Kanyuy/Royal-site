import mongoose from 'mongoose';
import { Payment } from './models/Payment.js';
import { ManualVote } from './models/ManualVote.js';
import Artist from './models/Artist.js';

const backfillData = async () => {
  // Backfill CamPay votes (distribute over artist's creation time)
  const artists = await Artist.find({ votes: { $gt: 0 } });
  
  for (const artist of artists) {
    for (let i = 0; i < artist.votes; i++) {
      const payment = new Payment({
        transId: `backfill-campay-${artist._id}-${i}`,
        artist: artist._id,
        amount: 100, // Assuming 100 XAF per vote
        currency: 'XAF',
        status: 'SUCCESSFUL',
        paymentMethod: 'campay',
        votesAdded: 1,
        createdAt: artist.createdAt // Use artist creation date
      });
      await payment.save();
    }
  }

  // Backfill Financial votes (distribute over time)
  const financialArtists = await Artist.find({ financialVotes: { $gt: 0 } });
  
  for (const artist of financialArtists) {
    for (let i = 0; i < artist.financialVotes; i++) {
      const manualVote = new ManualVote({
        artist: artist._id,
        adminUser: null, // Or set a default admin ID
        amount: 100, // Assuming 100 XAF per vote
        votesAdded: 1,
        paymentMethod: 'cash',
        notes: 'Historical backfill',
        createdAt: artist.createdAt // Use artist creation date
      });
      await manualVote.save();
    }
  }
  
  console.log('Backfill completed!');
};