const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const updatePasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Update all users to have a default password of "123456"
        const result = await usersCollection.updateMany(
            {},
            { $set: { password: "password123" } }
        );

        console.log(`Updated ${result.modifiedCount} users to use plain text password 'password123'`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updatePasswords();
