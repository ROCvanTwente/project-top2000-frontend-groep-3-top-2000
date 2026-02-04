// VERANDER DIT BESTAND NIET - Niek Geerligs

// Use relative URL for production (Vercel proxy) or direct URL for local development
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

export const BASE_API_URL = isProduction ? "" : "https://top2000api.runasp.net";