import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Modal, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import { formatCell } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

export default function MyBillsPage() {
  const [bills, setBills] = useState([]);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/portal/bills')
      .then((res) => setBills(res.data.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (id) => {
    const res = await api.get(`/portal/bills/${id}`);
    setDetail(res.data.data);
  };

  const statusBadge = (status) =>
    status === 'paid' ? (
      <Badge bg="success">ชำระแล้ว</Badge>
    ) : (
      <Badge bg="warning" text="dark">
        รอชำระ
      </Badge>
    );

  return (
    <>
      <PageHeader
        title="ใบแจ้งหนี้ของฉัน"
        subtitle="ดูยอดค้างชำระและประวัติบิล"
        icon="bi-receipt"
      />
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>วันที่ออกบิล</th>
                  <th>ครบกำหนด</th>
                  <th>ยอด</th>
                  <th>สถานะ</th>
                  <th>ชำระ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      ไม่มีใบแจ้งหนี้
                    </td>
                  </tr>
                ) : (
                  bills.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{formatCell(b.billing_date, 'date')}</td>
                      <td>{formatCell(b.due_date, 'date')}</td>
                      <td>{formatCell(b.amount, 'currency')}</td>
                      <td>{statusBadge(b.status)}</td>
                      <td>
                        {b.status === 'pending' ? (
                          <Button
                            as={Link}
                            to={`/pay/${b.id}`}
                            size="sm"
                            variant="success"
                          >
                            <i className="bi bi-qr-code me-1" />
                            QR
                          </Button>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openDetail(b.id)}
                        >
                          รายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <Modal show={Boolean(detail)} onHide={() => setDetail(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>ใบแจ้งหนี้ #{detail?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail && (
            <>
              <p>
                ยอดรวม: <strong>{formatCell(detail.amount, 'currency')}</strong>{' '}
                {statusBadge(detail.status)}
              </p>
              <Table size="sm" bordered>
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th>จำนวน</th>
                    <th>ราคา</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.items || []).map((item) => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCell(item.unit_price, 'currency')}</td>
                      <td>{formatCell(item.total, 'currency')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
