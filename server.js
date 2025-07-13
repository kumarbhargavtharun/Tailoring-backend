require('dotenv').config();
const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
