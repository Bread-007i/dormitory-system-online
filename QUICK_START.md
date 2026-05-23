🎯 DORMITORY SYSTEM - QUICK START GUIDE

✅ WHAT HAS BEEN COMPLETED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✔️ CRUD Routes Created for:
   ✓ Apartments (GET, POST, PUT, DELETE)
   ✓ Rooms (GET, POST, PUT, DELETE)
   ✓ Tenants (GET, POST, PUT, DELETE)
   ✓ Bills (GET, POST, PUT, DELETE)
   ✓ Maintenance (GET, POST, PUT, DELETE)

✔️ Database Schema Created:
   ✓ 11 tables with proper relationships
   ✓ Automatic primary keys and timestamps
   ✓ Foreign key constraints

✔️ Automated Setup Script:
   ✓ setup-db.js for one-command database initialization

✔️ Server Configured:
   ✓ Server running on port 3000
   ✓ All routes enabled in app.js
   ✓ CORS and JSON middleware configured


🚀 TO GET STARTED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Start MySQL (XAMPP)
   → Open XAMPP Control Panel
   → Click "Start" button next to MySQL
   → Wait for it to show "Running"

STEP 2: Initialize Database
   → Open PowerShell/Terminal
   → Navigate to: cd c:\dormitory-system\backend
   → Run: node setup-db.js
   → Wait for confirmation message

STEP 3: Start the Server
   → Run: npm run dev
   → Server will start on http://localhost:3000


📋 QUICK API REFERENCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All endpoints follow this pattern:

GET    /api/{resource}        → Get all
GET    /api/{resource}/:id    → Get by ID
POST   /api/{resource}        → Create
PUT    /api/{resource}/:id    → Update
DELETE /api/{resource}/:id    → Delete

Resources: apartments, rooms, tenants, bills, maintenance


🧪 TEST THE API:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option 1: Browser
   → Go to http://localhost:3000
   → You should see: {"success":true,"message":"🏠 Dormitory API is running","status":"OK"}

Option 2: Using Postman or Thunder Client
   → Create a new request
   → GET: http://localhost:3000/api/apartments
   → This will show all apartments (empty at first)

Option 3: Using curl in PowerShell
   → curl http://localhost:3000/api/apartments


📝 EXAMPLE - Create an Apartment:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST /api/apartments

Body (JSON):
{
  "name": "Luxury Apartment Tower",
  "address": "123 Main Street",
  "city": "Bangkok",
  "postal_code": "10110",
  "total_rooms": 50,
  "description": "Modern apartment complex"
}


📂 FILES CREATED/MODIFIED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ NEW FILES:
   • backend/setup-db.js → Database initialization
   • backend/database-schema.sql → Database schema
   • backend/src/routes/rooms.js → Rooms CRUD
   • backend/src/routes/tenants.js → Tenants CRUD
   • backend/src/routes/bills.js → Bills CRUD
   • backend/src/routes/maintenance.js → Maintenance CRUD

✅ MODIFIED FILES:
   • backend/src/app.js → Uncommented all route imports


🌐 ENDPOINTS READY TO USE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/api/apartments       ✓ Full CRUD
/api/rooms          ✓ Full CRUD
/api/tenants        ✓ Full CRUD
/api/bills          ✓ Full CRUD
/api/maintenance    ✓ Full CRUD


💡 TROUBLESHOOTING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problem: "Cannot GET /api/apartments"
Solution: MySQL is not running. Start MySQL in XAMPP first.

Problem: "Connection refused"
Solution: Make sure setup-db.js has run successfully.

Problem: Server not starting
Solution: Make sure port 3000 is not in use, or change PORT in .env


📌 NEXT STEPS (OPTIONAL):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Add authentication/login system
2. Create validation middleware
3. Add error handling
4. Create dashboard endpoints
5. Build frontend UI
6. Add user roles system
7. Implement payment processing


🎉 YOUR CRUD SYSTEM IS NOW COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
