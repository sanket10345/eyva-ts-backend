import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import  memberRoutes from './routes/members'; // Adjust the path to where your members routes are located


const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: '*', // Allow only this origin
  methods: 'GET,POST,PUT,DELETE',  // Allow only these methods
  allowedHeaders: 'Content-Type,Authorization', // Allow only these headers
};

// Use cors middleware with options
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api',memberRoutes); // Use the router as middleware under the `/api` path

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});