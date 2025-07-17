import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const users = [] // for storing user data temporarily 


export const userLogin = async (req, res)=>{
    try {
        const {username, password} = req.body;
        const user = users.find(user => user.username === username);
        
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            req.session.user = user; // Store user in session if using session management
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' }); // Generate JWT token
            res.json({ message: "Login successful", user, token }); // Include token in response
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 

export const userRegister = async (req, res)=>{
    try {
        const {username, password} = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        
        if (typeof password !== 'string') {
            return res.status(400).json({ message: "Password must be a string" });
        }
        
        // Check if user already exists
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password for security
        users.push({
            username, 
            hashedPassword
        }); // Store user data temporarily
        console.log(users);
        res.json({ message: `User ${username} registered successfully` });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
