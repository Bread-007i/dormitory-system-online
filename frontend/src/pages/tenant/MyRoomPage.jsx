import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import { formatCell } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

export default function MyRoomPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/portal/room')
      .then((res) => setData(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!data) return <Alert variant="warning">ไม่พบข้อมูลห้อง</Alert>;

  return (
    <>
      <PageHeader
        title="ห้องของฉัน"
        subtitle="ข้อมูลห้องพักและหอพักที่คุณเช่าอยู่"
        icon="bi-door-closed"
      />
      <Row className="g-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="text-primary">
                <i className="bi bi-door-open me-2" />
                ห้อง {data.room_number}
              </h5>
              <dl className="row mb-0 mt-3">
                <dt className="col-sm-4">ประเภท</dt>
                <dd className="col-sm-8">{data.room_type}</dd>
                <dt className="col-sm-4">ค่าเช่า</dt>
                <dd className="col-sm-8">{formatCell(data.rent_price, 'currency')}</dd>
                <dt className="col-sm-4">สถานะห้อง</dt>
                <dd className="col-sm-8">{data.room_status}</dd>
                <dt className="col-sm-4">สัญญา</dt>
                <dd className="col-sm-8">{data.status}</dd>
                <dt className="col-sm-4">เริ่มสัญญา</dt>
                <dd className="col-sm-8">{formatCell(data.contract_start, 'date')}</dd>
                <dt className="col-sm-4">สิ้นสัญญา</dt>
                <dd className="col-sm-8">
                  {data.contract_end ? formatCell(data.contract_end, 'date') : '-'}
                </dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="text-primary">
                <i className="bi bi-building me-2" />
                {data.apartment_name}
              </h5>
              <p className="text-muted mb-1">{data.address}</p>
              <p className="mb-0">{data.city}</p>
              <hr />
              <p className="mb-0">
                <strong>ผู้เช่า:</strong> {data.name}
                <br />
                <strong>โทร:</strong> {data.phone || '-'}
                <br />
                <strong>อีเมล:</strong> {data.email}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
