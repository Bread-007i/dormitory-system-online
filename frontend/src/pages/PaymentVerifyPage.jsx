import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Spinner, Table } from 'react-bootstrap';
import api from '../api/client';
import { getErrorMessage } from '../utils/errors';
import PageHeader from '../components/PageHeader';
import { formatCell } from '../utils/format';

export default function PaymentVerifyPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/payment-requests?status=pending_verification');
      setRows(res.data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id, amount) => {
    await api.post(`/payment-requests/${id}/approve`, { amount });
    load();
  };

  const reject = async (id) => {
    const reason = window.prompt('เหตุผลที่ปฏิเสธ (ถ้ามี)') || 'สลิปไม่ถูกต้อง';
    await api.post(`/payment-requests/${id}/reject`, { reason });
    load();
  };

  return (
    <>
      <PageHeader
        title="ตรวจสลิปชำระเงิน"
        subtitle="รายการที่ผู้เช่าอัปโหลดแล้ว รอเจ้าหน้าที่ยืนยัน"
        icon="bi-patch-check"
      />
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>ผู้เช่า</th>
                  <th>บิล</th>
                  <th>ยอด</th>
                  <th>อ้างอิง</th>
                  <th>สลิป</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      ไม่มีรายการรอตรวจ
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.tenant_name}</td>
                      <td>#{r.bill_id}</td>
                      <td>
                        {formatCell(r.amount_reported, 'currency')}
                        <div className="small text-muted">
                          คาด: {formatCell(r.amount_expected, 'currency')}
                        </div>
                      </td>
                      <td>
                        <code className="small">{r.reference_code}</code>
                      </td>
                      <td>
                        {r.slipUrl ? (
                          <a
                            href={r.slipUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            ดูสลิป
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-1"
                          onClick={() =>
                            approve(r.id, r.amount_reported || r.amount_expected)
                          }
                        >
                          อนุมัติ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => reject(r.id)}
                        >
                          ปฏิเสธ
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      <p className="text-muted small mt-3 mb-0">
        ตรวจสอบสลิปและยอดเงินให้ตรงกับใบแจ้งหนี้ก่อนกดอนุมัติ
      </p>
    </>
  );
}
