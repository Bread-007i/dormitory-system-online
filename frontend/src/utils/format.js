export function formatCell(value, format) {
  if (value == null || value === '') return '-';
  if (!format) return String(value);
  if (format === 'currency') {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(Number(value));
  }
  if (format === 'date') {
    return new Date(value).toLocaleDateString('th-TH');
  }
  if (format === 'datetime') {
    return new Date(value).toLocaleString('th-TH');
  }
  return String(value);
}

export function emptyForm(fields) {
  const form = {};
  fields.forEach((f) => {
    if (f.type === 'select' && f.options?.length) {
      form[f.name] = f.options[0].value;
    } else if (f.type === 'number') {
      form[f.name] = '';
    } else {
      form[f.name] = '';
    }
  });
  return form;
}

export function rowToForm(row, fields) {
  const form = {};
  fields.forEach((f) => {
    let v = row[f.name];
    if (f.type === 'date' && v) {
      v = String(v).slice(0, 10);
    }
    if (f.type === 'datetime-local' && v) {
      v = String(v).slice(0, 16);
    }
    form[f.name] = v ?? '';
  });
  return form;
}
