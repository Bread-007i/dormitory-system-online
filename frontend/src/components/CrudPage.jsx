import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
  Table,
} from 'react-bootstrap';
import api, { unwrapList } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { emptyForm, formatCell, rowToForm } from '../utils/format';
import { getErrorMessage } from '../utils/errors';
import PageHeader from './PageHeader';

export default function CrudPage({ config }) {
  const { canWrite } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [optionsMap, setOptionsMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => emptyForm(config.fields));
  const [saving, setSaving] = useState(false);

  const loadOptions = useCallback(async () => {
    const selectFields = config.fields.filter((f) => f.optionsFrom);
    const entries = await Promise.all(
      selectFields.map(async (f) => {
        const res = await api.get(f.optionsFrom);
        return [f.name, unwrapList(res)];
      })
    );
    setOptionsMap(Object.fromEntries(entries));
  }, [config.fields]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(config.endpoint);
      setItems(unwrapList(res));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [config.endpoint]);

  useEffect(() => {
    loadItems();
    loadOptions();
  }, [loadItems, loadOptions]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(config.fields));
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(rowToForm(row, config.fields));
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`ลบรายการ #${row.id} ?`)) return;
    try {
      await api.delete(`${config.endpoint}/${row.id}`);
      await loadItems();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    config.fields.forEach((f) => {
      if (f.type === 'number' && payload[f.name] !== '') {
        payload[f.name] = Number(payload[f.name]);
      }
      if (payload[f.name] === '') payload[f.name] = null;
    });
    if (editing && config.endpoint === '/users' && !payload.password) {
      delete payload.password;
    }
    try {
      if (editing) {
        await api.put(`${config.endpoint}/${editing.id}`, payload);
      } else {
        await api.post(config.endpoint, payload);
      }
      setShowModal(false);
      await loadItems();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field) => {
    const value = form[field.name] ?? '';
    const onChange = (e) =>
      setForm((prev) => ({ ...prev, [field.name]: e.target.value }));

    if (field.type === 'textarea') {
      return (
        <Form.Control
          as="textarea"
          rows={3}
          value={value}
          onChange={onChange}
          required={field.required}
        />
      );
    }

    if (field.type === 'select') {
      const opts = field.optionsFrom
        ? (optionsMap[field.name] || [])
        : field.options || [];
      return (
        <Form.Select value={value} onChange={onChange} required={field.required}>
          <option value="">-- เลือก --</option>
          {opts.map((opt) => {
            const val = opt.id ?? opt.value;
            const label =
              typeof field.optionLabel === 'function'
                ? field.optionLabel(opt)
                : opt[field.optionLabel] || opt.label || val;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
        </Form.Select>
      );
    }

    return (
      <Form.Control
        type={field.type || 'text'}
        value={value}
        onChange={onChange}
        required={
          field.required ||
          (field.requiredOnCreate && !editing)
        }
      />
    );
  };

  return (
    <>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        icon={config.icon}
        action={
          canWrite && (
            <Button variant="primary" onClick={openCreate}>
              <i className="bi bi-plus-lg me-1" />
              เพิ่มข้อมูล
            </Button>
          )
        }
      />

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  {config.columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  {canWrite && <th style={{ width: 120 }}>จัดการ</th>}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + (canWrite ? 1 : 0)}
                      className="text-center text-muted py-4"
                    >
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id}>
                      {config.columns.map((col) => (
                        <td key={col.key}>
                          {formatCell(row[col.key], col.format)}
                        </td>
                      ))}
                      {canWrite && (
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-1"
                            onClick={() => openEdit(row)}
                          >
                            <i className="bi bi-pencil" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(row)}
                          >
                            <i className="bi bi-trash" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? 'แก้ไข' : 'เพิ่ม'}
            {config.title}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row g-3">
              {config.fields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === 'textarea' ? 'col-12' : 'col-md-6'}
                >
                  <Form.Label>
                    {field.label}
                    {(field.required || (field.requiredOnCreate && !editing)) && (
                      <span className="text-danger"> *</span>
                    )}
                  </Form.Label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
