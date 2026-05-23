# ระบบชำระเงิน QR (โหมดทดสอบ)

## ขั้นตอนผู้เช่า

1. ไป **ใบแจ้งหนี้** → กด **QR** ที่บิล `pending`
2. สแกน QR PromptPay (รูปใน `frontend/public/promptpay-qr.png`)
3. โอนยอดให้ **ตรงกับบิล**
4. ใส่ **เลขอ้างอิง** (เช่น `DM5123ABC`) ในหมายเหตุการโอน
5. อัปโหลดสลิป + ใส่ยอดที่โอน → กดยืนยัน

## ตรวจอัตโนมัติ (ทดสอบ)

ถ้า `PAYMENT_AUTO_VERIFY=true` และยอดที่กรอก **ตรงกับบิล**:

- สร้างรายการใน `payments`
- เปลี่ยนบิลเป็น `paid`
- ไม่ต้องรอ staff

ถ้ายอดไม่ตรง → สถานะ `pending_verification` → staff ไป **ตรวจสลิป QR**

## Staff / Admin

เมนู **ตรวจสลิป QR** — อนุมัติ / ปฏิเสธ

## จำลองธนาคาร (dev)

```http
POST http://localhost:3000/api/dev/simulate-payment
Content-Type: application/json

{
  "reference_code": "DM5123ABC",
  "amount": 6500
}
```

## ตั้งค่า (.env)

```
PROMPTPAY_ACCOUNT_NAME=...
PROMPTPAY_ACCOUNT_MASK=...
PROMPTPAY_QR_IMAGE=/promptpay-qr.png
PAYMENT_AUTO_VERIFY=true
```

## Migration

```bash
npm run migrate:payments
```

## ของจริงในอนาคต

- **Webhook จาก Payment Gateway** (GB Prime Pay, Opn, 2C2P) แจ้งยอด+ref อัตโนมัติ
- **Slip Verify API** (SlipOK ฯลฯ) อ่านยอดจากรูปสลิป
- QR แบบ **dynamic** ฝังยอด+ref (ต้องใช้ API ธนาคาร/aggregator)
