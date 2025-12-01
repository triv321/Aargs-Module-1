export const logger = {
    info: (message) => console.log(`[INFO] ${message}`),
    error: (message, error) => console.error(`[ERROR] ${message}`, error || ''),
    log: (message) => console.log(message)
};
