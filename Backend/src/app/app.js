import Express from 'express';
import connectDB from '../db/connect.js';
import Auth from '../routes/user.route.js';
import Product from '../routes/product.route.js';
import cors from "cors"
const app = Express();

// Allow the deployed Vercel frontend via CORS_ORIGIN env var,
// with localhost as a fallback for local development.
// With credentials: true, origin cannot be '*', so list exact origins.
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

app.use(cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(Express.json());
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.originalUrl}`);
        next(); 
    });
}
app.use('/api', Auth);
app.use('/api', Product);

connectDB();

app.get('/api', (req, res) => {
    res.send('Welcome to the Snitch API');
});

app.use((error, _req, res, _next) => {
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "Each image must be 5 MB or smaller." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({ message: "A listing can contain up to five images." });
    }
    if (error.message === "Only image files are allowed.") {
        return res.status(400).json({ message: error.message });
    }

    console.error("API request failed:", error);
    res.status(500).json({ message: "The request could not be completed." });
});

export default app;
