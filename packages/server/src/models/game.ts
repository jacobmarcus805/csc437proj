export interface Game {
    _id?: string;
    date: string; // ISO date string e.g. "2025-10-25"
    time?: string; // e.g. "7:30 PM EST"
    opponent: string;
    opponentLogo?: string;
    isHome: boolean;
    location?: string;
    heatScore?: number;
    opponentScore?: number;
    notes?: string;
}
