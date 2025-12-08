export const isBrowser = () => typeof window !== 'undefined';

export const safeWindow = () => (isBrowser() ? window : undefined);
