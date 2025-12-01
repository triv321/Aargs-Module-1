import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
    DEFAULT_URL: 'http://localhost:8080',
    ARTIFACTS_DIR: path.join(__dirname, '../artifacts'),
    TIMEOUT: 30000,
    SCROLL: {
        DISTANCE: 100,
        INTERVAL: 100
    }
};
