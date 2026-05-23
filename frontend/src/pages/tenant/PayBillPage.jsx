import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import { formatCell } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

export default function PayBillPage() {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [amountReported, setAmountReported] = useState('');
  const [slipFile, setSlipFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(null);

  const startPayment = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/portal/payments/request', {
        bill_id: Number(billId),
      });
      const d = res.data.data;
      setSession(d);
      setAmountReported(String(d.amount));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startPayment();
  }, [billId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!slipFile) {
      alert('เลือกไฟล์สลิปก่อน');
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append('slip', slipFile);
    form.append('amount_reported', amountReported);
    try {
      const res = await api.post(
        `/portal/payments/request/${session.requestId}/slip`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setDone(res.data);
      if (res.data.data?.autoVerified) {
        setTimeout(() => navigate('/my-bills'), 2500);
      }
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Alert variant="danger">{error}</Alert>
        <Link to="/my-bills">กลับไปใบแจ้งหนี้</Link>
      </>
    );
  }

  const pp = session?.promptPay || {};

  return (
    <>
      <PageHeader
        title="ชำระเงินด้วย QR"
        subtitle={`บิล #${billId} — โอนแล้วอัปโหลดสลิป`}
        icon="bi-qr-code-scan"
      />

      {done?.data?.autoVerified && (
        <Alert variant="success">
          <i className="bi bi-check-circle me-2" />
          ชำระเงินสำเร็จ — กำลังนำคุณกลับไปหน้าใบแจ้งหนี้...
        </Alert>
      )}

      {done && !done.data?.autoVerified && (
        <Alert variant="info">
          ส่งสลิปเรียบร้อยแล้ว — ระบบจะแจ้งเมื่อเจ้าหน้าที่ยืนยันการชำระเงิน
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={5}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="p-4">
              <Badge bg="primary" className="mb-2">
                Thai QR Payment
              </Badge>
              <img
                src={pp.qrImageUrl || '/promptpay-qr.png'}
                alt="PromptPay QR"
                className="img-fluid rounded mb-3"
                style={{ maxWidth: 280 }}
              />
              <p className="small text-muted mb-1">สแกน QR เพื่อโอนเข้าบัญชี</p>
              <p className="fw-semibold mb-0">{pp.accountName}</p>
              <p className="text-muted small">บัญชี: {pp.accountMask}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h5 className="text-danger mb-3">
                ยอดที่ต้องโอน: {formatCell(session.amount, 'currency')}
              </h5>
              <div className="bg-light rounded p-3 mb-3">
                <div className="small text-muted">เลขอ้างอิง (ใส่ในหมายเหตุการโอน)</div>
                <div className="fs-4 fw-bold text-primary font-monospace">
                  {session.referenceCode}
                </div>
              </div>
              <ol className="small text-muted mb-0">
                {(session.instructions || []).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </Card.Body>
          </Card>

          {!done && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white fw-semibold">
                อัปโหลดสลิปหลังโอน
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpload}>
                  <Form.Group className="mb-3">
                    <Form.Label>ยอดที่โอนจริง (บาท)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={amountReported}
                      onChange={(e) => setAmountReported(e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted">
                      กรุณากรอกยอดให้ตรงกับที่โอนจริง
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>รูปสลิปการโอน</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setSlipFile(e.target.files?.[0])}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="success" disabled={uploading}>
                    {uploading ? 'กำลังตรวจสอบ...' : 'ยืนยันการชำระ'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          <div className="mt-3">
            <Link to="/my-bills">← กลับไปใบแจ้งหนี้</Link>
          </div>
        </Col>
      </Row>
    </>
  );
}
