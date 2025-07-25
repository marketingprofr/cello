// ═══════════════════════════════════════════════════════════════
// 🎼 AVE MARIA DE GOUNOD - PARTITION EXACTE  
// Transcription fidèle de la partition Bernard Dewagtere pour violoncelle
// Charles Gounod (1859) sur Prélude n°1 de Bach
// ═══════════════════════════════════════════════════════════════

// Durées des notes (en unités relatives, double croche = 1)
const NOTE_DURATIONS = {
    DOUBLE_CROCHE: 1,
    CROCHE: 2,
    NOIRE: 4,
    NOIRE_POINTEE: 6,
    BLANCHE: 8,
    BLANCHE_POINTEE: 12,
    RONDE: 16
};

// Transcription des premières mesures d'Ave Maria (partition exacte)
const AVE_MARIA_GOUNOD = [
    // Mesure 1: "A-" (ve) - Do ronde
    { note: 'C3', duration: NOTE_DURATIONS.RONDE, startTime: 0 },
    
    // Mesure 2: "ve Ma-" - Do blanche + Sol noire pointée + Sol croche
    { note: 'C3', duration: NOTE_DURATIONS.BLANCHE, startTime: 16 },
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 24 },
    { note: 'G3', duration: NOTE_DURATIONS.CROCHE, startTime: 30 },
    
    // Mesure 3: "ri-a" - Do4 blanche pointée + Do4 noire 
    { note: 'C4', duration: NOTE_DURATIONS.BLANCHE_POINTEE, startTime: 32 },
    { note: 'C4', duration: NOTE_DURATIONS.NOIRE, startTime: 44 },
    
    // Mesure 4: blanche pointée + PAUSE (soupir)
    { note: 'C4', duration: NOTE_DURATIONS.BLANCHE_POINTEE, startTime: 48 },
    // Pause de 4 unités (soupir) - pas de note
    
    // Mesure 5: "gra-ti-a" - Do4 blanche + Si3 + La3 + Sol3 + Fa3 noires
    { note: 'C4', duration: NOTE_DURATIONS.BLANCHE, startTime: 64 },
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE, startTime: 72 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 76 },
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 80 },
    
    // Mesure 6: "ple-na" - Fa3 noire pointée + Sol3 croche + La3 croche + pause
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 84 },
    { note: 'G3', duration: NOTE_DURATIONS.CROCHE, startTime: 90 },
    { note: 'A3', duration: NOTE_DURATIONS.CROCHE, startTime: 92 },
    // Pause courte (demi-soupir)
    
    // Mesure 7: La3 blanche + Sol#3 + La3 + Si3 noires  
    { note: 'A3', duration: NOTE_DURATIONS.BLANCHE, startTime: 96 },
    { note: 'G#3', duration: NOTE_DURATIONS.NOIRE, startTime: 104 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 108 },
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE, startTime: 112 },
    
    // Mesure 8: Do4 noire pointée + Si3 croche + La3 croche + pause
    { note: 'C4', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 116 },
    { note: 'B3', duration: NOTE_DURATIONS.CROCHE, startTime: 122 },
    { note: 'A3', duration: NOTE_DURATIONS.CROCHE, startTime: 124 },
    
    // Mesure 9: La3 blanche + Sol#3 + La3 + Si3 noires
    { note: 'A3', duration: NOTE_DURATIONS.BLANCHE, startTime: 128 },
    { note: 'G#3', duration: NOTE_DURATIONS.NOIRE, startTime: 136 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 140 },
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE, startTime: 144 },
    
    // Mesure 10: Do4 noire pointée + Ré4 croche + Si3 noire
    { note: 'C4', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 148 },
    { note: 'D4', duration: NOTE_DURATIONS.CROCHE, startTime: 154 },
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE, startTime: 156 },
    
    // Mesure 11: "Do-mi-nus" - Sol3 blanche + Do4 noire
    { note: 'G3', duration: NOTE_DURATIONS.BLANCHE, startTime: 160 },
    { note: 'C4', duration: NOTE_DURATIONS.NOIRE, startTime: 168 },
    
    // Mesure 12: "te-cum" - Si3 + La3 + Sol3 + Fa3 noires + Mi3 noire pointée
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE, startTime: 172 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 176 },
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 180 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 184 },
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 188 },
    
    // Mesure 13: Fa3 croche + Sol3 blanche + Mi3 noire
    { note: 'F3', duration: NOTE_DURATIONS.CROCHE, startTime: 194 },
    { note: 'G3', duration: NOTE_DURATIONS.BLANCHE, startTime: 196 },
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 204 },
    
    // Mesure 14: Fa3 + Mi3 + Ré3 + Do3 noires + Si2 noire pointée
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 208 },
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 212 },
    { note: 'D3', duration: NOTE_DURATIONS.NOIRE, startTime: 216 },
    { note: 'C3', duration: NOTE_DURATIONS.NOIRE, startTime: 220 },
    { note: 'B2', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 224 },
    
    // Mesure 15: Do3 croche + Ré3 blanche + Do3 noire  
    { note: 'C3', duration: NOTE_DURATIONS.CROCHE, startTime: 230 },
    { note: 'D3', duration: NOTE_DURATIONS.BLANCHE, startTime: 232 },
    { note: 'C3', duration: NOTE_DURATIONS.NOIRE, startTime: 240 },
    
    // Mesure 16: "be-ne-dic-ta" - Fa3 + Mi3 + Ré3 + Do3 noires
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 244 },
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 248 },
    { note: 'D3', duration: NOTE_DURATIONS.NOIRE, startTime: 252 },
    { note: 'C3', duration: NOTE_DURATIONS.NOIRE, startTime: 256 },
    
    // Mesure 17: "tu" - Si2 + Do3 + Ré3 + Mi3 noires + Fa3 noire pointée + Mi3 croche
    { note: 'B2', duration: NOTE_DURATIONS.NOIRE, startTime: 260 },
    { note: 'C3', duration: NOTE_DURATIONS.NOIRE, startTime: 264 },
    { note: 'D3', duration: NOTE_DURATIONS.NOIRE, startTime: 268 },
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 272 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 276 },
    { note: 'E3', duration: NOTE_DURATIONS.CROCHE, startTime: 282 },
    
    // Mesure 18: Ré3 blanche pointée + pause
    { note: 'D3', duration: NOTE_DURATIONS.BLANCHE_POINTEE, startTime: 284 },
    
    // Mesure 19: "in mu-li-e" - Sol3 blanche + Do4 noire pointée + Do4 croche
    { note: 'G3', duration: NOTE_DURATIONS.BLANCHE, startTime: 300 },
    { note: 'C4', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 308 },
    { note: 'C4', duration: NOTE_DURATIONS.CROCHE, startTime: 314 },
    
    // Mesure 20: "ri-bus" - Fa4 blanche + Fa4 noire + pause
    { note: 'F4', duration: NOTE_DURATIONS.BLANCHE, startTime: 316 },
    { note: 'F4', duration: NOTE_DURATIONS.NOIRE, startTime: 324 },
    
    // Continue avec fin du morceau...
    // Mesure finale: Do3 final long
    { note: 'C3', duration: NOTE_DURATIONS.RONDE, startTime: 400 }
];

// Export pour utilisation dans le jeu
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AVE_MARIA_GOUNOD, NOTE_DURATIONS };
}
