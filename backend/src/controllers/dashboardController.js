const db = require('../config/db');

// Get rooms with comprehensive status for floor plan view
exports.getRoomsFloorPlan = async (req, res) => {
  try {
    const { apartment_id } = req.query;

    let query = `
      SELECT 
        r.id,
        r.apartment_id,
        r.room_number,
        r.room_type,
        r.capacity,
        r.rent_price,
        r.status as room_status,
        a.name as apartment_name,
        t.id as tenant_id,
        t.name as tenant_name,
        t.phone as tenant_phone,
        t.email as tenant_email,
        t.id_card as tenant_id_card,
        t.status as tenant_status,
        (SELECT COUNT(*) FROM bills b 
         WHERE b.tenant_id = t.id 
         AND b.status = 'pending') as pending_bills_count,
        (SELECT COUNT(*) FROM bills b 
         WHERE b.tenant_id = t.id 
         AND b.status = 'pending' 
         AND DATE(b.due_date) < DATE(CURDATE())) as overdue_bills_count,
        (SELECT COUNT(*) FROM maintenance m 
         WHERE m.apartment_id = r.apartment_id 
         AND m.status = 'pending') as pending_maintenance_count
      FROM rooms r
      LEFT JOIN apartments a ON r.apartment_id = a.id
      LEFT JOIN tenants t ON r.id = t.room_id AND t.status = 'active'
    `;

    const params = [];
    
    if (apartment_id) {
      query += ` WHERE r.apartment_id = ?`;
      params.push(apartment_id);
    }

    query += ` ORDER BY a.name, r.room_number`;

    const [rows] = await db.query(query, params);

    // Enhance rooms with status determination
    const enrichedRooms = rows.map((room) => {
      let status = 'empty'; // default: white (empty)
      let statusLabel = 'ห้องว่าง';

      if (!room.tenant_id) {
        // No tenant - empty room
        status = 'empty';
        statusLabel = 'ห้องว่างพร้อมอยู่';
      } else if (room.overdue_bills_count > 0) {
        // Has overdue bills - red (highest priority)
        status = 'payment_issue';
        statusLabel = 'ค้างเงินบิล';
      } else if (room.pending_bills_count > 0) {
        // Has pending bills (might become overdue soon) - also red
        status = 'payment_issue';
        statusLabel = 'มีบิลรอชำระ';
      } else if (room.pending_maintenance_count > 0) {
        // Has maintenance issues - blue
        status = 'maintenance';
        statusLabel = 'ขอซ่อมแซม';
      } else if (room.tenant_status === 'active') {
        // Occupied, normal status - green
        status = 'occupied';
        statusLabel = 'มีผู้เช่า';
      }

      return {
        ...room,
        display_status: status,
        status_label: statusLabel
      };
    });

    // Group by apartment for easier frontend rendering
    const grouped = enrichedRooms.reduce((acc, room) => {
      const apt = room.apartment_name || 'ไม่ระบุ';
      if (!acc[apt]) {
        acc[apt] = [];
      }
      acc[apt].push(room);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: enrichedRooms,
      grouped: grouped,
      count: enrichedRooms.length
    });

  } catch (err) {
    console.error('Error fetching floor plan data:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching floor plan data',
      error: err.message
    });
  }
};

// Get single room detail
exports.getRoomDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [roomRows] = await db.query(`
      SELECT 
        r.id,
        r.apartment_id,
        r.room_number,
        r.room_type,
        r.capacity,
        r.rent_price,
        r.status as room_status,
        a.name as apartment_name,
        t.id as tenant_id,
        t.name as tenant_name,
        t.phone as tenant_phone,
        t.email as tenant_email,
        t.id_card as tenant_id_card,
        t.contract_start,
        t.contract_end,
        t.status as tenant_status
      FROM rooms r
      LEFT JOIN apartments a ON r.apartment_id = a.id
      LEFT JOIN tenants t ON r.id = t.room_id AND t.status = 'active'
      WHERE r.id = ?
    `, [id]);

    if (!roomRows.length) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลห้อง'
      });
    }

    const room = roomRows[0];

    // Get bills for this room's tenant if exists
    let bills = [];
    let maintenance = [];
    let meter_readings = [];

    if (room.tenant_id) {
      const [billRows] = await db.query(`
        SELECT b.*, 
        (SELECT COUNT(*) FROM bill_items bi WHERE bi.bill_id = b.id) as item_count
        FROM bills b 
        WHERE b.tenant_id = ? 
        ORDER BY b.billing_date DESC 
        LIMIT 5
      `, [room.tenant_id]);
      bills = billRows;

      const [meterRows] = await db.query(`
        SELECT mr.*, u.utility_name
        FROM meter_readings mr
        LEFT JOIN utilities u ON mr.utility_id = u.id
        WHERE mr.room_id = ?
        ORDER BY mr.reading_date DESC
        LIMIT 5
      `, [id]);
      meter_readings = meterRows;
    }

    // Get maintenance for apartment
    const [maintenanceRows] = await db.query(`
      SELECT m.*
      FROM maintenance m
      WHERE m.apartment_id = ?
      ORDER BY m.created_date DESC
      LIMIT 10
    `, [room.apartment_id]);
    maintenance = maintenanceRows;

    res.status(200).json({
      success: true,
      data: {
        room,
        bills,
        maintenance,
        meter_readings
      }
    });

  } catch (err) {
    console.error('Error fetching room detail:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching room detail',
      error: err.message
    });
  }
};
