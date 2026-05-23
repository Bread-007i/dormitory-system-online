# 🏠 Dormitory System API (Node.js + MySQL)

โปรเจกต์ระบบจัดการหอพักรายเดือน (Backend API) - CRUD System Complete ✅

---

# 🚀 Tech Stack

- Node.js
- Express.js
- MySQL (phpMyAdmin / XAMPP)
- mysql2
- dotenv
- cors
- nodemon

---

# 📁 Project Structure
dormitory-system/
├── backend/
│ ├── server.js
│ ├── .env
│ ├── setup-db.js (NEW - Database initialization)
│ ├── database-schema.sql (NEW - Complete schema)
│ ├── node_modules/
│ └── src/
│ ├── app.js (UPDATED - All routes enabled)
│ ├── config/
│ │ └── db.js
│ ├── routes/
│ │ ├── apartments.js (✅ CRUD Complete)
│ │ ├── rooms.js (✅ NEW - CRUD Complete)
│ │ ├── tenants.js (✅ NEW - CRUD Complete)
│ │ ├── bills.js (✅ NEW - CRUD Complete)
│ │ ├── maintenance.js (✅ NEW - CRUD Complete)
│ │ └── dashboard.js
│ ├── controllers/ (For future expansion)
│ ├── models/ (For future expansion)
│ └── middleware/
└── frontend/

---

# ⚙️ Installation

```bash
cd backend
npm install
```

---

# 📄 Environment Variables (.env)

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=dormitory_system

DB_CONNECTION_LIMIT=10
```

---

# 🚀 Setup & Run

### 1️⃣ Start MySQL (XAMPP)
- Open XAMPP Control Panel
- Click "Start" for MySQL

### 2️⃣ Initialize Database
```bash
cd backend
node setup-db.js
```
This will:
- Create database: `dormitory_system`
- Create all tables automatically
- Show confirmation message

### 3️⃣ Run Development Server
```bash
npm run dev
```

---

# 📊 Database Tables Created

✅ apartments - Apartment information
✅ rooms - Room details in apartments
✅ tenants - Tenant/resident information
✅ bills - Billing records
✅ maintenance - Maintenance requests
✅ users - User accounts
✅ utilities - Utility services (water, electricity, etc.)
✅ contracts - Rental contracts
✅ meter_readings - Utility meter readings
✅ payments - Payment records
✅ bill_items - Line items in bills

---

# 🔌 Complete CRUD API Endpoints

## Apartments
- `GET /api/apartments` - Get all apartments
- `GET /api/apartments/:id` - Get apartment by ID
- `POST /api/apartments` - Create apartment
- `PUT /api/apartments/:id` - Update apartment
- `DELETE /api/apartments/:id` - Delete apartment

## Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

## Tenants
- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/:id` - Get tenant by ID
- `POST /api/tenants` - Create tenant
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

## Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get bill by ID
- `POST /api/bills` - Create bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill

## Maintenance
- `GET /api/maintenance` - Get all maintenance requests
- `GET /api/maintenance/:id` - Get maintenance by ID
- `POST /api/maintenance` - Create maintenance request
- `PUT /api/maintenance/:id` - Update maintenance
- `DELETE /api/maintenance/:id` - Delete maintenance

---

# 🧪 Test API

```bash
# Test main endpoint
curl http://localhost:3000

# Test apartments
curl http://localhost:3000/api/apartments
curl http://localhost:3000/api/apartments/1

# Test rooms
curl http://localhost:3000/api/rooms

# And so on for other endpoints...
```

---

# 📝 Example Request Bodies

### Create Apartment
```json
{
  "name": "Modern Apartment Complex",
  "address": "123 Main Street",
  "city": "Bangkok",
  "postal_code": "10110",
  "total_rooms": 50,
  "description": "Luxury apartment building"
}
```

### Create Room
```json
{
  "apartment_id": 1,
  "room_number": "101",
  "room_type": "studio",
  "capacity": 2,
  "rent_price": 15000,
  "status": "available"
}
```

### Create Tenant
```json
{
  "room_id": 1,
  "name": "John Doe",
  "phone": "0812345678",
  "email": "john@example.com",
  "id_card": "1234567890123",
  "contract_start": "2026-05-18",
  "contract_end": "2027-05-18",
  "status": "active"
}
```

### Create Bill
```json
{
  "tenant_id": 1,
  "billing_date": "2026-05-18",
  "due_date": "2026-05-25",
  "amount": 15000,
  "status": "pending"
}
```

### Create Maintenance
```json
{
  "apartment_id": 1,
  "description": "Fix leaking kitchen faucet",
  "status": "pending"
}
```

---

# ✨ What's Next?

- [ ] Add authentication middleware
- [ ] Create validation middleware
- [ ] Add error handling middleware
- [ ] Create dashboard endpoints
- [ ] Add user roles (admin, manager, resident)
- [ ] Create payment system integration
- [ ] Add reporting features
- [ ] Create frontend UI

---

# 📌 Status: ✅ CRUD SYSTEM COMPLETE
🛠 Modules (Planned)
Models
apartmentModel
roomModel
tenantModel
userModel
contractModel
billModel
paymentModel
meterReadingModel
utilityModel
maintenanceModel
Middleware
authMiddleware
roleMiddleware
errorMiddleware
validateRequest
notFound
📌 Current Status

✔ Backend structure created
✔ Database connected
✔ First API (apartments) ready
✔ Server running
✔ Ready for next modules

🚀 Next Steps
Build rooms API
Build tenants API
Build billing system
Connect frontend
Add authentication system
👨‍💻 Author Notes

This project is being built step-by-step from scratch with:

proper backend structure
scalable architecture
real database integration

---

# 💬 ถ้าคุณอยากต่อ
ผมช่วยคุณได้อีก เช่น:

👉 ทำ README.md แบบ GitHub เท่ ๆ  
👉 ทำ ER Diagram อธิบายระบบ  
👉 หรือพา “ต่อ rooms API” ให้เลย  

บอกได้เลย 👍
