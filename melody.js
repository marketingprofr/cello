// ═══════════════════════════════════════════════════════════════
// 🎼 AVE MARIA DE GOUNOD - MÉLODIE COMPLÈTE
// Transcription pour violoncelle (clé de fa)
// Domaine public - Charles Gounod (1818-1893)
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

// Ave Maria de Gounod - Mélodie principale adaptée pour violoncelle
const AVE_MARIA_GOUNOD = [
    // Mesure 1-2 : "A-ve Ma-ri-a"
    { note: 'C3', duration: NOTE_DURATIONS.BLANCHE_POINTEE, startTime: 0 },
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 12 },
    
    // Mesure 3-4 : "gra-ti-a ple-na"
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 16 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 20 },
    { note: 'D3', duration: NOTE_DURATIONS.BLANCHE, startTime: 24 },
    
    // Mesure 5-6 : "Do-mi-nus te-cum"
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 32 },
    { note: 'C4', duration: NOTE_DURATIONS.NOIRE, startTime: 36 },
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE, startTime: 40 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 44 },
    
    // Mesure 7-8 : "be-ne-dic-ta tu"
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 48 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 52 },
    { note: 'E3', duration: NOTE_DURATIONS.BLANCHE, startTime: 56 },
    
    // Mesure 9-10 : "in mu-li-e-ri-bus"
    { note: 'D3', duration: NOTE_DURATIONS.CROCHE, startTime: 64 },
    { note: 'E3', duration: NOTE_DURATIONS.CROCHE, startTime: 66 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 68 },
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 72 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 76 },
    
    // Mesure 11-12 : "et be-ne-dic-tus"
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE, startTime: 80 },
    { note: 'C4', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 84 },
    { note: 'B3', duration: NOTE_DURATIONS.CROCHE, startTime: 90 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 92 },
    
    // Mesure 13-14 : "fruc-tus ven-tris"
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 96 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 100 },
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 104 },
    { note: 'D3', duration: NOTE_DURATIONS.NOIRE, startTime: 108 },
    
    // Mesure 15-16 : "tu-i Je-sus"
    { note: 'C3', duration: NOTE_DURATIONS.BLANCHE, startTime: 112 },
    { note: 'G3', duration: NOTE_DURATIONS.BLANCHE, startTime: 120 },
    
    // Mesure 17-18 : "Sanc-ta Ma-ri-a"
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 128 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 132 },
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 136 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 140 },
    
    // Mesure 19-20 : "Ma-ter De-i"
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 144 },
    { note: 'A3', duration: NOTE_DURATIONS.CROCHE, startTime: 150 },
    { note: 'G3', duration: NOTE_DURATIONS.BLANCHE, startTime: 152 },
    
    // Mesure 21-22 : "o-ra pro no-bis"
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 160 },
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 164 },
    { note: 'D3', duration: NOTE_DURATIONS.NOIRE, startTime: 168 },
    { note: 'C3', duration: NOTE_DURATIONS.NOIRE, startTime: 172 },
    
    // Mesure 23-24 : "pec-ca-to-ri-bus"
    { note: 'D3', duration: NOTE_DURATIONS.CROCHE, startTime: 176 },
    { note: 'E3', duration: NOTE_DURATIONS.CROCHE, startTime: 178 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 180 },
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 184 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 188 },
    
    // Mesure 25-26 : "nunc et in ho-ra"
    { note: 'B3', duration: NOTE_DURATIONS.NOIRE, startTime: 192 },
    { note: 'C4', duration: NOTE_DURATIONS.NOIRE_POINTEE, startTime: 196 },
    { note: 'B3', duration: NOTE_DURATIONS.CROCHE, startTime: 202 },
    { note: 'A3', duration: NOTE_DURATIONS.NOIRE, startTime: 204 },
    
    // Mesure 27-28 : "mor-tis nos-trae"
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 208 },
    { note: 'F3', duration: NOTE_DURATIONS.NOIRE, startTime: 212 },
    { note: 'E3', duration: NOTE_DURATIONS.NOIRE, startTime: 216 },
    { note: 'D3', duration: NOTE_DURATIONS.NOIRE, startTime: 220 },
    
    // Mesure 29-30 : "A-men" (final)
    { note: 'C3', duration: NOTE_DURATIONS.BLANCHE, startTime: 224 },
    { note: 'G3', duration: NOTE_DURATIONS.NOIRE, startTime: 232 },
    { note: 'C3', duration: NOTE_DURATIONS.RONDE, startTime: 236 }  // Note finale longue
];

// Export pour utilisation dans le jeu
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AVE_MARIA_GOUNOD, NOTE_DURATIONS };
}
