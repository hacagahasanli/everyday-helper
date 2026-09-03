export const isBrowser = () => typeof window !== 'undefined';

export const safeWindow = () => (isBrowser() ? window : undefined);

export const isDocumentAvailable = () => typeof document !== 'undefined';

export const safeDocument = () => (isDocumentAvailable() ? document : undefined);
