import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const uploadsDir = path.resolve(dirname, '../../../public/uploads');

const storage = multer.diskStorage({
  destination: (_, _2, cb) => {
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const productId = req.params.productId || Date.now().toString();
    const extension = path.extname(file.originalname);
    cb(null, `${productId}${extension}`);
  },
});

const upload = multer({ storage });

export default upload;
