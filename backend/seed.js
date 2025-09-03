import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventx';

async function run() {
  await mongoose.connect(MONGO_URI);

  await User.deleteMany({});
  await Event.deleteMany({});

  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'Admin@123', role: 'Admin', profile: { age: 35, gender: 'Other', location: 'NYC', interests: ['tech', 'music'] } });
  const user = await User.create({ name: 'John Doe', email: 'user@example.com', password: 'User@123', role: 'User', profile: { age: 28, gender: 'Male', location: 'SF', interests: ['music', 'sports'] } });

  const now = Date.now();
  await Event.insertMany([
    { title: 'Tech Conference 2025', description: 'Latest in tech.', date: new Date(now + 7*86400000), location: 'New York', price: 99, capacity: 200, attendeesCount: 0, createdBy: admin._id },
    { title: 'Music Fest', description: 'Live bands and DJs.', date: new Date(now + 14*86400000), location: 'San Francisco', price: 59, capacity: 500, attendeesCount: 0, createdBy: admin._id },
    { title: 'Art Expo', description: 'Modern art showcase.', date: new Date(now + 21*86400000), location: 'Los Angeles', price: 30, capacity: 150, attendeesCount: 0, createdBy: admin._id }
  ]);

  console.log('Seeded users and events.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
