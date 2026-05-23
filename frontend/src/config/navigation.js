/** เมนูตามบทบาท: admin | staff | tenant */

export const navGroups = [
  {
    title: 'ภาพรวม',
    roles: ['admin', 'staff', 'tenant'],
    items: [{ path: '/', label: 'แดชบอร์ด', icon: 'bi-speedometer2' }],
  },
  {
    title: 'ของฉัน',
    roles: ['tenant'],
    items: [
      { path: '/my-room', label: 'ห้องของฉัน', icon: 'bi-door-closed' },
      { path: '/my-bills', label: 'ใบแจ้งหนี้', icon: 'bi-receipt' },
      { path: '/my-payments', label: 'การชำระเงิน', icon: 'bi-cash-coin' },
      { path: '/my-maintenance', label: 'แจ้งซ่อม', icon: 'bi-tools' },
    ],
  },
  {
    title: 'จัดการหอพัก',
    roles: ['admin', 'staff'],
    items: [
      { path: '/apartments', label: 'หอพัก', icon: 'bi-building' },
      { path: '/rooms', label: 'ห้องพัก', icon: 'bi-door-open' },
      { path: '/tenants', label: 'ผู้เช่า', icon: 'bi-people' },
      { path: '/contracts', label: 'สัญญา', icon: 'bi-file-earmark-text' },
    ],
  },
  {
    title: 'การเงิน',
    roles: ['admin', 'staff'],
    items: [
      { path: '/bills', label: 'ใบแจ้งหนี้', icon: 'bi-receipt-cutoff' },
      { path: '/bill-items', label: 'รายการบิล', icon: 'bi-list-check' },
      { path: '/payments', label: 'การชำระเงิน', icon: 'bi-cash-stack' },
      { path: '/payment-verify', label: 'ตรวจสลิป QR', icon: 'bi-patch-check' },
    ],
  },
  {
    title: 'บริการ & มิเตอร์',
    roles: ['admin', 'staff'],
    items: [
      { path: '/utilities', label: 'สาธารณูปโภค', icon: 'bi-lightning' },
      { path: '/meter-readings', label: 'มิเตอร์', icon: 'bi-speedometer' },
      { path: '/maintenance', label: 'แจ้งซ่อม (ทั้งหมด)', icon: 'bi-wrench' },
    ],
  },
  {
    title: 'ระบบ',
    roles: ['admin'],
    items: [{ path: '/users', label: 'ผู้ใช้งาน', icon: 'bi-person-gear' }],
  },
];

export function canAccessNav(userRole, group, item) {
  const roles = item.roles || group.roles;
  if (!roles) return true;
  const normalized = userRole === 'manager' ? 'staff' : userRole;
  return roles.includes(normalized);
}
