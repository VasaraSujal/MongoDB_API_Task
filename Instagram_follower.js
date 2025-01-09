const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "Instagram_Api";

// Middleware
app.use(express.json());

let db, followers;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        followers = db.collection("followers");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

app.get('/users/:userId/followers', async (req, res) => {
    try {
        const  userId=req.params.userId
        const allposts = await followers.find({userId}).toArray();
        res.status(200).json(allposts);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});



// //POST: Add a new student
app.post('/followers', async (req, res) => {
    try {
        const newFollowers = req.body;
        const result = await followers.insertOne(newFollowers);
        res.status(201).send(`Courses added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding follower: " + err.message);
    }
});


// DELETE: Remove a student
app.delete('/followers/:followerId', async (req, res) => {
    try {
        const followerId = (req.params.followerId);
        const result = await followers.deleteOne({ followerId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting follower: " + err.message);
    }
});
