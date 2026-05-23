import React, { useEffect, useState } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import api from '../api/client';
import RoomDetailModal from './RoomDetailModal';
import './RoomFloorPlan.css';

function RoomFloorPlan({ apartmentId = null }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [apartmentId]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = apartmentId ? `?apartment_id=${apartmentId}` : '';
      const res = await api.get(`/dashboard/floor-plan${params}`);
      setRooms(res.data?.data || []);
      setError('');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('ระบบกำลังยุ่ง กรุณารอสักครู่แล้วลองใหม่');
      } else {
        setError('ไม่สามารถดึงข้อมูลห้องได้');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'empty': return 'room-empty';
      case 'occupied': return 'room-occupied';
      case 'payment_issue': return 'room-payment-issue';
      case 'maintenance': return 'room-maintenance';
      default: return 'room-empty';
    }
  };

  // Group rooms by apartment
  const roomsByApartment = rooms.reduce((acc, room) => {
    const apt = room.apartment_name || 'ไม่ระบุ';
    if (!acc[apt]) acc[apt] = [];
    acc[apt].push(room);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" size="sm" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="text-center my-3 py-2 small">{error}</Alert>;
  }

  return (
    <div className="room-floor-plan">
      {Object.entries(roomsByApartment).map(([apartmentName, apartmentRooms]) => (
        <div key={apartmentName} className="apartment-section mb-4">
          <h4 className="apartment-title mb-3 d-flex align-items-center">
            <i className="bi bi-building me-2 text-primary"></i>
            {apartmentName}
            <span className="badge bg-secondary ms-2 fs-7 fw-normal">{apartmentRooms.length} ห้อง</span>
          </h4>
          
          <div className="room-grid">
            {apartmentRooms
              .sort((a, b) => a.room_number.localeCompare(b.room_number, undefined, { numeric: true }))
              .map((room) => (
                <button
                  key={room.id}
                  className={`room-card ${getStatusColor(room.display_status)}`}
                  onClick={() => handleRoomClick(room)}
                  title={room.status_label}
                >
                  {/* เปลี่ยนจาก Emoji เป็นจุด CSS Dot สไตล์ Dashboard พรีเมียม */}
                  <div className="room-status-dot" />
                  
                  <div className="room-number">{room.room_number}</div>
                  
                  {room.tenant_name ? (
                    <div className="room-tenant-name text-truncate" title={room.tenant_name}>
                      {room.tenant_name}
                    </div>
                  ) : (
                    <div className="room-tenant-name text-muted-light">ว่าง</div>
                  )}
                </button>
              ))}
          </div>
        </div>
      ))}

      {/* Legend - ปรับปรุงสัญลักษณ์คำอธิบายเป็นจุดวงกลมคลีนๆ */}
      <div className="room-legend mt-4 p-3 bg-light rounded-3">
        <h6 className="mb-2 text-muted text-uppercase fs-7">คำอธิบายสถานะ</h6>
        <div className="row g-2">
          <div className="col-6 col-sm-3">
            <div className="legend-item">
              <div className="legend-color-dot empty"></div>
              <span>ห้องว่าง</span>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className="legend-item">
              <div className="legend-color-dot occupied"></div>
              <span>มีผู้เช่า</span>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className="legend-item">
              <div className="legend-color-dot payment-issue"></div>
              <span>ค้างชำระบิล</span>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className="legend-item">
              <div className="legend-color-dot maintenance"></div>
              <span>แจ้งซ่อมแซม</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <RoomDetailModal
          show={showModal}
          room={selectedRoom}
          onHide={() => {
            setShowModal(false);
            setSelectedRoom(null);
          }}
          onRefresh={fetchRooms}
        />
      )}
    </div>
  );
}

export default RoomFloorPlan;