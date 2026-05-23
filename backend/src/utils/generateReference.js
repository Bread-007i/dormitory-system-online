function generateReference(billId) {
  const suffix = Date.now().toString(36).toUpperCase().slice(-6);
  return `DM${billId}${suffix}`;
}

module.exports = generateReference;
