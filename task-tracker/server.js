// Force IPv4 DNS resolution and use Cloudflare/Google public DNS servers (bypasses faulty local ISP DNS)
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Load Environment variables in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me';

if (!MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI environment variable is not defined!');
    process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

// Connect to MongoDB Atlas
async function connectDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db('tasktracker');
        console.log('💚 Connected successfully to MongoDB Atlas database!');
        
        // Seed users and tasks if necessary
        await seedDatabase();
    } catch (error) {
        console.error('CRITICAL ERROR: Failed to connect to MongoDB Atlas:', error);
        process.exit(1);
    }
}

// Default initial tasks matching user's request (scoped by username)
const defaultTasks = [
    // Raja's tasks
    {
        username: "raja",
        title: "Going to ATM",
        date: "2026-06-15", // Today
        time: "10:00",
        category: "Finance",
        completed: false,
        source: "text",
        createdAt: new Date().toISOString()
    },
    {
        username: "raja",
        title: "WiFi bill payment",
        date: "2026-06-18",
        time: "",
        category: "Finance",
        completed: false,
        source: "text",
        createdAt: new Date().toISOString()
    },
    {
        username: "raja",
        title: "Send reports to vice president",
        date: "2026-06-16", // Tomorrow
        time: "09:00",
        category: "Work",
        completed: false,
        source: "voice",
        createdAt: new Date().toISOString()
    },
    {
        username: "raja",
        title: "Iron the clothes",
        date: "2026-06-16", // Tomorrow
        time: "08:00",
        category: "Personal",
        completed: false,
        source: "text",
        createdAt: new Date().toISOString()
    },
    {
        username: "raja",
        title: "Send 1000 rupees to friend (return the debt)",
        date: "2026-06-25",
        time: "12:00",
        category: "Finance",
        completed: false,
        source: "voice",
        createdAt: new Date().toISOString()
    },
    
    // Vani's tasks
    {
        username: "vani",
        title: "Buy groceries",
        date: "2026-06-16", // Tomorrow
        time: "17:30",
        category: "Shopping",
        completed: false,
        source: "text",
        createdAt: new Date().toISOString()
    },
    {
        username: "vani",
        title: "Mobile security scan and clean up",
        date: "2026-06-15", // Today
        time: "21:00",
        category: "Health",
        completed: false,
        source: "voice",
        createdAt: new Date().toISOString()
    },
    {
        username: "vani",
        title: "Book movie tickets for the weekend",
        date: "2026-06-20", // Coming Saturday
        time: "",
        category: "Personal",
        completed: false,
        source: "text",
        createdAt: new Date().toISOString()
    }
];

// Seed default users and tasks securely
async function seedDatabase() {
    try {
        const usersCollection = db.collection('users');
        const tasksCollection = db.collection('tasks');

        // 1. Seed users
        const rajaUser = await usersCollection.findOne({ username: 'raja' });
        if (!rajaUser) {
            const hashedPassword = bcrypt.hashSync('raja', 10);
            await usersCollection.insertOne({
                username: 'raja',
                password: hashedPassword,
                name: 'Raja',
                createdAt: new Date().toISOString()
            });
            console.log('👤 Seeded user: Raja');
        }

        const vaniUser = await usersCollection.findOne({ username: 'vani' });
        if (!vaniUser) {
            const hashedPassword = bcrypt.hashSync('vani', 10);
            await usersCollection.insertOne({
                username: 'vani',
                password: hashedPassword,
                name: 'Vani',
                createdAt: new Date().toISOString()
            });
            console.log('👤 Seeded user: Vani');
        }

        // 2. Seed default tasks if the tasks collection is empty
        const count = await tasksCollection.countDocuments();
        if (count === 0) {
            await tasksCollection.insertMany(defaultTasks);
            console.log(`📝 Seeded ${defaultTasks.length} initial tasks!`);
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Helper to get local network IP address
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// --- Middleware ---

// JWT Token Authentication Middleware
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. Missing auth token.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.currentUser = decoded.username;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Access denied. Invalid or expired token.' });
    }
}

// --- API Endpoints ---

// Login Endpoint (Returns signed JWT)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const lowerUser = username.toLowerCase().trim();
    
    try {
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username: lowerUser });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Sign token (valid for 30 days)
        const token = jwt.sign({ username: lowerUser }, JWT_SECRET, { expiresIn: '30d' });

        res.json({ 
            token: token, 
            name: user.name 
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
});

// Get all tasks (Scoped to current authenticated user)
app.get('/api/tasks', authenticate, async (req, res) => {
    try {
        const tasksCollection = db.collection('tasks');
        const userTasks = await tasksCollection.find({ username: req.currentUser }).toArray();
        
        // Map _id to id for client compatibility
        const mappedTasks = userTasks.map(t => ({
            id: t._id.toString(),
            title: t.title,
            date: t.date,
            time: t.time,
            category: t.category,
            completed: t.completed,
            source: t.source,
            createdAt: t.createdAt
        }));

        res.json(mappedTasks);
    } catch (err) {
        console.error('Fetch tasks error:', err);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

// Create a new task (Scoped to current authenticated user)
app.post('/api/tasks', authenticate, async (req, res) => {
    const { title, date, time, category, completed, source } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
    }

    try {
        const tasksCollection = db.collection('tasks');
        const newTask = {
            username: req.currentUser,
            title,
            date: date || new Date().toISOString().split('T')[0],
            time: time || '',
            category: category || 'Inbox',
            completed: !!completed,
            source: source || 'text',
            createdAt: new Date().toISOString()
        };

        const result = await tasksCollection.insertOne(newTask);
        res.status(201).json({
            id: result.insertedId.toString(),
            ...newTask
        });
    } catch (err) {
        console.error('Create task error:', err);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update a task (Scoped ownership verify)
app.put('/api/tasks/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, date, time, category, completed } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid task ID format' });
    }

    try {
        const tasksCollection = db.collection('tasks');
        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Verify task ownership
        if (task.username !== req.currentUser) {
            return res.status(403).json({ error: 'Forbidden. You do not own this task.' });
        }

        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (date !== undefined) updateFields.date = date;
        if (time !== undefined) updateFields.time = time;
        if (category !== undefined) updateFields.category = category;
        if (completed !== undefined) updateFields.completed = completed;
        updateFields.updatedAt = new Date().toISOString();

        await tasksCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        const updatedTask = {
            id: id,
            ...task,
            ...updateFields
        };
        delete updatedTask._id;

        res.json(updatedTask);
    } catch (err) {
        console.error('Update task error:', err);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task (Scoped ownership verify)
app.delete('/api/tasks/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid task ID format' });
    }

    try {
        const tasksCollection = db.collection('tasks');
        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Verify task ownership
        if (task.username !== req.currentUser) {
            return res.status(403).json({ error: 'Forbidden. You do not own this task.' });
        }

        await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true, message: `Task ${id} deleted` });
    } catch (err) {
        console.error('Delete task error:', err);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Fallback to static client SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect database then startup server
connectDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        const localIp = getLocalIpAddress();
        console.log('\n==================================================');
        console.log(`🚀 Secure Cloud Task Tracker Server is running!`);
        console.log(`💻 Local Access:    http://localhost:${PORT}`);
        console.log(`📱 Mobile Access:   http://${localIp}:${PORT}`);
        console.log(`==================================================\n`);
    });
});
