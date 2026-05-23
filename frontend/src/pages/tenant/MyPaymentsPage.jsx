import { useEffect, useState } from 'react';
import { Alert, Spinner, Table } from 'react-bootstrap';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import { formatCell } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

export default function MyPaymentsPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/portal/payments')
      .then((res) => setRows(res.data.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title="การชำระเงิน"
        subtitle="ประวัติการชำระของคุณ"
        icon="bi-cash-coin"
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
                  <th>บิล</th>
                  <th>วันที่ชำระ</th>
                  <th>จำนวน</th>
                  <th>ช่องทาง</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      ยังไม่มีประวัติการชำระ
                    </td>
                  </tr>
                ) : (
                  rows.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>#{p.bill_id}</td>
                      <td>{formatCell(p.payment_date, 'datetime')}</td>
                      <td>{formatCell(p.amount_paid, 'currency')}</td>
                      <td>{p.payment_method || '-'}</td>
                      <td>{p.status}</td>
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
