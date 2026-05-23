const app = require('./src/app');
require('dotenv').config();

// ========================
// PORT จาก .env
// ========================
const PORT = process.env.PORT || 3000;

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log('=================================');
});