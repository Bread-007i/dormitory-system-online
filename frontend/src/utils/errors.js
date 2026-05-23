export function getErrorMessage(err, fallback = 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง') {
  const msg = err?.response?.data?.message;
  if (typeof msg === 'string' && msg.length > 0 && !msg.includes('Error:')) {
    return msg;
  }
  return fallback;
}
