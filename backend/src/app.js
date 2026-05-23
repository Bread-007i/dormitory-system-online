const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

const notFound = require('./middleware/notFound');
const errorMiddleware = require('./middleware/errorMiddleware');
const paymentRequestController = require('./controllers/paymentRequestController');
const asyncHandler = require('./utils/asyncHandler');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 1000, // 1000 requests per hour (more lenient)
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later'
});
app.use(limiter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dormitory API is running',
    status: 'OK',
    docs: {
      auth: '/api/auth',
      resources: [
        '/api/apartments',
        '/api/rooms',
        '/api/tenants',
        '/api/bills',
        '/api/maintenance',
        '/api/utilities',
        '/api/contracts',
        '/api/meter-readings',
        '/api/payments',
        '/api/bill-items',
        '/api/users'
      ]
    }
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/portal', require('./routes/portal'));
app.use('/api/portal/payments', require('./routes/portalPayments'));
app.use('/api/payment-requests', require('./routes/paymentRequests'));

if (process.env.NODE_ENV !== 'production') {
  app.post(
    '/api/dev/simulate-payment',
    asyncHandler(paymentRequestController.simulateBankWebhook)
  );
}

app.use('/api/apartments', require('./routes/apartments'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/utilities', require('./routes/utilities'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/meter-readings', require('./routes/meterReadings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/bill-items', require('./routes/billItems'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
