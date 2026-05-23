import React, { useEffect, useState } from 'react';
import { Modal, Spinner, Alert, Badge, Card, Tab, Tabs } from 'react-bootstrap';
import api from '../api/client';
import { formatCell } from '../utils/format';

function RoomDetailModal({ show, room, onHide, onRefresh }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show && room) {
      fetchRoomDetail();
    }
  }, [show, room]);

  const fetchRoomDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/dashboard/room/${room.id}`);
      setDetail(res.data?.data);
      setError('');
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลรายละเอียดห้องได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      empty: { color: 'secondary', label: 'ห้องว่าง' },
      occupied: { color: 'success', label: 'มีผู้เช่า' },
      payment_issue: { color: 'danger', label: 'ค้างเงินบิล' },
      maintenance: { color: 'info', label: 'ขอซ่อมแซม' }
    };
    const s = statusMap[room?.display_status] || statusMap.empty;
    return <Badge bg={s.color}>{s.label}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount || 0);
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton className="bg-light">
        <div className="w-100">
          <h5 className="mb-2">ห้อง {room?.room_number}</h5>
          <small className="text-muted">{room?.apartment_name}</small>
        </div>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : detail ? (
          <>
            {/* Room Status */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="text-muted small">สถานะ</h6>
                    <div>{getStatusBadge(room.display_status)}</div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted small">ประเภทห้อง</h6>
                    <p className="mb-0">{detail.room?.room_type}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="text-muted small">ความจุ</h6>
                    <p className="mb-0">{detail.room?.capacity} คน</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted small">ค่าเช่ารายเดือน</h6>
                    <p className="mb-0">{formatCurrency(detail.room?.rent_price)}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Tenant Information */}
            {detail.room?.tenant_name ? (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">
                    <i className="bi bi-person-circle me-2"></i>
                    ข้อมูลผู้เช่า
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <h6 className="text-muted small">ชื่อ</h6>
                      <p className="mb-0">{detail.room?.tenant_name}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted small">เบอร์โทรศัพท์</h6>
                      <p className="mb-0">
                        {detail.room?.tenant_phone ? (
                          <a href={`tel:${detail.room?.tenant_phone}`}>
                            {detail.room?.tenant_phone}
                          </a>
                        ) : (
                          '-'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <h6 className="text-muted small">อีเมล</h6>
                      <p className="mb-0">
                        {detail.room?.tenant_email ? (
                          <a href={`mailto:${detail.room?.tenant_email}`}>
                            {detail.room?.tenant_email}
                          </a>
                        ) : (
                          '-'
                        )}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted small">เลขบัตรประชาชน</h6>
                      <p className="mb-0">{detail.room?.tenant_id_card || '-'}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-muted small">วันเริ่มสัญญา</h6>
                      <p className="mb-0">{formatCell(detail.room?.contract_start, 'date')}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted small">วันสิ้นสุดสัญญา</h6>
                      <p className="mb-0">{detail.room?.contract_end ? formatCell(detail.room?.contract_end, 'date') : '-'}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Card className="mb-4 border-0 shadow-sm bg-light">
                <Card.Body>
                  <p className="text-muted mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    ห้องนี้ยังไม่มีผู้เช่า
                  </p>
                </Card.Body>
              </Card>
            )}

            {/* Payment Status Alert */}
            {detail.room?.tenant_name && detail.bills && (
              <>
                {detail.bills.some(b => b.status === 'pending') && (
                  <Alert variant="danger" className="mb-4">
                    <Alert.Heading className="mb-2">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      มีบิลรอชำระ
                    </Alert.Heading>
                    <p className="mb-1">
                      จำนวนบิลรอชำระ: <strong>{detail.bills.filter(b => b.status === 'pending').length}</strong> ใบ
                    </p>
                    <small className="text-muted">
                      {detail.bills
                        .filter(b => b.status === 'pending')
                        .reduce((sum, b) => sum + b.amount, 0) > 0 && (
                        <>
                          รวมทั้งสิ้น: <strong>{formatCurrency(detail.bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0))}</strong>
                        </>
                      )}
                    </small>
                  </Alert>
                )}
              </>
            )}

            {/* Tabs for Bills, Maintenance, Meter Readings */}
            {detail.bills?.length > 0 || detail.maintenance?.length > 0 || detail.meter_readings?.length > 0 ? (
              <Tabs defaultActiveKey="bills" className="mb-3">
                {/* Bills Tab */}
                {detail.bills?.length > 0 && (
                  <Tab eventKey="bills" title={`บิล (${detail.bills.length})`}>
                    <div className="mt-3">
                      {detail.bills.slice(0, 5).map((bill) => (
                        <Card key={bill.id} className="mb-2 border-0 shadow-sm">
                          <Card.Body className="p-3">
                            <div className="row align-items-center">
                              <div className="col-md-6">
                                <h6 className="mb-1">
                                  {formatCell(bill.billing_date, 'date')}
                                  {bill.status === 'pending' && bill.due_date < new Date().toISOString().split('T')[0] && (
                                    <Badge bg="danger" className="ms-2">ค้างชำระ</Badge>
                                  )}
                                  {bill.status === 'paid' && (
                                    <Badge bg="success" className="ms-2">ชำระแล้ว</Badge>
                                  )}
                                </h6>
                                <small className="text-muted">
                                  กำหนดชำระ: {formatCell(bill.due_date, 'date')}
                                </small>
                              </div>
                              <div className="col-md-6 text-end">
                                <h6 className="mb-0">{formatCurrency(bill.amount)}</h6>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Tab>
                )}

                {/* Maintenance Tab */}
                {detail.maintenance?.length > 0 && (
                  <Tab eventKey="maintenance" title={`ซ่อมแซม (${detail.maintenance.length})`}>
                    <div className="mt-3">
                      {detail.maintenance.map((m) => (
                        <Card key={m.id} className="mb-2 border-0 shadow-sm">
                          <Card.Body className="p-3">
                            <div className="row">
                              <div className="col-md-8">
                                <p className="mb-1 text-break">{m.description}</p>
                                <small className="text-muted">
                                  {formatCell(m.created_date, 'date')}
                                </small>
                              </div>
                              <div className="col-md-4 text-end">
                                <Badge
                                  bg={m.status === 'pending' ? 'warning' : m.status === 'completed' ? 'success' : 'secondary'}
                                >
                                  {m.status === 'pending' ? 'รอดำเนิน' : m.status === 'completed' ? 'เสร็จแล้ว' : m.status}
                                </Badge>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Tab>
                )}

                {/* Meter Readings Tab */}
                {detail.meter_readings?.length > 0 && (
                  <Tab eventKey="meters" title={`มิเตอร์ (${detail.meter_readings.length})`}>
                    <div className="mt-3">
                      {detail.meter_readings.map((m) => (
                        <Card key={m.id} className="mb-2 border-0 shadow-sm">
                          <Card.Body className="p-3">
                            <div className="row">
                              <div className="col-md-6">
                                <h6 className="mb-1">{m.utility_name}</h6>
                                <small className="text-muted">{formatCell(m.reading_date, 'date')}</small>
                              </div>
                              <div className="col-md-6 text-end">
                                <h6 className="mb-0">{m.reading_value}</h6>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Tab>
                )}
              </Tabs>
            ) : (
              detail.room?.tenant_name && (
                <Card className="border-0 shadow-sm bg-light">
                  <Card.Body>
                    <p className="text-muted mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      ไม่มีข้อมูลบิล ซ่อมแซม หรือมิเตอร์
                    </p>
                  </Card.Body>
                </Card>
              )
            )}
          </>
        ) : null}
      </Modal.Body>
    </Modal>
  );
}

export default RoomDetailModal;
