// ═══════════════════════════════════════════════════════════════
// 🎼 AVE MARIA DE GOUNOD - PARTITION EXACTE COMPLÈTE  
// Transcription fidèle du MusicXML pour violoncelle
// Charles Gounod (1859) sur Prélude n°1 de Bach
// ═══════════════════════════════════════════════════════════════

// Durées des notes (en unités relatives basées sur divisions=4)
const NOTE_DURATIONS = {
    DOUBLE_CROCHE: 1,    // duration=1
    CROCHE: 2,           // duration=2  
    NOIRE: 4,            // duration=4
    NOIRE_POINTEE: 6,    // duration=6
    NOIRE_DOUBLE_POINTEE: 7, // duration=7
    BLANCHE: 8,          // duration=8
    BLANCHE_POINTEE: 12, // duration=12
    RONDE: 16            // duration=16
};

// Mélodie complète d'Ave Maria de Gounod (110 notes)
const AVE_MARIA_GOUNOD = [
    { note: 'C3', duration: 16, startTime: 0 }, // Mesure 1
    { note: 'E3', duration: 8, startTime: 16 }, // Mesure 2
    { note: 'G3', duration: 6, startTime: 24 },
    { note: 'F3', duration: 2, startTime: 30 },
    { note: 'E3', duration: 12, startTime: 32 }, // Mesure 3
    { note: 'D3', duration: 4, startTime: 44 },
    { note: 'C3', duration: 12, startTime: 48 },
    { note: 'E3', duration: 8, startTime: 64 },
    { note: 'F3', duration: 4, startTime: 72 },
    { note: 'G3', duration: 2, startTime: 76 }, // Mesure 5
    { note: 'A3', duration: 2, startTime: 78 },
    { note: 'G3', duration: 6, startTime: 80 },
    { note: 'F3', duration: 2, startTime: 86 },
    { note: 'E3', duration: 6, startTime: 88 },
    { note: 'E3', duration: 8, startTime: 96 }, // Mesure 7
    { note: 'F3', duration: 4, startTime: 104 },
    { note: 'G3', duration: 2, startTime: 108 },
    { note: 'A3', duration: 2, startTime: 110 },
    { note: 'G3', duration: 6, startTime: 112 },
    { note: 'F3', duration: 2, startTime: 118 }, // Mesure 8
    { note: 'E3', duration: 6, startTime: 120 },
    { note: 'E3', duration: 8, startTime: 128 },
    { note: 'F3', duration: 4, startTime: 136 },
    { note: 'G3', duration: 2, startTime: 140 },
    { note: 'A3', duration: 2, startTime: 142 }, // Mesure 9
    { note: 'C4', duration: 6, startTime: 144 }, // B#3 → C4 (correction enharmonique)
    { note: 'A3', duration: 2, startTime: 150 },
    { note: 'G3', duration: 4, startTime: 152 },
    { note: 'F3', duration: 4, startTime: 156 },
    { note: 'E3', duration: 8, startTime: 160 }, // Mesure 11
    { note: 'D3', duration: 2, startTime: 168 },
    { note: 'D3', duration: 4, startTime: 172 },
    { note: 'C3', duration: 8, startTime: 176 },
    { note: 'D3', duration: 4, startTime: 184 },
    { note: 'E3', duration: 2, startTime: 188 }, // Mesure 12
    { note: 'F3', duration: 2, startTime: 190 },
    { note: 'G3', duration: 7, startTime: 192 },
    { note: 'F3', duration: 1, startTime: 199 },
    { note: 'E3', duration: 8, startTime: 200 },
    { note: 'D3', duration: 8, startTime: 208 }, // Mesure 14
    { note: 'E3', duration: 4, startTime: 216 },
    { note: 'F3', duration: 2, startTime: 220 },
    { note: 'G3', duration: 2, startTime: 222 },
    { note: 'A3', duration: 8, startTime: 224 },
    { note: 'G3', duration: 6, startTime: 232 }, // Mesure 15
    { note: 'F3', duration: 8, startTime: 240 },
    { note: 'G3', duration: 4, startTime: 248 },
    { note: 'A3', duration: 2, startTime: 252 },
    { note: 'B3', duration: 2, startTime: 254 },
    { note: 'C4', duration: 8, startTime: 256 }, // Mesure 17
    { note: 'B3', duration: 4, startTime: 264 },
    { note: 'A3', duration: 2, startTime: 268 },
    { note: 'G3', duration: 2, startTime: 270 },
    { note: 'F3', duration: 6, startTime: 272 },
    { note: 'E3', duration: 2, startTime: 278 }, // Mesure 18
    { note: 'D3', duration: 4, startTime: 280 },
    { note: 'C3', duration: 4, startTime: 284 },
    { note: 'F3', duration: 12, startTime: 288 },
    { note: 'E3', duration: 8, startTime: 304 },
    { note: 'G3', duration: 7, startTime: 312 }, // Mesure 20
    { note: 'F3', duration: 1, startTime: 319 },
    { note: 'E3', duration: 8, startTime: 320 },
    { note: 'C3', duration: 6, startTime: 328 },
    { note: 'E3', duration: 8, startTime: 336 },
    { note: 'G3', duration: 7, startTime: 344 }, // Mesure 22
    { note: 'F3', duration: 1, startTime: 351 },
    { note: 'E3', duration: 8, startTime: 352 },
    { note: 'C#3', duration: 6, startTime: 360 }, // Db3 → C#3 (correction enharmonique)
    { note: 'C3', duration: 1, startTime: 366 },
    { note: 'D3', duration: 1, startTime: 367 }, // Mesure 23
    { note: 'C3', duration: 8, startTime: 368 },
    { note: 'F3', duration: 6, startTime: 376 },
    { note: 'E3', duration: 8, startTime: 384 },
    { note: 'F3', duration: 4, startTime: 392 },
    { note: 'G3', duration: 2, startTime: 396 }, // Mesure 25
    { note: 'A3', duration: 2, startTime: 398 },
    { note: 'G3', duration: 6, startTime: 400 },
    { note: 'F3', duration: 2, startTime: 406 },
    { note: 'E3', duration: 6, startTime: 408 },
    { note: 'E3', duration: 8, startTime: 416 }, // Mesure 27
    { note: 'F3', duration: 4, startTime: 424 },
    { note: 'G3', duration: 2, startTime: 428 },
    { note: 'A3', duration: 2, startTime: 430 },
    { note: 'G3', duration: 6, startTime: 432 },
    { note: 'F3', duration: 2, startTime: 438 }, // Mesure 28
    { note: 'E3', duration: 6, startTime: 440 },
    { note: 'E3', duration: 8, startTime: 448 },
    { note: 'F3', duration: 4, startTime: 456 },
    { note: 'G3', duration: 2, startTime: 460 },
    { note: 'A3', duration: 2, startTime: 462 }, // Mesure 29
    { note: 'E3', duration: 8, startTime: 464 },
    { note: 'F3', duration: 4, startTime: 472 },
    { note: 'G3', duration: 2, startTime: 476 },
    { note: 'A3', duration: 2, startTime: 478 },
    { note: 'E3', duration: 8, startTime: 480 }, // Mesure 31
    { note: 'F3', duration: 4, startTime: 488 },
    { note: 'G3', duration: 2, startTime: 492 },
    { note: 'A3', duration: 2, startTime: 494 },
    { note: 'B3', duration: 2, startTime: 496 },
    { note: 'A3', duration: 2, startTime: 498 }, // Mesure 32
    { note: 'G3', duration: 2, startTime: 500 },
    { note: 'F3', duration: 2, startTime: 502 },
    { note: 'E3', duration: 2, startTime: 504 },
    { note: 'D3', duration: 2, startTime: 506 },
    { note: 'C3', duration: 2, startTime: 508 }, // Mesure 32 (suite)
    { note: 'B2', duration: 2, startTime: 510 },
    { note: 'C3', duration: 16, startTime: 512 }, // Mesure 33
    { note: 'G2', duration: 12, startTime: 528 },
    { note: 'C3', duration: 16, startTime: 544 }, // Mesure 35
    { note: 'C3', duration: 12, startTime: 560 }  // Mesure 36 (finale avec fermata)
];

// Export pour utilisation dans le jeu
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AVE_MARIA_GOUNOD, NOTE_DURATIONS };
}
