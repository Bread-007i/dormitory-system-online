# 🏠 DORMITORY MANAGEMENT SYSTEM - REST API DOCUMENTATION

## 🎯 Complete CRUD API for Dormitory Management

**Status**: ✅ Fully Operational and Tested  
**Server**: `http://localhost:3000`  
**Database**: `dormitory_system` (MySQL)

---

## 📚 Table of Contents

1. [Apartments API](#apartments-api)
2. [Rooms API](#rooms-api)
3. [Tenants API](#tenants-api)
4. [Bills API](#bills-api)
5. [Maintenance API](#maintenance-api)
6. [Error Handling](#error-handling)
7. [Response Formats](#response-formats)

---

## 🏢 Apartments API

Manage apartment/building information.

### Create Apartment
**POST** `/api/apartments`

```json
{
  "name": "Luxury Tower Apartment",
  "address": "123 Main Street",
  "city": "Bangkok",
  "postal_code": "10110",
  "total_rooms": 50,
  "description": "Modern luxury apartment complex"
}
```

**Response** (201):
```json
{
  "message": "Apartment created",
  "id": 1
}
```

---

### Get All Apartments
**GET** `/api/apartments`

**Response** (200):
```json
[
  {
    "id": 1,
    "name": "Luxury Tower Apartment",
    "address": "123 Main Street",
    "city": "Bangkok",
    "postal_code": "10110",
    "total_rooms": 50,
    "description": "Modern luxury apartment complex",
    "created_at": "2026-05-18T01:15:44.000Z",
    "updated_at": "2026-05-18T01:15:44.000Z"
  }
]
```

---

### Get Apartment by ID
**GET** `/api/apartments/:id`

**Response** (200):
```json
{
  "id": 1,
  "name": "Luxury Tower Apartment",
  "address": "123 Main Street",
  "city": "Bangkok",
  "postal_code": "10110",
  "total_rooms": 50,
  "description": "Modern luxury apartment complex",
  "created_at": "2026-05-18T01:15:44.000Z",
  "updated_at": "2026-05-18T01:15:44.000Z"
}
```

---

### Update Apartment
**PUT** `/api/apartments/:id`

```json
{
  "name": "Updated: Luxury Tower Apartment",
  "address": "456 New Street",
  "city": "Bangkok",
  "postal_code": "10110",
  "total_rooms": 60,
  "description": "Updated luxury apartment complex"
}
```

**Response** (200):
```json
{
  "message": "Apartment updated"
}
```

---

### Delete Apartment
**DELETE** `/api/apartments/:id`

**Response** (200):
```json
{
  "message": "Apartment deleted"
}
```

---

## 🏠 Rooms API

Manage individual rooms within apartments.

### Create Room
**POST** `/api/rooms`

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

**Response** (201):
```json
{
  "message": "Room created",
  "id": 1
}
```

---

### Get All Rooms
**GET** `/api/rooms`

**Response** (200):
```json
[
  {
    "id": 1,
    "apartment_id": 1,
    "room_number": "101",
    "room_type": "studio",
    "capacity": 2,
    "rent_price": 15000,
    "status": "available",
    "created_at": "2026-05-18T01:15:44.000Z",
    "updated_at": "2026-05-18T01:15:44.000Z"
  }
]
```

---

### Get Room by ID
**GET** `/api/rooms/:id`

---

### Update Room
**PUT** `/api/rooms/:id`

```json
{
  "apartment_id": 1,
  "room_number": "101",
  "room_type": "studio",
  "capacity": 2,
  "rent_price": 16000,
  "status": "occupied"
}
```

---

### Delete Room
**DELETE** `/api/rooms/:id`

---

## 👥 Tenants API

Manage tenant/resident information.

### Create Tenant
**POST** `/api/tenants`

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

**Response** (201):
```json
{
  "message": "Tenant created",
  "id": 1
}
```

---

### Get All Tenants
**GET** `/api/tenants`

**Response** (200):
```json
[
  {
    "id": 1,
    "room_id": 1,
    "name": "John Doe",
    "phone": "0812345678",
    "email": "john@example.com",
    "id_card": "1234567890123",
    "contract_start": "2026-05-18",
    "contract_end": "2027-05-18",
    "status": "active",
    "created_at": "2026-05-18T01:15:44.000Z",
    "updated_at": "2026-05-18T01:15:44.000Z"
  }
]
```

---

### Get Tenant by ID
**GET** `/api/tenants/:id`

---

### Update Tenant
**PUT** `/api/tenants/:id`

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

---

### Delete Tenant
**DELETE** `/api/tenants/:id`

---

## 💰 Bills API

Manage billing records and payments.

### Create Bill
**POST** `/api/bills`

```json
{
  "tenant_id": 1,
  "billing_date": "2026-05-18",
  "due_date": "2026-05-25",
  "amount": 15000,
  "status": "pending"
}
```

**Response** (201):
```json
{
  "message": "Bill created",
  "id": 1
}
```

---

### Get All Bills
**GET** `/api/bills`

**Response** (200):
```json
[
  {
    "id": 1,
    "tenant_id": 1,
    "billing_date": "2026-05-18",
    "due_date": "2026-05-25",
    "amount": 15000,
    "status": "pending",
    "payment_date": null,
    "created_at": "2026-05-18T01:15:44.000Z",
    "updated_at": "2026-05-18T01:15:44.000Z"
  }
]
```

---

### Get Bill by ID
**GET** `/api/bills/:id`

---

### Update Bill
**PUT** `/api/bills/:id`

```json
{
  "tenant_id": 1,
  "billing_date": "2026-05-18",
  "due_date": "2026-05-25",
  "amount": 15000,
  "status": "paid",
  "payment_date": "2026-05-20"
}
```

---

### Delete Bill
**DELETE** `/api/bills/:id`

---

## 🔧 Maintenance API

Manage maintenance requests and repairs.

### Create Maintenance Request
**POST** `/api/maintenance`

```json
{
  "apartment_id": 1,
  "description": "Fix leaking kitchen faucet",
  "status": "pending"
}
```

**Response** (201):
```json
{
  "message": "Maintenance request created",
  "id": 1
}
```

---

### Get All Maintenance Requests
**GET** `/api/maintenance`

**Response** (200):
```json
[
  {
    "id": 1,
    "apartment_id": 1,
    "description": "Fix leaking kitchen faucet",
    "status": "pending",
    "created_date": "2026-05-18T01:15:44.000Z",
    "completed_date": null,
    "created_at": "2026-05-18T01:15:44.000Z",
    "updated_at": "2026-05-18T01:15:44.000Z"
  }
]
```

---

### Get Maintenance by ID
**GET** `/api/maintenance/:id`

---

### Update Maintenance
**PUT** `/api/maintenance/:id`

```json
{
  "apartment_id": 1,
  "description": "Fix leaking kitchen faucet",
  "status": "completed"
}
```

---

### Delete Maintenance Request
**DELETE** `/api/maintenance/:id`

---

## ❌ Error Handling

### Common Error Responses

**404 Not Found**
```json
{
  "message": "Not found"
}
```

**500 Server Error**
```json
{
  "error": "Database connection error message"
}
```

---

## 📋 Response Formats

### Success Response (200, 201)
- `GET` returns JSON object or array
- `POST` returns `{"message": "...", "id": number}`
- `PUT` returns `{"message": "... updated"}`
- `DELETE` returns `{"message": "... deleted"}`

### Error Response
- Status: 404, 500
- Body: `{"message": "..." }` or `{"error": "..."}`

---

## 🚀 Quick Test Commands

```powershell
# Test main endpoint
Invoke-RestMethod -Uri "http://localhost:3000" -Method Get

# Get all apartments
Invoke-RestMethod -Uri "http://localhost:3000/api/apartments" -Method Get

# Create apartment
$body = @{
  name = "My Apartment"
  address = "123 Street"
  city = "Bangkok"
  postal_code = "10110"
  total_rooms = 50
  description = "Test"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/apartments" -Method Post -Body $body -ContentType "application/json"
```

---

## 📝 Key Features

✅ Full CRUD operations for all resources  
✅ Database cascade delete (deleting apartment deletes related rooms/tenants/bills)  
✅ Proper foreign key relationships  
✅ Timestamp tracking (created_at, updated_at)  
✅ Error handling and validation  
✅ JSON request/response format  
✅ RESTful API design  

---

## 🔐 Future Enhancements

- [ ] Authentication & Authorization
- [ ] Input validation middleware
- [ ] Advanced error handling
- [ ] Pagination for list endpoints
- [ ] Search and filter capabilities
- [ ] Reporting endpoints
- [ ] Dashboard statistics
- [ ] API rate limiting
- [ ] Logging system
- [ ] Unit tests

---

**Last Updated**: May 18, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
