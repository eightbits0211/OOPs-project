// user-service/index.js (User Service - Port 3001)
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// In-Memory User Store (Mock Database)
let users = [
    { id: 'c1', role: 'Customer', email: 'cust@livemart.com', password: 'pass', name: 'Cust A', location: { coordinates: [77.2, 28.6] } },
    { id: 'r1', role: 'Retailer', email: 'retail@livemart.com', password: 'pass', name: 'Retailer X', location: { coordinates: [72.8, 19.1] } },
    { id: 'w1', role: 'Wholesaler', email: 'who@livemart.com', password: 'pass', name: 'Wholesaler Z', location: { coordinates: [78.5, 17.4] } }
];

// Mock Token/Auth function
const generateToken = (id, role) => `mock_jwt_token_${id}_${role}`;

// --- Public Route: Registration ---
// UPDATED: Path is now '/register' to match what Gateway sends
app.post('/register', (req, res) => {
    const { role, email, password, name, location } = req.body;
    
    if (!['Customer', 'Retailer', 'Wholesaler'].includes(role)) {
        return res.status(400).json({ msg: 'Invalid user role' });
    }
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ msg: 'User already exists' });
    }
    
    const newUser = {
        id: `u${users.length + 1}`, role, email, password, name, location: location || {}
    };
    users.push(newUser);
    
    res.status(201).json({ msg: 'Registration successful!', user: { id: newUser.id, role: newUser.role } });
});

// --- Public Route: Login ---
// UPDATED: Path is now '/login'
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    res.json({ token, user: { id: user.id, role: user.role, name: user.name } });
});

// --- Internal Route ---
app.get('/retailer/locations', (req, res) => {
    const retailerLocations = users
        .filter(u => u.role === 'Retailer')
        .map(u => ({ 
            retailerId: u.id, 
            name: u.name, 
            lat: u.location.coordinates ? u.location.coordinates[1] : 0, 
            lng: u.location.coordinates ? u.location.coordinates[0] : 0 
        }));
    res.json(retailerLocations);
});

app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));