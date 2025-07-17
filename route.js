import express from 'express';
import { userLogin, userRegister } from './controller.js';
import { decode } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'; // Import jwt for token handling

const router = express.Router();

router.get('/login', userLogin);
router.post('/register', userRegister);
router.get('/dashboard', (req, res) => {
    try {
        const authHeader = req.get('Authorization'); // Get token from headers
        console.log("Auth header:", authHeader);
        
        if (!authHeader) {
            return res.status(401).json({ message: "No authorization header provided" });
        }
        
        // Extract token (remove "Bearer " prefix if present)
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        console.log("Token:", token);
        
        const decodedToken = jwt.verify(token, "your_jwt_secret");  // Decode the token to get user info
        console.log("Decoded token:", decodedToken);
        
        if (decodedToken) {
            res.json({ message: `Welcome ${decodedToken.username}!`, user: decodedToken }); // Display user info
        } else {
            res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.error("Dashboard error:", error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: "Token expired" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
    // Uncomment the following lines if you want to use session management
    // if (req.session.user) {
    //     res.send(`Welcome ${req.session.user.username}!`); // Display user info
    // } else {
    //     res.redirect('/login');
    // }
});


// User CRUD operations
router.post('/', (req, res)=>{
    const {name, email} = req.body;
    res.json({
        message: "User created successfully",
        user: {
            name,
            email
        }
    });
});

router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const {name, email} = req.body;
    res.json({
        message: `User with ID ${id} updated successfully`,
        user: {
            id,
            name,
            email
        }
    });
});

router.delete('/:id', (req, res)=>{
    const {id} = req.params;
    res.json({
        message: `User with ID ${id} deleted successfully`
    });
});

export default router;