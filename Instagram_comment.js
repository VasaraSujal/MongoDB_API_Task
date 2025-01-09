const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "Instagram_Api";

// Middleware
app.use(express.json());

let db, comments;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        comments = db.collection("comments");

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
app.get('/comments', async (req, res) => {
    try {
        const allcomments = await comments.find().toArray();
        res.status(200).json(allcomments);
    } catch (err) {
        res.status(500).send("Error fetching comments: " + err.message);
    }
});

// //POST: Add a new student
app.post('/comments', async (req, res) => {
    try {
        const newComments = req.body;
        const result = await comments.insertOne(newComments);
        res.status(201).send(`Courses added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding comment: " + err.message);
    }
});


//PATCH: Partially update a student
app.patch('/comments/:commentId/likes', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const updates = req.body;
        const result = await comments.updateOne({ commentId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating caption: " + err.message);
    }
});

// // // // // DELETE: Remove a student
app.delete('/comments/:commentId', async (req, res) => {
    try {
        const commentId = (req.params.commentId);
        const result = await comments.deleteOne({ commentId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting Comment: " + err.message);
    }
});
