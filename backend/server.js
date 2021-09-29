import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/db.js';

import userRoute from './src/routes/userRoutes.js';
import SiteRoutes from './src/routes/SiteRoutes.js';
import PurchaseOrderRoutes from './src/routes/PurchaseOrderRoutes.js'

dotenv.config();

//connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

//routes
app.use('/api/users', userRoute);
app.use('/api/sites', SiteRoutes);
app.use('/api/purchase_orders', PurchaseOrderRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Api is working');
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
