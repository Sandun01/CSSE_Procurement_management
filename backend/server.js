import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/db.js';

import userRoute from './src/routes/userRoutes.js'
import ItemRoutes from './src/routes/ItemRoutes.js'
import SiteRoutes from './src/routes/SiteRoutes.js'
import PurchaseOrderRoutes from './src/routes/PurchaseOrderRoutes.js'
import DeliveryAdviseNoteRoutes from './src/routes/DeliveryAdviseNoteRoutes.js'
import InvoiceRoutes from './src/routes/InvoiceRoutes.js'

dotenv.config();

//connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

//routes
app.use('/api/users', userRoute);
app.use('/api/items', ItemRoutes);
app.use('/api/sites', SiteRoutes);
app.use('/api/purchase_orders', PurchaseOrderRoutes);
app.use('/api/delivery_notes', DeliveryAdviseNoteRoutes);
app.use('/api/invoices', InvoiceRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Api is working');
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
