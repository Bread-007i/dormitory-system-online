const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../../uploads/slips');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safe = `${req.params.id}-${Date.now()}${ext}`;
    cb(null, safe);
  },
});

const uploadSlip = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /jpeg|jpg|png|webp|gif|pdf/i.test(
      file.mimetype + path.extname(file.originalname)
    );
    if (ok) cb(null, true);
    else cb(new Error('รองรับเฉพาะไฟล์รูปหรือ PDF'));
  },
});

module.exports = uploadSlip;
