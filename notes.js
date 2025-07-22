// ═══════════════════════════════════════════════════════════════
// 🎵 CELLO RHYTHM GAME - DONNÉES MUSICALES v2.3.1
// Ave Maria de Gounod - Adaptation pour violoncelle
// CORRECTIF CACHE: 22/07/2025 - Pas de changement données
// ═══════════════════════════════════════════════════════════════

// Données musicales pour l'Ave Maria de Gounod (version simplifiée pour violoncelle)
// Les notes sont en clé de Fa, adaptées pour le violoncelle

// Définition des notes et leurs fréquences (en Hz)
const NOTE_FREQUENCIES = {
    'C2': 65.41,   // Do grave (corde à vide)
    'D2': 73.42,
    'E2': 82.41,
    'F2': 87.31,
    'G2': 98.00,   // Sol (corde à vide)
    'A2': 110.00,
    'B2': 123.47,
    'C3': 130.81,
    'D3': 146.83,  // Ré (corde à vide)
    'E3': 164.81,
    'F3': 174.61,
    'G3': 196.00,
    'A3': 220.00,  // La (corde à vide)
    'B3': 246.94,
    'C4': 261.63,  // Do central
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25
};

// Conversion des noms de notes scientifiques vers le système français
const NOTE_NAMES_FR = {
    'C': 'Do',
    'D': 'Ré',
    'E': 'Mi',
    'F': 'Fa',
    'G': 'Sol',
    'A': 'La',
    'B': 'Si'
};

// Mélodie de l'Ave Maria de Gounod (premières mesures)
// Chaque note contient: note scientifique, durée en secondes, position x de départ
const AVE_MARIA_MELODY = [
    { note: 'G3', duration: 1.5, startTime: 2.0 },  // Commence plus tard pour voir les notes arriver
    { note: 'C4', duration: 1.0, startTime: 4.0 },
    { note: 'C4', duration: 1.0, startTime: 6.0 },
    { note: 'D4', duration: 0.5, startTime: 8.0 },
    { note: 'C4', duration: 0.5, startTime: 9.0 },
    { note: 'B3', duration: 1.0, startTime: 10.0 },
    { note: 'A3', duration: 1.5, startTime: 12.0 },
    
    { note: 'A3', duration: 1.0, startTime: 14.0 },
    { note: 'G3', duration: 1.0, startTime: 16.0 },
    { note: 'A3', duration: 0.5, startTime: 18.0 },
    { note: 'B3', duration: 0.5, startTime: 19.0 },
    { note: 'C4', duration: 1.0, startTime: 20.0 },
    { note: 'G3', duration: 1.5, startTime: 22.0 },
    
    { note: 'G3', duration: 1.0, startTime: 24.0 },
    { note: 'C4', duration: 1.0, startTime: 26.0 },
    { note: 'C4', duration: 1.0, startTime: 28.0 },
    { note: 'D4', duration: 0.5, startTime: 30.0 },
    { note: 'E4', duration: 0.5, startTime: 31.0 },
    { note: 'F4', duration: 1.0, startTime: 32.0 },
    { note: 'E4', duration: 1.5, startTime: 34.0 },
    
    { note: 'E4', duration: 1.0, startTime: 36.0 },
    { note: 'D4', duration: 1.0, startTime: 38.0 },
    { note: 'C4', duration: 1.0, startTime: 40.0 },
    { note: 'B3', duration: 1.0, startTime: 42.0 },
    { note: 'C4', duration: 2.0, startTime: 44.0 }
];

// Positions des notes sur la portée en clé de Fa
// Y = 0 correspond au haut du canvas, les valeurs augmentent vers le bas
const STAFF_POSITIONS = {
    'F4': 20,   // Au-dessus de la portée
    'E4': 30,   // Sur la ligne supplémentaire
    'D4': 40,   // Entre ligne sup. et 1ère ligne
    'C4': 50,   // 1ère ligne (haute)
    'B3': 60,   // 1er interligne
    'A3': 70,   // 2ème ligne
    'G3': 80,   // 2ème interligne
    'F3': 90,   // 3ème ligne (centrale)
    'E3': 100,  // 3ème interligne
    'D3': 110,  // 4ème ligne
    'C3': 120,  // 4ème interligne
    'B2': 130,  // 5ème ligne (basse)
    'A2': 140,  // Sous la portée
    'G2': 150,  // Sous la portée (ligne sup.)
    'F2': 160,
    'E2': 170,
    'D2': 180,
    'C2': 190   // Très grave
};

// Configuration du jeu
const GAME_CONFIG = {
    scrollSpeed: 60,      // pixels par seconde (encore plus lent pour être sûr de voir)
    hitLineX: 150,        // position X de la ligne de jugement
    noteRadius: 15,       // rayon des notes (encore plus gros)
    staffLineY: [50, 70, 90, 110, 130], // positions Y des lignes de la portée
    perfectThreshold: 35, // cents (un peu plus tolérant)
    okThreshold: 75,      // cents (beaucoup plus tolérant)
    judgmentWindow: 500   // millisecondes (fenêtre plus large)
};

// Fonction utilitaire pour obtenir le nom français d'une note
function getNoteFrenchName(scientificNote) {
    const noteName = scientificNote.charAt(0);
    const octave = scientificNote.slice(1);
    return NOTE_NAMES_FR[noteName] + octave;
}

// Fonction pour calculer la différence en cents entre deux fréquences
function getCentsDifference(freq1, freq2) {
    return Math.round(1200 * Math.log2(freq2 / freq1));
}
