import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Form, Spinner, Table } from 'react-bootstrap';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import { formatCell } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

export default function MyMaintenancePage() {
  const [rows, setRows] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/portal/maintenance')
      .then((res) => setRows(res.data.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSending(true);
    try {
      await api.post('/portal/maintenance', { description });
      setDescription('');
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const statusBadge = (s) => {
    if (s === 'completed') return <Badge bg="success">เสร็จแล้ว</Badge>;
    if (s === 'in-progress') return <Badge bg="info">กำลังซ่อม</Badge>;
    return <Badge bg="secondary">รอดำเนินการ</Badge>;
  };

  return (
    <>
      <PageHeader
        title="แจ้งซ่อม"
        subtitle="ส่งคำขอซ่อมบำรุงในหอพักของคุณ"
        icon="bi-tools"
      />
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h6 className="mb-3">ส่งคำขอใหม่</h6>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="อธิบายปัญหา เช่น หลอดไฟเสีย ท่อน้ำรั่ว..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={sending}>
              {sending ? 'กำลังส่ง...' : 'ส่งคำขอแจ้งซ่อม'}
            </Button>
          </Form>
        </div>
      </div>

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
                  <th>รายละเอียด</th>
                  <th>สถานะ</th>
                  <th>วันที่แจ้ง</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      ยังไม่มีรายการแจ้งซ่อม
                    </td>
                  </tr>
                ) : (
                  rows.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.description}</td>
                      <td>{statusBadge(m.status)}</td>
                      <td>{formatCell(m.created_date, 'datetime')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}
