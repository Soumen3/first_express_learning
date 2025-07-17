import express from 'express';
import {  userLogin, userRegister } from './controller.js';
import router from './route.js';
import multer from 'multer';
import { storage } from './config/multer.js'; // Import the multer configuration
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Person } from './models/Person.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';


const app = express();


const upload = multer({
    storage: storage, // Use the storage configuration from multer.js 
    limits: { 
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    } 
})



const PORT = process.env.PORT || 3000;
app.use(cookieParser()); // Middleware to parse cookies
app.use(session({
    secret
    : 'your-secret-key', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
})); // Middleware to handle sessions
await connectDB(); // Connect to MongoDB




// Set EJS as the view engine 
app.set("view engine", 'ejs')





// Middleware should be placed before routes
app.use(express.json()); // Middleware to parse JSON bodies

// Middlewares 
app.use((req, res, next)=>{
    console.log("New Message received at "+ Date.now())
    
    res.on("finish", ()=>{
        // console.log("page loaded")
    })
    
    next()
})
// This middleware will be applied on every routes



// Static files middleware
app.use('/public',express.static('public')); // Middleware to serve static files from 'public' directory
app.use('/images',express.static('images')); // Middleware to serve static files from 'images' directory



// Static Routs 
app.get('/', (req, res) => {
    // res.send('Hello, Programmer!');
    const username = "Soumen"
    // res.render('index', {username})
    res.cookie('username', username, { maxAge: 900000, httpOnly: true }); // Set a cookie
    res.send("Hello, Programmer!"); // Sending a simple response for now
});
app.get("/fetch", (req, res)=>{
    console.log(req.cookies); // Access cookies
    res.send("Cookies fetched successfully");
})

app.get('/remove-cookie',(req, res)=>{
    res.clearCookie('username'); // Clear the cookie
    res.send("Cookie removed successfully");
})

// sessions 
app.get('/visit', (req, res)=>{
    if (req.session.page_views){
        req.session.page_views++;
        res.send(`You visited this page ${req.session.page_views} times`);
    }
    else {
        req.session.page_views = 1;
        res.send("Welcome to the page for the first time!");
    }
})

app.get('/remove-visit',(req, res)=>{
    req.session.destroy((err)=>{
        if (err) {
            return res.status(500).send("Error removing session");
        }
        res.send("Session removed successfully");
    });
})


app.use('/user', router);



app.get('/things/:name/:id', (req, res)=>{
    const {name, id} = req.params;
    res.json({
        message: `You requested thing with name ${name} and id ${id}`
    });
})

// URL specific middleware
app.use('/welcome', (req, res, next)=>{
    // console.log("/welcome url is hit")
    next()
})

app.get('/welcome', (req, res)=>{
    res.send("/welcome url is hit.")
})



app.get('/error', (req, res)=>{
    throw new Error("This is req, res test error")
})
// Handling error 
app.use((err, req, res, next)=>{
    // console.error(err.message)
    res.status(500).send("Internal server error.")
})




// Form data handling 

// url-encoded form data 
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
// normal form data 
// app.use(upload.array()); // Middleware to handle multipart/form-data
app.use(upload.single('image')); // Middleware to handle single file uploads

app.post('/form', (req, res)=>{
    console.log(req.body);
    console.log(req.file); // Log the uploaded file information
    res.send("Form data received successfully");
})




// create data in database
app.post('/person', async (req, res)=>{
    try{
        const {name, email, age} = req.body;
        const newPerson = new Person({
            name,
            email,
            age
        });
        await newPerson.save(); // Save the person to the database
        console.log(newPerson);
        res.json({
            message: "Person created successfully",
            person: {
                name,
                email,
                age
            }
        });
    }catch (error) {
        console.error("Error creating person:", error);
        res.status(500).json({ message: "Error creating person" });
    }
});


// updata data in database
app.put('/person', async (req, res)=>{
    const {id}= req.body;
    const personData = await Person.findByIdAndUpdate(
        id,
        {age:2}
    );
    if (personData.length === 0) {
        return res.status(404).json({ message: "Person not found" });
    }
    console.log(personData);
    res.json({
        message: `Person updated successfully`,
    });
});

// Delete data from database
app.delete('/person/:id', async (req, res)=>{
    const {id} = req.params;
    const personData = await Person.findByIdAndDelete(id);
    if (!personData) {
        return res.status(404).json({ message: "Person not found" });
    }
    console.log(personData);
    res.json({
        message: `Person with ID ${id} deleted successfully`
    });
});


// Get all products
app.get('/api/products',(req, res) => {
    const products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        { id: 3, name: 'Product 3', price: 300 }
    ];
    res.status(200).json(products); // Return products as JSON response
})

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        { id: 3, name: 'Product 3', price: 300 }
    ];
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product); // Return the product as JSON response
});

// Create a new product
app.post('/api/products', (req, res) => {
    const { name, price } = req.body;
    const newProduct = {
        id: Date.now(), // Use current timestamp as a unique ID
        name,
        price
    };
    // Here you would typically save the new product to a database
    res.status(201).json({
        message: "Product created successfully",
        product: newProduct
    });
});







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
