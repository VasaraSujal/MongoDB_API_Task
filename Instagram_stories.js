const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "Instagram_Api";

// Middleware
app.use(express.json());

let db, stories;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        stories = db.collection("stories");

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

// GET: List all students
app.get('/stories', async (req, res) => {
    try {
        const allstories = await stories.find().toArray();
        res.status(200).json(allstories);
    } catch (err) {
        res.status(500).send("Error fetching stories: " + err.message);
    }
});

// //POST: Add a new student
app.post('/stories', async (req, res) => {
    try {
        const newStories = req.body;
        const result = await stories.insertOne(newStories);
        res.status(201).send(`Courses added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding story: " + err.message);
    }
});


// DELETE: Remove a student
app.delete('/stories/:storyId', async (req, res) => {
    try {
        const storyId = (req.params.storyId);
        const result = await stories.deleteOne({ storyId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting Story: " + err.message);
    }
});
