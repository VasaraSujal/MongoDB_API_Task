const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "Instagram_Api";

// Middleware
app.use(express.json());

let db, users;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");

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
app.get('/users', async (req, res) => {
    try {
        const allusers = await users.find().toArray();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

app.get('/users/:userId', async (req, res) => {
    try {
        const allusers = await users.find().toArray();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

// POST: Add a new student
app.post('/users', async (req, res) => {
    try {
        // console.log("Request Object:", req);
        // console.log("Request Body:", req.body);
        const newUsers = req.body;
        const result = await users.insertOne(newUsers);
        res.status(201).send(`Courses added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});

// // // PUT: Update a student completely
// app.put('/courses/:courseName', async (req, res) => {
//     try {
//         console.log("Request Object:", req.params);
//         console.log("Request Body:", req.body);
//         const courseName = (req.params.courseName);
//         const updatedCourse = req.body;
//         const result = await courses.replaceOne({ courseName }, updatedCourse);
//         res.status(200).send(`${result.modifiedCount} document(s) updated`);
//     } catch (err) {
//         res.status(500).send("Error updating Course: " + err.message);
//     }
// });

// // // PATCH: Partially update a student
app.patch('/users/:userId', async (req, res) => {
    try {
        const userId = (req.params.userId);
        const updates = req.body;
        const result = await users.updateOne({ userId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating course: " + err.message);
    }
});

// // // DELETE: Remove a student
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = (req.params.userId);
        const result = await users.deleteOne({ userId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting User: " + err.message);
    }
});
