// Version complète du jeu avec toutes les fonctionnalités - TEMPO 60 BPM SYNCHRONISÉ
(function() {
    'use strict';
    
    console.log('🎻 CELLO RHYTHM GAME v2.6.1 - TIMING CORRIGÉ (Basé sur l\'arrivée des notes)');
    
    // ═══ DONNÉES INTÉGRÉES ═══
    const NOTE_FREQUENCIES = {
        'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
        'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
        'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
        'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
        'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
        'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
        'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91
    };
    
    const FRENCH_NAMES = {
        'C': 'Do', 'C#': 'Do#', 'D': 'Ré', 'D#': 'Ré#', 'E': 'Mi', 'F': 'Fa',
        'F#': 'Fa#', 'G': 'Sol', 'G#': 'Sol#', 'A': 'La', 'A#': 'La#', 'B': 'Si'
    };
    
    const GAME_CONFIG = {
        scrollSpeed: 60, // pixels par seconde à 60 BPM
        hitLineX: 180, // ✅ AJUSTER: Nouvelle position dans la zone droite
        perfectThreshold: 35,
        okThreshold: 70,
        judgmentWindow: 800,
        noteRadius: 8, // Réduit de 14 à 8 pour des notes plus fines
        staffLineY: [50, 70, 90, 110, 130],
        tempo: 60 // BPM - 1 noire = 1 seconde
    };
    
    // Positions des notes sur la portée (clé de fa) - CORRIGÉES ✅
    const STAFF_POSITIONS = {
        // Notes très graves (en dessous de la portée)
        'C1': 210, 'C#1': 205, 'D1': 200, 'D#1': 195, 'E1': 190, 'F1': 180, 'F#1': 175, 
        'G1': 170, 'G#1': 165, 'A1': 160, 'A#1': 155, 'B1': 150,
        
        // Notes graves (sous la portée)
        'C2': 140, 'C#2': 135, 'D2': 130, 'D#2': 125, 'E2': 120, 'F2': 115, 'F#2': 110, 
        'G2': 130, 'G#2': 125, 'A2': 120, 'A#2': 115, 'B2': 110, // G2 sur ligne 5
        
        // Notes moyennes (sur la portée) - CLEF DE FA CORRECTE
        'C3': 100, 'C#3': 95,   // Do3 = espace entre lignes 3-4
        'D3': 90, 'D#3': 85,    // Ré3 = ligne 3
        'E3': 80, 'F3': 70,     // Mi3 = espace, Fa3 = ligne 2  
        'F#3': 65, 'G3': 60,    // Sol3 = espace entre lignes 1-2
        'G#3': 55, 'A3': 50,    // La3 = ligne 1
        'A#3': 45, 'B3': 40,    // Si3 = au-dessus de la portée
        
        // Notes aiguës (au-dessus de la portée)
        'C4': 30, 'C#4': 25, 'D4': 20, 'D#4': 15, 'E4': 10, 'F4': 5, 'F#4': 0,
        'G4': -5, 'G#4': -10, 'A4': -15, 'A#4': -20, 'B4': -25,
        'C5': -30, 'C#5': -35, 'D5': -40, 'D#5': -45, 'E5': -50, 'F5': -55, 'F#5': -60,
        'G5': -65, 'G#5': -70, 'A5': -75, 'A#5': -80, 'B5': -85,
        'C6': -90, 'C#6': -95, 'D6': -100, 'D#6': -105, 'E6': -110, 'F6': -115
    };
    
    // Mélodie simple pour test (fallback si XML échoue)
    const FALLBACK_MELODY = [
        { note: 'C3', duration: 8, startTime: 0 },   // Blanche 
        { note: 'G3', duration: 4, startTime: 8 },   // Noire
        { note: 'E3', duration: 4, startTime: 12 },  // Noire
        { note: 'F3', duration: 4, startTime: 16 },  // Noire
        { note: 'D3', duration: 8, startTime: 20 }   // Blanche
    ];
    
    function getNoteFrenchName(note) {
        if (!note || typeof note !== 'string') return '-';
        const match = note.match(/^([A-G]#?)(\d)$/);
        if (!match) return note;
        const [, noteName, octave] = match;
        return `${FRENCH_NAMES[noteName] || noteName}${octave}`;
    }
    
    function getCentsDifference(freq1, freq2) {
        return 1200 * Math.log2(freq2 / freq1);
    }
    
    let game = null;
    
    function waitForLoad() {
        if (document.readyState === 'complete') {
            console.log('DOM loaded, creating complete game...');
            initializeGame();
        } else {
            setTimeout(waitForLoad, 100);
        }
    }
    
    function initializeGame() {
        try {
            game = new CelloRhythmGame();
        } catch (error) {
            console.error('❌ Error:', error);
            alert('Erreur: ' + error.message);
        }
    }
    
    class CelloRhythmGame {
        constructor() {
            console.log('🎻 Creating COMPLETE game v2.6.1 (Timing corrigé - arrivée des notes)...');
            
            // Variables de base
            this.microphoneActive = false;
            this.isPlaying = false;
            this.audioContext = null;
            this.microphone = null;
            this.analyser = null;
            this.dataArray = null;
            this.pitchDetectionActive = false;
            
            // Variables de jeu
            this.startTime = 0;
            this.currentTime = 0;
            this.score = 0;
            this.combo = 0;
            this.gameNotes = [];
            this.measures = []; // ✅ NOUVEAU: Array des mesures
            
            // ✅ NOUVEAU: Système de jugement dynamique
            this.currentJudgment = null;
            this.judgmentTime = 0;
            this.judgmentDuration = 1500; // Durée d'affichage en ms
            
            // Variables audio avec stabilisation SIMPLE
            this.currentVolume = 0;
            this.lastDetectedFreq = 0;
            this.lastDetectedNote = null;
            
            // Stabilisation simple
            this.displayedNote = null;
            this.displayedFreq = 0;
            this.noteChangeTimeout = null;
            
            // Initialiser
            this.initializeElements();
            this.initializeEventListeners();
            this.setupCanvas();
            this.initializeGameNotes(); // Cette fonction chargera sheet1.xml
            
            // Démarrer l'animation
            this.animate();
            
            console.log('✅ COMPLETE game created v2.6.1 (Timing corrigé - arrivée des notes)');
        }
        
        initializeElements() {
            console.log('🎯 Initializing elements...');
            
            // Éléments critiques
            this.playedNoteElement = document.getElementById('playedNote');
            this.playedFreqElement = document.getElementById('playedFreq');
            this.judgmentElement = document.getElementById('judgment');
            
            if (!this.playedNoteElement) throw new Error('playedNote element not found!');
            if (!this.playedFreqElement) throw new Error('playedFreq element not found!');
            
            // Boutons
            this.micBtn = document.getElementById('micBtn');
            this.startBtn = document.getElementById('startBtn');
            this.stopBtn = document.getElementById('stopBtn');
            this.testBtn = document.getElementById('testBtn');
            this.debugBtn = document.getElementById('debugBtn');
            
            // Interface
            this.scoreElement = document.getElementById('score');
            this.comboElement = document.getElementById('combo');
            this.debugStatusElement = document.getElementById('debugStatus');
            this.micStatusElement = document.getElementById('micStatus');
            this.frequencyElement = document.getElementById('frequency');
            this.volumeElement = document.getElementById('volume');
            this.activeNotesElement = document.getElementById('activeNotes');
            this.gameTimeElement = document.getElementById('gameTime');
            
            // Canvas
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            
            console.log('✅ All elements initialized');
        }
        
        initializeEventListeners() {
            console.log('🎯 Setting up event listeners...');
            
            this.testBtn.onclick = () => this.simulateNote();
            this.micBtn.onclick = () => this.toggleMicrophone();
            this.startBtn.onclick = () => this.startGame();
            this.stopBtn.onclick = () => this.stopGame();
            this.debugBtn.onclick = () => this.showDebugInfo();
            
            console.log('✅ Event listeners ready');
        }
        
        simulateNote() {
            console.log('🎵 Simulating note...');
            
            try {
                const noteEl = document.getElementById('playedNote');
                const freqEl = document.getElementById('playedFreq');
                
                if (noteEl && freqEl) {
                    // Simuler une note
                    this.displayedNote = 'C3';
                    this.displayedFreq = 130.81;
                    
                    noteEl.textContent = 'Do3';
                    freqEl.textContent = '130.8 Hz';
                    this.showJudgment('perfect');
                    this.debugStatusElement.textContent = 'Test réussi!';
                    
                    if (!this.pitchDetectionActive) {
                        setTimeout(() => {
                            this.displayedNote = null;
                            this.displayedFreq = 0;
                            noteEl.textContent = '-';
                            freqEl.textContent = '- Hz';
                            this.debugStatusElement.textContent = this.microphoneActive ? 'Microphone actif' : 'En attente';
                        }, 2000);
                    }
                }
                
                console.log('✅ Test note successful');
                
            } catch (error) {
                console.error('❌ Error in simulateNote:', error);
                this.debugStatusElement.textContent = 'Erreur test: ' + error.message;
            }
        }
        
        async toggleMicrophone() {
            if (this.microphoneActive) {
                this.stopMicrophone();
            } else {
                try {
                    await this.initializeAudio();
                    this.micBtn.textContent = '🎤 Désactiver Microphone';
                    this.micBtn.style.backgroundColor = '#f44336';
                    this.micStatusElement.textContent = 'Activé - Détection active';
                    this.debugStatusElement.textContent = 'Microphone actif - Prêt pour l\'accordage';
                    
                    setTimeout(() => this.startPitchDetection(), 500);
                    console.log('✅ Microphone activated');
                    
                } catch (error) {
                    console.error('❌ Error activating microphone:', error);
                    this.debugStatusElement.textContent = 'Erreur micro: ' + error.message;
                    alert('Erreur microphone: ' + error.message);
                }
            }
        }
        
        async initializeAudio() {
            console.log('🎤 Initializing audio...');
            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported');
            }
            
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                } 
            });
            
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            
            this.analyser.fftSize = 16384;  // Encore plus de résolution pour les graves
            this.analyser.smoothingTimeConstant = 0.05;  // Moins de lissage
            this.analyser.minDecibels = -110;  // Plus sensible
            this.analyser.maxDecibels = -10;
            
            this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
            this.timeDomainArray = new Float32Array(this.analyser.fftSize); // Pour autocorrélation
            this.microphone.connect(this.analyser);
            this.microphoneActive = true;
            
            console.log('✅ Audio initialized');
        }
        
        startPitchDetection() {
            console.log('🎼 Starting pitch detection...');
            this.pitchDetectionActive = true;
            this.detectPitch();
        }
        
        detectPitch() {
            if (!this.pitchDetectionActive || !this.microphoneActive || !this.analyser) {
                if (this.pitchDetectionActive) {
                    requestAnimationFrame(() => this.detectPitch());
                }
                return;
            }
            
            try {
                // Obtenir les données temporelles pour l'autocorrélation
                this.analyser.getFloatTimeDomainData(this.timeDomainArray);
                
                // Calculer le volume (RMS)
                let rms = 0;
                for (let i = 0; i < this.timeDomainArray.length; i++) {
                    rms += this.timeDomainArray[i] * this.timeDomainArray[i];
                }
                rms = Math.sqrt(rms / this.timeDomainArray.length);
                const volume = 20 * Math.log10(rms + 1e-10); // Convertir en dB
                
                this.currentVolume = Math.round(volume);
                
                const volEl = document.getElementById('volume');
                const freqEl = document.getElementById('frequency');
                if (volEl) volEl.textContent = this.currentVolume;
                
                // Seuil adaptatif selon la fréquence mesurée
                let volumeThreshold = -60; // Seuil de base
                
                // Pour les graves, être plus tolérant sur le volume
                const preliminaryFreq = this.detectFundamentalFrequency(this.timeDomainArray);
                if (preliminaryFreq > 0 && preliminaryFreq < 120) {
                    volumeThreshold = -65; // Plus sensible pour les graves
                }
                
                if (volume > volumeThreshold) {
                    // Utiliser l'autocorrélation pour trouver la fréquence fondamentale
                    const frequency = this.detectFundamentalFrequency(this.timeDomainArray);
                    
                    if (frequency > 0) {
                        this.lastDetectedFreq = frequency;
                        if (freqEl) freqEl.textContent = frequency.toFixed(1);
                        
                        const detectedNote = this.frequencyToNote(frequency);
                        if (detectedNote) {
                            this.lastDetectedNote = detectedNote;
                            this.lastDetectedFreq = frequency;
                            
                            // Afficher immédiatement
                            const frenchName = getNoteFrenchName(detectedNote);
                            const noteEl = document.getElementById('playedNote');
                            const freqDisplayEl = document.getElementById('playedFreq');
                            
                            if (noteEl && freqDisplayEl) {
                                this.displayedNote = detectedNote;
                                this.displayedFreq = frequency;
                                
                                noteEl.textContent = frenchName;
                                freqDisplayEl.textContent = frequency.toFixed(1) + ' Hz';
                                
                                // Annuler le timeout de disparition
                                if (this.noteChangeTimeout) {
                                    clearTimeout(this.noteChangeTimeout);
                                    this.noteChangeTimeout = null;
                                }
                            }
                            
                            // Vérifier correspondance avec les notes du jeu
                            if (this.isPlaying) {
                                this.checkNoteMatch(detectedNote, frequency);
                            }
                        }
                    }
                } else {
                    if (freqEl) freqEl.textContent = '0';
                    
                    // Si silence et on a une note affichée, programmer sa disparition
                    if (this.displayedNote && !this.noteChangeTimeout) {
                        this.noteChangeTimeout = setTimeout(() => {
                            this.displayedNote = null;
                            this.displayedFreq = 0;
                            
                            const noteEl = document.getElementById('playedNote');
                            const freqDisplayEl = document.getElementById('playedFreq');
                            if (noteEl && freqDisplayEl) {
                                noteEl.textContent = '-';
                                freqDisplayEl.textContent = '- Hz';
                            }
                            this.noteChangeTimeout = null;
                        }, 300);
                    }
                }
                
            } catch (error) {
                console.error('❌ Error in detectPitch:', error);
            }
            
            requestAnimationFrame(() => this.detectPitch());
        }
        
        // Détection de fréquence fondamentale optimisée pour les notes graves
        detectFundamentalFrequency(buffer) {
            const sampleRate = this.audioContext.sampleRate;
            const bufferSize = buffer.length;
            
            // Plage étendue pour violoncelle graves (50 Hz à 1200 Hz)
            const minPeriod = Math.floor(sampleRate / 1200); // 1200 Hz max
            const maxPeriod = Math.floor(sampleRate / 50);   // 50 Hz min (plus bas pour Do grave)
            
            // Calcul YIN avec ajustements pour les graves
            const yinBuffer = new Array(maxPeriod);
            yinBuffer[0] = 1;
            
            // Étape 1: Calcul de la différence avec fenêtrage
            for (let tau = 1; tau < maxPeriod && tau < bufferSize / 2; tau++) {
                yinBuffer[tau] = 0;
                const windowSize = Math.min(bufferSize - tau, bufferSize * 0.8); // Fenêtre adaptive
                
                for (let i = 0; i < windowSize; i++) {
                    const delta = buffer[i] - buffer[i + tau];
                    yinBuffer[tau] += delta * delta;
                }
                
                // Normaliser par la taille de fenêtre
                yinBuffer[tau] /= windowSize;
            }
            
            // Étape 2: Différence cumulative moyenne normalisée
            let runningSum = 0;
            for (let tau = 1; tau < maxPeriod; tau++) {
                runningSum += yinBuffer[tau];
                if (runningSum === 0) {
                    yinBuffer[tau] = 1;
                } else {
                    yinBuffer[tau] = yinBuffer[tau] * tau / runningSum;
                }
            }
            
            // Étape 3: Recherche adaptative selon la fréquence
            const candidates = [];
            
            // Seuils adaptatifs selon la fréquence
            const getThreshold = (tau) => {
                const freq = sampleRate / tau;
                if (freq < 100) return 0.25;  // Plus tolérant pour les graves
                if (freq < 200) return 0.20;  // Moyennement tolérant 
                return 0.15;  // Standard pour les aigus
            };
            
            // Chercher tous les candidats
            for (let tau = minPeriod; tau < maxPeriod; tau++) {
                const threshold = getThreshold(tau);
                
                if (yinBuffer[tau] < threshold) {
                    // Vérifier que c'est un minimum local
                    if ((tau === minPeriod || yinBuffer[tau] <= yinBuffer[tau - 1]) &&
                        (tau === maxPeriod - 1 || yinBuffer[tau] <= yinBuffer[tau + 1])) {
                        
                        candidates.push({
                            tau: tau,
                            value: yinBuffer[tau],
                            freq: sampleRate / tau
                        });
                    }
                }
            }
            
            if (candidates.length === 0) {
                return 0; // Pas de candidats fiables
            }
            
            // Étape 4: Validation harmonique pour les graves
            let bestCandidate = candidates[0];
            
            if (bestCandidate.freq < 150) {  // Pour les notes graves
                // Vérifier la présence d'harmoniques
                const fundamental = bestCandidate.freq;
                let harmonicScore = 0;
                
                // Chercher les harmoniques 2x, 3x, 4x
                for (let harmonic = 2; harmonic <= 4; harmonic++) {
                    const harmonicFreq = fundamental * harmonic;
                    const harmonicPeriod = sampleRate / harmonicFreq;
                    
                    if (harmonicPeriod >= minPeriod && harmonicPeriod < maxPeriod) {
                        const harmonicIndex = Math.round(harmonicPeriod);
                        if (harmonicIndex < yinBuffer.length && yinBuffer[harmonicIndex] < 0.3) {
                            harmonicScore += (1.0 / harmonic); // Pondération décroissante
                        }
                    }
                }
                
                // Si peu d'harmoniques détectées, vérifier si c'est un sous-harmonique
                if (harmonicScore < 0.5) {
                    // Chercher la fondamentale potentielle (octave supérieure)
                    const possibleFundamental = fundamental * 2;
                    const fundamentalPeriod = sampleRate / possibleFundamental;
                    
                    if (fundamentalPeriod >= minPeriod) {
                        const fundamentalIndex = Math.round(fundamentalPeriod);
                        if (fundamentalIndex < yinBuffer.length && 
                            yinBuffer[fundamentalIndex] < bestCandidate.value * 1.5) {
                            
                            // L'octave supérieure semble plus probable
                            bestCandidate = {
                                tau: fundamentalIndex,
                                value: yinBuffer[fundamentalIndex],
                                freq: possibleFundamental
                            };
                        }
                    }
                }
            }
            
            // Étape 5: Interpolation parabolique
            let refinedTau = bestCandidate.tau;
            const tau = bestCandidate.tau;
            
            if (tau > minPeriod && tau < maxPeriod - 1) {
                const y1 = yinBuffer[tau - 1];
                const y2 = yinBuffer[tau];
                const y3 = yinBuffer[tau + 1];
                
                const a = (y1 - 2 * y2 + y3) / 2;
                const b = (y3 - y1) / 2;
                
                if (a !== 0) {
                    const peakOffset = -b / (2 * a);
                    if (Math.abs(peakOffset) < 1) {
                        refinedTau = tau + peakOffset;
                    }
                }
            }
            
            const finalFreq = sampleRate / refinedTau;
            
            // Validation finale : la fréquence doit être dans une plage raisonnable
            if (finalFreq < 50 || finalFreq > 1200) {
                return 0;
            }
            
            return finalFreq;
        }
        
        frequencyToNote(frequency) {
            let closestNote = null;
            let minDifference = Infinity;
            let centsDifference = 0;
            
            for (const [note, freq] of Object.entries(NOTE_FREQUENCIES)) {
                const difference = Math.abs(frequency - freq);
                if (difference < minDifference) {
                    minDifference = difference;
                    closestNote = note;
                    centsDifference = Math.abs(1200 * Math.log2(frequency / freq));
                }
            }
            
            // Tolérance plus stricte : 50 cents maximum (1/4 de ton)
            if (closestNote && centsDifference < 50) {
                return closestNote;
            }
            
            return null;
        }
        
        setJudgment(type, text, details = null) {
            // ✅ NOUVEAU: Définir un jugement dynamique
            this.currentJudgment = {
                type: type,      // 'perfect', 'ok', 'timing_error', 'pitch_error'
                text: text,      // Texte principal à afficher
                details: details // Détails optionnels (ex: "-0.15s")
            };
            this.judgmentTime = Date.now();
            
            console.log(`🎯 Jugement: ${text} (${type})${details ? ' - ' + details : ''}`);
        }
        
        checkNoteMatch(detectedNote, frequency) {
            const currentTime = (Date.now() - this.startTime) / 1000;
            
            // ✅ CALCUL DELTA BASÉ SUR LE TEMPO
            const timeDelta = 24 / GAME_CONFIG.tempo; // Pour tempo 60: 0.4s
            
            for (const note of this.gameNotes) {
                if (note.played || note.missed) continue;
                
                // ✅ TIMING: Calculer par rapport au moment d'ARRIVÉE à la ligne de jeu
                const noteArrivalTime = note.timeAtHitLine;
                const timingDifference = currentTime - noteArrivalTime;
                
                // ✅ VÉRIFIER SI ON EST DANS LA FENÊTRE DE DÉTECTION
                if (Math.abs(timingDifference) <= timeDelta) {
                    
                    // ✅ VÉRIFIER SI C'EST LA BONNE NOTE (hauteur)
                    if (detectedNote === note.note) {
                        // Bonne note ! Maintenant analyser timing et justesse
                        const expectedFreq = NOTE_FREQUENCIES[note.note];
                        const centsDifference = Math.abs(getCentsDifference(expectedFreq, frequency));
                        
                        note.played = true;
                        
                        // ✅ ANALYSE DU TIMING (basé sur le delta)
                        let timingJudgment = '';
                        let isTimingPerfect = false;
                        let isTimingOk = false;
                        
                        const absTiming = Math.abs(timingDifference);
                        const quarterDelta = timeDelta / 4; // 0.1s pour tempo 60
                        const halfDelta = timeDelta / 2;    // 0.2s pour tempo 60
                        
                        if (absTiming <= quarterDelta) {
                            // ±0.1s : Parfait
                            timingJudgment = 'PARFAIT !';
                            isTimingPerfect = true;
                        } else if (absTiming <= halfDelta) {
                            // ±0.1s à ±0.2s : Ok
                            timingJudgment = 'OK';
                            isTimingOk = true;
                        } else {
                            // ±0.2s à ±0.4s : Trop tôt/tard
                            timingJudgment = timingDifference < 0 ? 'Trop tôt' : 'Trop tard';
                        }
                        
                        // ✅ ANALYSE DE LA JUSTESSE
                        let pitchJudgment = '';
                        let isPitchPerfect = false;
                        let isPitchOk = false;
                        
                        if (centsDifference <= GAME_CONFIG.perfectThreshold) {
                            pitchJudgment = 'Juste !';
                            isPitchPerfect = true;
                        } else if (centsDifference <= GAME_CONFIG.okThreshold) {
                            pitchJudgment = 'Proche';
                            isPitchOk = true;
                        } else {
                            pitchJudgment = 'Faux';
                        }
                        
                        // ✅ JUGEMENT FINAL ET AFFICHAGE
                        let finalJudgment = 'miss';
                        let points = 0;
                        let judgmentType = '';
                        let judgmentText = '';
                        let judgmentDetails = '';
                        
                        if (isTimingPerfect && isPitchPerfect) {
                            // Parfait sur les deux aspects
                            finalJudgment = 'perfect';
                            judgmentType = 'perfect';
                            judgmentText = 'PARFAIT !';
                            judgmentDetails = `${timingDifference >= 0 ? '+' : ''}${timingDifference.toFixed(2)}s, ${centsDifference.toFixed(0)} cents`;
                            points = 100 + (this.combo * 10);
                            this.combo++;
                        } else if ((isTimingPerfect || isTimingOk) && (isPitchPerfect || isPitchOk)) {
                            // Au moins OK sur les deux aspects
                            finalJudgment = 'ok';
                            judgmentType = 'ok';
                            judgmentText = 'OK';
                            judgmentDetails = `${timingJudgment}, ${pitchJudgment}`;
                            points = 50 + (this.combo * 5);
                            this.combo++;
                        } else if (!isTimingPerfect && !isTimingOk) {
                            // Problème de timing
                            finalJudgment = 'miss';
                            judgmentType = 'timing_error';
                            judgmentText = timingJudgment;
                            judgmentDetails = `${timingDifference >= 0 ? '+' : ''}${timingDifference.toFixed(2)}s`;
                            this.combo = 0;
                        } else {
                            // Problème de justesse
                            finalJudgment = 'miss';
                            judgmentType = 'pitch_error';
                            judgmentText = 'Fausse note';
                            judgmentDetails = `${centsDifference.toFixed(0)} cents d'écart`;
                            this.combo = 0;
                        }
                        
                        this.score += points;
                        this.setJudgment(judgmentType, judgmentText, judgmentDetails);
                        this.showJudgment(finalJudgment); // Pour l'ancien système aussi
                        this.updateUI();
                        
                        console.log(`🎯 Note ${note.note}: ${finalJudgment} (timing vs arrivée: ${timingDifference.toFixed(2)}s, justesse: ${centsDifference.toFixed(0)} cents, points: +${points})`);
                        break;
                    } else {
                        // ✅ MAUVAISE NOTE DÉTECTÉE dans la fenêtre
                        // Afficher l'erreur sans marquer la note comme jouée
                        this.setJudgment('pitch_error', 'Fausse note', `${detectedNote} au lieu de ${note.note}`);
                    }
                }
            }
        }
        
        showJudgment(judgment) {
            try {
                if (this.judgmentElement) {
                    this.judgmentElement.textContent = judgment.toUpperCase();
                    this.judgmentElement.className = `judgment ${judgment}`;
                    
                    setTimeout(() => {
                        this.judgmentElement.textContent = '';
                        this.judgmentElement.className = 'judgment';
                    }, 1000);
                }
            } catch (error) {
                console.warn('Error showing judgment:', error);
            }
        }
        
        stopMicrophone() {
            console.log('🛑 Stopping microphone...');
            this.microphoneActive = false;
            this.pitchDetectionActive = false;
            
            // Nettoyer les variables d'affichage
            this.displayedNote = null;
            this.displayedFreq = 0;
            if (this.noteChangeTimeout) {
                clearTimeout(this.noteChangeTimeout);
                this.noteChangeTimeout = null;
            }
            
            if (this.microphone) {
                try { this.microphone.disconnect(); } catch (e) {}
            }
            if (this.audioContext) {
                try { this.audioContext.close(); } catch (e) {}
            }
            
            this.micBtn.textContent = '🎤 Activer Microphone';
            this.micBtn.style.backgroundColor = '#4CAF50';
            this.micStatusElement.textContent = 'Désactivé';
            this.debugStatusElement.textContent = 'Microphone arrêté';
            
            this.playedNoteElement.textContent = '-';
            this.playedFreqElement.textContent = '- Hz';
            this.frequencyElement.textContent = '0';
            this.volumeElement.textContent = '0';
        }
        
        async startGame() {
            console.log('🚀 Starting complete game...');
            
            try {
                if (!this.microphoneActive) {
                    await this.initializeAudio();
                    setTimeout(() => this.startPitchDetection(), 500);
                }
                
                this.isPlaying = true;
                this.startTime = Date.now();
                this.score = 0;
                this.combo = 0;
                await this.initializeGameNotes(); // Await pour le XML parsing
                
                this.startBtn.disabled = true;
                this.stopBtn.disabled = false;
                this.debugStatusElement.textContent = 'Jeu en cours - Jouez les notes !';
                
                console.log('✅ Game started successfully');
                
            } catch (error) {
                console.error('❌ Error starting game:', error);
                this.debugStatusElement.textContent = 'Erreur: ' + error.message;
                this.isPlaying = false;
                this.startBtn.disabled = false;
                this.stopBtn.disabled = true;
            }
        }
        
        stopGame() {
            console.log('⏹️ Stopping game...');
            this.isPlaying = false;
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.debugStatusElement.textContent = this.microphoneActive ? 'Microphone actif - Prêt pour l\'accordage' : 'Jeu arrêté';
            
            if (this.judgmentElement) {
                this.judgmentElement.textContent = '';
                this.judgmentElement.className = 'judgment';
            }
        }
        
        showDebugInfo() {
            console.log('🔧 DEBUG INFO v2.6.1 - TIMING CORRIGÉ (Basé sur l\'arrivée réelle à la ligne de jeu):');
            console.log(`Microphone: ${this.microphoneActive ? 'Actif' : 'Inactif'}`);
            console.log(`Détection: ${this.pitchDetectionActive ? 'Active (YIN Graves+)' : 'Inactive'}`);
            console.log(`Jeu: ${this.isPlaying ? 'En cours' : 'Arrêté'}`);
            console.log(`Score: ${this.score}, Combo: ${this.combo}`);
            console.log(`Note détectée: ${this.lastDetectedNote || 'Aucune'}`);
            console.log(`Note affichée: ${this.displayedNote || 'Aucune'}`);
            console.log(`Fréquence mesurée: ${this.displayedFreq.toFixed(2)} Hz`);
            
            // Stats de la mélodie
            const totalNotes = this.gameNotes.length;
            const playedNotes = this.gameNotes.filter(n => n.played).length;
            const missedNotes = this.gameNotes.filter(n => n.missed).length;
            const visibleNotes = this.gameNotes.filter(n => n.x > 120 && n.x < this.canvas.width + 50).length;
            
            console.log(`🎼 MÉLODIE (Ave Maria à 60 BPM):`);
            console.log(`  Total: ${totalNotes} notes`);
            console.log(`  Visibles: ${visibleNotes} notes`);
            console.log(`  Jouées: ${playedNotes}, Ratées: ${missedNotes}`);
            console.log(`  Progression: ${Math.round(((playedNotes + missedNotes) / totalNotes) * 100)}%`);
            console.log(`  Tempo: ${GAME_CONFIG.tempo} BPM, Vitesse: ${GAME_CONFIG.scrollSpeed} px/s`);
            
            // Debug des premières notes visibles avec durées
            const visibleNotesArray = this.gameNotes.filter(n => n.x > 120 && n.x < this.canvas.width + 50);
            if (visibleNotesArray.length > 0) {
                console.log(`🎵 NOTES VISIBLES (zone droite uniquement):`);
                for (let i = 0; i < Math.min(5, visibleNotesArray.length); i++) {
                    const note = visibleNotesArray[i];
                    const noteType = note.duration === 8 ? 'RONDE' : note.duration === 4 ? 'BLANCHE' : note.duration === 2 ? 'NOIRE' : 'AUTRE';
                    console.log(`  ${note.note} (${noteType}) - début:${Math.round(note.x)}, largeur:${Math.round(note.width)}px, durée:${note.durationInSeconds}s`);
                }
            } else {
                console.log(`❌ AUCUNE NOTE VISIBLE !`);
                if (totalNotes > 0) {
                    console.log(`🔍 DEBUG - Premières notes du jeu:`);
                    for (let i = 0; i < Math.min(5, totalNotes); i++) {
                        const note = this.gameNotes[i];
                        const noteType = note.duration === 8 ? 'RONDE' : note.duration === 4 ? 'BLANCHE' : note.duration === 2 ? 'NOIRE' : 'AUTRE';
                        console.log(`  ${note.note} (${noteType}) - début:${Math.round(note.x)}, startTime:${note.startTime}, currentTime:${this.currentTime}`);
                    }
                }
            }
            
            console.log(`📊 MESURES: ${this.measures.length} mesures chargées et synchronisées`);
            
            // Comparaison avec les fréquences théoriques
            if (this.displayedNote && NOTE_FREQUENCIES[this.displayedNote]) {
                const theoreticalFreq = NOTE_FREQUENCIES[this.displayedNote];
                const actualFreq = this.displayedFreq;
                const centsDiff = 1200 * Math.log2(actualFreq / theoreticalFreq);
                
                console.log(`🎯 COMPARAISON ACCORDEUR:`);
                console.log(`  ${this.displayedNote} théorique: ${theoreticalFreq.toFixed(2)} Hz`);
                console.log(`  ${this.displayedNote} mesurée: ${actualFreq.toFixed(2)} Hz`);
                console.log(`  Différence: ${centsDiff.toFixed(1)} cents`);
                console.log(`  Statut: ${Math.abs(centsDiff) < 10 ? '✅ Accordé' : Math.abs(centsDiff) < 25 ? '⚠️ Proche' : '❌ Désaccordé'}`);
                
                // Debug spécial pour les graves
                if (actualFreq < 120) {
                    console.log(`🎻 ANALYSE GRAVES (< 120 Hz):`);
                    console.log(`  Type: ${ actualFreq < 70 ? 'Très grave (Do-Ré)' : actualFreq < 90 ? 'Grave (Mi-Fa)' : 'Grave moyen (Sol-La)' }`);
                    console.log(`  Optimisations actives: Seuils adaptatifs + Validation harmonique`);
                }
            }
            
            console.log(`Volume: ${this.currentVolume} dB`);
            console.log(`Notes actives: ${this.gameNotes.filter(n => !n.played && !n.missed).length}`);
            console.log(`🎯 ARCHITECTURE COMPLÈTE v2.6.1:`);
            console.log(`  Zone gauche (0-120px): Clé de fa + jugements dynamiques`);
            console.log(`  Zone droite (120px+): Portée + notes avec clipping`);
            console.log(`  Ligne de jeu: x=${GAME_CONFIG.hitLineX}px`);
            console.log(`  Delta timing: ${(24/GAME_CONFIG.tempo).toFixed(1)}s pour tempo ${GAME_CONFIG.tempo}`);
            console.log(`  ✅ TIMING CORRIGÉ: Basé sur l'arrivée réelle des notes à la ligne de jeu`);
            console.log(`  Plages de timing (après arrivée à la ligne):`);
            console.log(`    -${(24/GAME_CONFIG.tempo).toFixed(1)}s à -${(12/GAME_CONFIG.tempo).toFixed(1)}s : Trop tôt`);
            console.log(`    -${(12/GAME_CONFIG.tempo).toFixed(1)}s à -${(6/GAME_CONFIG.tempo).toFixed(1)}s : OK`);
            console.log(`    -${(6/GAME_CONFIG.tempo).toFixed(1)}s à +${(6/GAME_CONFIG.tempo).toFixed(1)}s : PARFAIT`);
            console.log(`    +${(6/GAME_CONFIG.tempo).toFixed(1)}s à +${(12/GAME_CONFIG.tempo).toFixed(1)}s : OK`);
            console.log(`    +${(12/GAME_CONFIG.tempo).toFixed(1)}s à +${(24/GAME_CONFIG.tempo).toFixed(1)}s : Trop tard`);
            
            // Debug des premières notes avec leurs temps d'arrivée
            if (this.gameNotes.length > 0) {
                console.log(`📋 TIMING DES PREMIÈRES NOTES:`);
                for (let i = 0; i < Math.min(5, this.gameNotes.length); i++) {
                    const note = this.gameNotes[i];
                    const noteType = note.duration === 8 ? 'RONDE' : note.duration === 4 ? 'BLANCHE' : note.duration === 2 ? 'NOIRE' : 'AUTRE';
                    console.log(`  ${note.note} (${noteType}): morceau=${note.startTimeInSeconds.toFixed(1)}s → arrivée ligne=${note.timeAtHitLine.toFixed(1)}s`);
                }
            }
            
            this.debugStatusElement.textContent = 'Debug v2.6.1 (Timing corrigé) affiché en console (F12)';
        }
        
        setupCanvas() {
            if (!this.canvas) return;
            
            const container = this.canvas.parentElement;
            const width = Math.min(800, container.clientWidth - 20);
            const height = 200;
            
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
            
            console.log(`✅ Canvas setup: ${width}x${height}`);
        }
        
        async loadXMLFile() {
            console.log('📁 Attempting to load sheet1.xml...');
            
            try {
                const response = await fetch('./sheet1.xml');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const xmlText = await response.text();
                console.log('✅ sheet1.xml loaded successfully');
                return xmlText;
                
            } catch (error) {
                console.error('❌ Failed to load sheet1.xml:', error);
                throw error;
            }
        }
        
        async parseXMLMelody() {
            console.log('🎼 Parsing MusicXML data from sheet1.xml...');
            
            try {
                // Charger le fichier XML
                const xmlContent = await this.loadXMLFile();
                
                // Parser le XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
                
                // Vérifier les erreurs de parsing
                const parseError = xmlDoc.querySelector('parsererror');
                if (parseError) {
                    throw new Error('Erreur lors du parsing XML: ' + parseError.textContent);
                }
                
                // Extraire les paramètres
                const divisionsElement = xmlDoc.querySelector('divisions');
                const divisions = divisionsElement ? parseInt(divisionsElement.textContent) : 2;
                console.log(`📏 Divisions trouvées: ${divisions} (1 noire = ${divisions} unités)`);
                
                // ✅ CORRECTION: Extraire la transposition et l'inverser
                const transposeElement = xmlDoc.querySelector('transpose');
                let chromaticTranspose = 0;
                if (transposeElement) {
                    const chromaticElement = transposeElement.querySelector('chromatic');
                    if (chromaticElement) {
                        // ✅ CORRECTION: Inverser la transposition 
                        // XML: +12 = écrit 1 octave plus haut que la réalité
                        // Donc on applique -12 pour avoir les vraies notes
                        chromaticTranspose = -parseInt(chromaticElement.textContent);
                        console.log(`🎵 Transposition XML: ${-chromaticTranspose}, appliquée: ${chromaticTranspose} demi-tons`);
                    }
                }
                
                // ✅ NOUVEAU: Extraire les mesures
                const measureElements = xmlDoc.querySelectorAll('measure');
                console.log(`📊 ${measureElements.length} mesures trouvées dans le XML`);
                
                const melody = [];
                const measures = []; // ✅ NOUVEAU: Array des mesures
                
                // ✅ CORRECTION: Calculer les temps de mesure de manière absolue
                for (const measureElement of measureElements) {
                    const measureNumber = parseInt(measureElement.getAttribute('number'));
                    
                    // ✅ CORRECTION: Temps absolu basé sur le numéro de mesure + correction décalage
                    // Chaque mesure fait 4 temps (4/4), soit 8 unités XML (divisions=2)
                    // CORRECTION: Décalage de 2 temps (4 unités XML) pour synchroniser
                    const measureStartTime = (measureNumber - 1) * 8 - 4; // Correction de -2 temps
                    
                    // ✅ NOUVEAU: Ajouter la mesure avec temps absolu
                    measures.push({
                        number: measureNumber,
                        startTime: measureStartTime, // En unités XML
                        xmlTime: measureStartTime
                    });
                    
                    // ✅ CORRECTION: Traiter les notes avec position relative dans la mesure
                    const noteElements = measureElement.querySelectorAll('note');
                    let notePositionInMeasure = 0; // Position actuelle dans cette mesure
                    
                    for (const noteElement of noteElements) {
                        const restElement = noteElement.querySelector('rest');
                        const durationElement = noteElement.querySelector('duration');
                        
                        if (!durationElement) continue;
                        
                        const duration = parseInt(durationElement.textContent);
                        
                        if (restElement) {
                            // C'est un silence, avancer la position dans la mesure sans ajouter de note
                            notePositionInMeasure += duration;
                            continue;
                        }
                        
                        const pitchElement = noteElement.querySelector('pitch');
                        if (!pitchElement) {
                            notePositionInMeasure += duration;
                            continue;
                        }
                        
                        const stepElement = pitchElement.querySelector('step');
                        const octaveElement = pitchElement.querySelector('octave');
                        const alterElement = pitchElement.querySelector('alter');
                        
                        if (!stepElement || !octaveElement) {
                            notePositionInMeasure += duration;
                            continue;
                        }
                        
                        const step = stepElement.textContent;
                        let octave = parseInt(octaveElement.textContent);
                        const alter = alterElement ? parseInt(alterElement.textContent) : 0;
                        
                        // ✅ NOUVEAU: Appliquer la transposition
                        let transposedNote = this.transposeNote(step, octave, alter, chromaticTranspose);
                        
                        // ✅ CORRECTION: Temps absolu = temps de la mesure + position dans la mesure
                        const absoluteTime = measureStartTime + notePositionInMeasure;
                        
                        melody.push({
                            note: transposedNote,
                            duration: duration,
                            startTime: absoluteTime, // ✅ CORRECTION: Temps absolu précis
                            measureNumber: measureNumber // ✅ NOUVEAU: Numéro de mesure
                        });
                        
                        notePositionInMeasure += duration;
                    }
                }
                
                // ✅ NOUVEAU: Stocker les mesures dans l'instance
                this.measures = measures;
                
                console.log(`✅ ${melody.length} notes extraites du MusicXML avec transposition`);
                console.log(`✅ ${measures.length} mesures extraites du MusicXML`);
                
                // Debug: afficher les premières notes
                console.log('🎼 Premières notes après transposition:');
                for (let i = 0; i < Math.min(10, melody.length); i++) {
                    console.log(`  ${i+1}. ${melody[i].note} (mesure ${melody[i].measureNumber}, durée: ${melody[i].duration}, temps: ${melody[i].startTime})`);
                }
                
                // Debug: afficher les premières mesures
                console.log('📊 Premières mesures:');
                for (let i = 0; i < Math.min(10, measures.length); i++) {
                    console.log(`  Mesure ${measures[i].number}: temps ${measures[i].startTime}`);
                }
                
                return melody;
                
            } catch (error) {
                console.error('❌ Erreur lors du parsing XML:', error);
                throw error;
            }
        }
        
        // ✅ NOUVELLE FONCTION: Transposer une note
        transposeNote(step, octave, alter, chromaticTranspose) {
            // Définir l'ordre chromatique des notes
            const chromaticSteps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            
            // Convertir la note en index chromatique
            let stepIndex = chromaticSteps.indexOf(step);
            if (stepIndex === -1) {
                console.warn(`Note inconnue: ${step}`);
                return `${step}${octave}`;
            }
            
            // Ajouter l'altération (dièse/bémol)
            stepIndex += alter;
            
            // Ajouter la transposition
            let totalSemitones = (octave * 12) + stepIndex + chromaticTranspose;
            
            // Calculer la nouvelle octave et la nouvelle note
            const newOctave = Math.floor(totalSemitones / 12);
            const newStepIndex = ((totalSemitones % 12) + 12) % 12; // Gérer les nombres négatifs
            
            const newStep = chromaticSteps[newStepIndex];
            const finalNote = `${newStep}${newOctave}`;
            
            return finalNote;
        }
        
        async initializeGameNotes() {
            console.log('🎼 Initializing melody from sheet1.xml...');
            
            let melodyToUse = FALLBACK_MELODY;
            
            try {
                // Essayer de parser le XML
                melodyToUse = await this.parseXMLMelody();
                console.log('✅ Ave Maria complète chargée depuis sheet1.xml');
            } catch (error) {
                console.error('⚠️ Erreur lors du chargement du XML:', error);
                console.log('⚠️ Utilisation de la mélodie de test à la place');
                
                // ✅ NOUVEAU: Créer des mesures de fallback
                this.measures = [
                    { number: 1, startTime: 0 },
                    { number: 2, startTime: 16 },
                    { number: 3, startTime: 32 }
                ];
            }
            
            this.gameNotes = melodyToUse.map((noteData, index) => {
                // ✅ CORRECTION TEMPO: À 60 BPM, 1 noire = 1 seconde
                // Les durées du XML sont en divisions (2 = noire), donc duration/2 = durée en noires
                const durationInBeats = noteData.duration / 2; // Convertir divisions XML en noires
                const durationInSeconds = durationInBeats * (60 / GAME_CONFIG.tempo); // À 60 BPM
                const startTimeInBeats = noteData.startTime / 2; // Convertir startTime XML en noires
                const startTimeInSeconds = startTimeInBeats * (60 / GAME_CONFIG.tempo); // À 60 BPM
                
                // ✅ FIX ALIGNEMENT: Position de départ pour que la note COMMENCE à la ligne de jeu au bon moment
                // Calculer où la note doit être maintenant pour arriver à la ligne de jeu au bon moment
                const startX = this.canvas.width + 200 + (startTimeInSeconds * GAME_CONFIG.scrollSpeed);
                
                // ✅ LARGEUR CORRECTE: Proportionnelle à la durée en secondes
                const noteWidth = durationInSeconds * GAME_CONFIG.scrollSpeed;
                
                // ✅ NOUVEAU: Calculer le moment où la note arrive à la ligne de jeu
                const timeAtHitLine = startTimeInSeconds + (this.canvas.width + 200 - GAME_CONFIG.hitLineX) / GAME_CONFIG.scrollSpeed;
                
                return {
                    ...noteData,
                    x: startX, // ✅ FIX: Position où la note COMMENCE (pas le centre)
                    y: STAFF_POSITIONS[noteData.note] || 90,
                    width: Math.max(noteWidth, 15), // Largeur minimum de 15px
                    durationInSeconds: durationInSeconds, // Stocker pour debug
                    startTimeInSeconds: startTimeInSeconds, // Temps de départ en secondes
                    timeAtHitLine: timeAtHitLine, // ✅ NOUVEAU: Moment où la note arrive à la ligne de jeu
                    played: false,
                    missed: false,
                    id: index
                };
            });
            
            console.log(`✅ ${this.gameNotes.length} notes d'Ave Maria initialisées avec timing précis (60 BPM)`);
            console.log(`✅ ${this.measures.length} mesures initialisées`);
            
            // Afficher quelques exemples dans la console
            if (this.gameNotes.length > 0) {
                console.log('📋 Exemples de notes avec timing d\'arrivée (60 BPM):');
                for (let i = 0; i < Math.min(5, this.gameNotes.length); i++) {
                    const note = this.gameNotes[i];
                    const measureInfo = note.measureNumber ? ` (mesure ${note.measureNumber})` : '';
                    const noteType = note.duration === 8 ? 'RONDE' : note.duration === 4 ? 'BLANCHE' : note.duration === 2 ? 'NOIRE' : 'AUTRE';
                    console.log(`  ${note.note}: ${noteType}, morceau=${note.startTimeInSeconds.toFixed(1)}s, arrivée=${note.timeAtHitLine.toFixed(1)}s${measureInfo}`);
                }
            }
        }
        
        updateUI() {
            try {
                if (this.scoreElement) this.scoreElement.textContent = this.score;
                if (this.comboElement) this.comboElement.textContent = this.combo;
                
                if (this.isPlaying) {
                    if (this.gameTimeElement) this.gameTimeElement.textContent = this.currentTime.toFixed(1);
                    
                    const activeNotes = this.gameNotes.filter(n => 
                        n.x > 120 && n.x < this.canvas.width + 50 && !n.played && !n.missed
                    ).length;
                    if (this.activeNotesElement) this.activeNotesElement.textContent = activeNotes;
                }
            } catch (error) {
                console.warn('Error updating UI:', error);
            }
        }
        
        animate() {
            try {
                if (!this.ctx) return;
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                if (this.isPlaying) {
                    this.currentTime = (Date.now() - this.startTime) / 1000;
                    this.updateGameNotes();
                    this.checkMissedNotes();
                }
                
                // ✅ NOUVEAU ORDRE : Zone gauche d'abord (fixe)
                this.drawLeftZone(); // Clé de fa + indicateurs (zone fixe)
                
                // Zone droite (avec mouvement)
                this.drawStaff();
                this.drawMeasureBars();
                this.drawGameNotes();
                this.drawHitLine();
                this.drawPlayedNote(); // Note jouée en temps réel
                this.updateUI();
                
            } catch (error) {
                console.error('Animation error:', error);
            }
            
            requestAnimationFrame(() => this.animate());
        }
        
        updateGameNotes() {
            // ✅ SYNCHRONISATION: Même méthode que les mesures - basée sur currentTime
            const currentGameTime = this.currentTime;
            
            for (const note of this.gameNotes) {
                // ✅ FIX ALIGNEMENT: Calculer la position X basée sur le temps de jeu actuel
                // La note COMMENCE à sa position initiale et se déplace vers la gauche
                const initialX = this.canvas.width + 200 + (note.startTimeInSeconds * GAME_CONFIG.scrollSpeed);
                note.x = initialX - (currentGameTime * GAME_CONFIG.scrollSpeed);
            }
        }
        
        checkMissedNotes() {
            // ✅ CALCUL DELTA BASÉ SUR LE TEMPO
            const timeDelta = 24 / GAME_CONFIG.tempo; // Pour tempo 60: 0.4s
            const currentTime = (Date.now() - this.startTime) / 1000;
            
            for (const note of this.gameNotes) {
                if (note.played || note.missed) continue;
                
                // ✅ NOTE RATÉE: Quand on dépasse la fenêtre de timing APRÈS l'arrivée à la ligne de jeu
                const noteArrivalTime = note.timeAtHitLine;
                const timingDifference = currentTime - noteArrivalTime;
                
                if (timingDifference > timeDelta) {
                    // Note ratée car pas jouée dans la fenêtre de temps après son arrivée
                    note.missed = true;
                    this.combo = 0;
                    
                    // Afficher le jugement de note ratée
                    this.setJudgment('timing_error', 'Note ratée', `+${timingDifference.toFixed(2)}s trop tard`);
                    
                    const noteType = note.duration === 8 ? 'RONDE' : note.duration === 4 ? 'BLANCHE' : note.duration === 2 ? 'NOIRE' : 'AUTRE';
                    console.log(`❌ Note ratée: ${note.note} (${noteType}) - arrivée à ${noteArrivalTime.toFixed(1)}s, ratée à ${currentTime.toFixed(1)}s (+${timingDifference.toFixed(2)}s)`);
                }
            }
        }
        
        drawStaff() {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            
            for (const y of GAME_CONFIG.staffLineY) {
                this.ctx.beginPath();
                this.ctx.moveTo(120, y); // Commencer à x=120 (après la zone gauche)
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
        
        drawLeftZone() {
            // ✅ ZONE GAUCHE FIXE : Clé de fa + indicateurs
            
            // Fond légèrement différent pour la zone gauche
            this.ctx.fillStyle = '#111111';
            this.ctx.fillRect(0, 0, 120, this.canvas.height);
            
            // Bordure de séparation
            this.ctx.strokeStyle = '#444444';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(120, 0);
            this.ctx.lineTo(120, this.canvas.height);
            this.ctx.stroke();
            
            // Clé de fa
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 35px serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('𝄢', 60, 90); // Centré dans la zone gauche
            
            // Indicateurs de jugement intégrés
            this.drawJudgmentIndicators();
        }
        
        drawJudgmentIndicators() {
            // ✅ AFFICHAGE DYNAMIQUE : Seulement si un jugement est actif
            if (!this.currentJudgment) return;
            
            // Vérifier si le jugement doit encore être affiché
            const timeSinceJudgment = Date.now() - this.judgmentTime;
            if (timeSinceJudgment > this.judgmentDuration) {
                this.currentJudgment = null;
                return;
            }
            
            // Calculer l'opacité (fade out progressif)
            const opacity = Math.max(0, 1 - (timeSinceJudgment / this.judgmentDuration));
            
            // Couleurs selon le type de jugement
            let color = '#FFFFFF';
            let bgColor = '#000000';
            
            switch (this.currentJudgment.type) {
                case 'perfect':
                    color = '#FFFF00'; // Jaune fluo
                    bgColor = '#333300';
                    break;
                case 'ok':
                    color = '#00FF00'; // Vert
                    bgColor = '#003300';
                    break;
                case 'timing_error':
                    color = '#FF8800'; // Orange
                    bgColor = '#332200';
                    break;
                case 'pitch_error':
                    color = '#FF0000'; // Rouge
                    bgColor = '#330000';
                    break;
                default:
                    color = '#CCCCCC';
                    bgColor = '#222222';
            }
            
            // Appliquer l'opacité
            const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
            color += hexOpacity;
            bgColor += hexOpacity;
            
            // Dessiner le fond du jugement
            this.ctx.fillStyle = bgColor;
            this.ctx.fillRect(10, 120, 100, 50);
            
            // Bordure
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(10, 120, 100, 50);
            
            // Texte principal
            this.ctx.fillStyle = color;
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.currentJudgment.text, 60, 135);
            
            // Détails supplémentaires (timing/pitch)
            if (this.currentJudgment.details) {
                this.ctx.font = '10px Arial';
                this.ctx.fillText(this.currentJudgment.details, 60, 155);
            }
        }
        
        drawMeasureBars() {
            if (!this.measures || this.measures.length === 0) return;
            
            // ✅ CLIPPING: Limiter les barres de mesure à la zone droite
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.rect(120, 0, this.canvas.width - 120, this.canvas.height);
            this.ctx.clip();
            
            // ✅ SYNCHRONISATION: Même calcul que les notes
            const currentGameTime = this.isPlaying ? this.currentTime : 0;
            
            this.ctx.strokeStyle = '#888888'; // Gris pour les barres de mesure
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([]);
            
            // Font pour les numéros de mesure
            this.ctx.fillStyle = '#CCCCCC';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            
            for (const measure of this.measures) {
                // ✅ CORRECTION: Utiliser exactement la même logique que les notes
                const timeInBeats = measure.startTime / 2; // Convertir en noires
                const timeInSeconds = timeInBeats * (60 / GAME_CONFIG.tempo); // À 60 BPM
                
                // ✅ CORRECTION: Même formule que updateGameNotes()
                const measureX = (this.canvas.width + 200) + (timeInSeconds * GAME_CONFIG.scrollSpeed) - (currentGameTime * GAME_CONFIG.scrollSpeed);
                
                // Ne dessiner que les barres visibles dans la zone droite
                if (measureX < 120 || measureX > this.canvas.width + 50) continue;
                
                // Dessiner la barre verticale
                this.ctx.beginPath();
                this.ctx.moveTo(measureX, 40); // Un peu au-dessus de la portée
                this.ctx.lineTo(measureX, 140); // Un peu en-dessous de la portée
                this.ctx.stroke();
                
                // Dessiner le numéro de mesure au-dessus
                this.ctx.fillText(measure.number.toString(), measureX, 35);
            }
            
            // ✅ RESTAURER: Retirer le clipping
            this.ctx.restore();
        }
        
        drawGameNotes() {
            let visibleCount = 0;
            
            if (!this.gameNotes || this.gameNotes.length === 0) {
                console.warn('❌ Aucune note dans gameNotes !');
                return;
            }
            
            // ✅ CLIPPING: Limiter le rendu des notes à la zone droite (x ≥ 120)
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.rect(120, 0, this.canvas.width - 120, this.canvas.height);
            this.ctx.clip();
            
            for (const note of this.gameNotes) {
                // Vérifier si la note est visible dans la zone droite
                if (note.x + note.width < 120 || note.x > this.canvas.width + 50) continue;
                visibleCount++;
                
                let color = '#4CAF50';  // Vert pour les notes à venir
                let strokeColor = '#2E7D32';
                
                if (note.played) {
                    color = '#2196F3';  // Bleu pour les notes jouées
                    strokeColor = '#1976D2';
                } else if (note.missed) {
                    color = '#f44336';  // Rouge pour les notes ratées
                    strokeColor = '#D32F2F';
                }
                
                // Dessiner la note avec largeur proportionnelle à la durée
                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 2;
                
                // ✅ FIX ALIGNEMENT: Formes selon la durée ALIGNÉES AU DÉBUT
                if (note.width <= 30) {
                    // Notes courtes : cercle classique au DÉBUT de la note
                    this.ctx.beginPath();
                    this.ctx.arc(note.x + GAME_CONFIG.noteRadius, note.y, GAME_CONFIG.noteRadius, 0, 2 * Math.PI);
                    this.ctx.fill();
                    this.ctx.stroke();
                } else {
                    // ✅ FIX ALIGNEMENT: Notes longues : rectangle arrondi qui COMMENCE à note.x
                    const height = GAME_CONFIG.noteRadius * 1.4; // Réduit de 1.8 à 1.4 pour des notes plus fines
                    const radius = Math.min(6, note.width / 8); // Légèrement réduit aussi
                    
                    // Rectangle principal représentant la durée, ALIGNÉ au DÉBUT
                    this.ctx.beginPath();
                    this.ctx.roundRect(note.x, note.y - height/2, note.width, height, radius);
                    this.ctx.fill();
                    this.ctx.stroke();
                    
                    // ✅ FIX ALIGNEMENT: Tête de note au DÉBUT (pas décalée)
                    this.ctx.fillStyle = strokeColor; // Couleur plus foncée pour la tête
                    this.ctx.beginPath();
                    this.ctx.arc(note.x + GAME_CONFIG.noteRadius, note.y, GAME_CONFIG.noteRadius - 1, 0, 2 * Math.PI);
                    this.ctx.fill();
                    
                    // Pour les rondes (duration=8), dessiner différemment
                    if (note.duration === 8) {
                        // Contour de ronde (note creuse)
                        this.ctx.fillStyle = '#000000'; // Fond noir pour faire le trou
                        this.ctx.beginPath();
                        this.ctx.arc(note.x + GAME_CONFIG.noteRadius, note.y, GAME_CONFIG.noteRadius - 3, 0, 2 * Math.PI); // Réduit de -4 à -3
                        this.ctx.fill();
                    }
                }
                
                // Afficher le nom de la note (pendant la première minute)
                if (this.currentTime < 60) {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 11px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    const frenchName = getNoteFrenchName(note.note);
                    // ✅ FIX ALIGNEMENT: Centrer le texte sur le DÉBUT de la note
                    this.ctx.fillText(frenchName, note.x + GAME_CONFIG.noteRadius, note.y - 25);
                    
                    // Afficher la durée pour debug (premières 10 secondes)
                    if (this.currentTime < 10) {
                        this.ctx.font = '9px Arial';
                        this.ctx.fillStyle = '#ccc';
                        const durationText = note.duration === 8 ? 'RONDE' : note.duration === 4 ? 'BLANCHE' : note.duration === 2 ? 'NOIRE' : note.duration.toString();
                        this.ctx.fillText(durationText, note.x + GAME_CONFIG.noteRadius, note.y + 25);
                    }
                }
                
                // ✅ FIX ALIGNEMENT: Lignes supplémentaires centrées sur le DÉBUT de la note
                this.drawLedgerLines(note, strokeColor);
            }
            
            // ✅ RESTAURER: Retirer le clipping
            this.ctx.restore();
            
            // Debug: afficher le nombre de notes visibles
            if (this.isPlaying && visibleCount === 0) {
                console.warn(`⚠️ Aucune note visible ! Total notes: ${this.gameNotes.length}, temps: ${this.currentTime.toFixed(2)}s`);
            }
        }
        
        drawLedgerLines(note, strokeColor) {
            const staffLines = GAME_CONFIG.staffLineY;
            // ✅ FIX ALIGNEMENT: Centrer les lignes sur le DÉBUT de la note
            const noteCenterX = note.x + GAME_CONFIG.noteRadius;
            
            if (note.y < staffLines[0] - 5) {
                // Lignes au-dessus
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 1;
                let lineY = staffLines[0] - 20;
                while (lineY >= note.y - 10) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(noteCenterX - 12, lineY); // Réduit de 15 à 12
                    this.ctx.lineTo(noteCenterX + 12, lineY);
                    this.ctx.stroke();
                    lineY -= 20;
                }
            } else if (note.y > staffLines[4] + 5) {
                // Lignes en-dessous
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 1;
                let lineY = staffLines[4] + 20;
                while (lineY <= note.y + 10) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(noteCenterX - 12, lineY); // Réduit de 15 à 12
                    this.ctx.lineTo(noteCenterX + 12, lineY);
                    this.ctx.stroke();
                    lineY += 20;
                }
            }
        }
        
        drawHitLine() {
            // ✅ AJUSTER: Ligne de jeu dans la zone droite 
            const hitLineX = GAME_CONFIG.hitLineX; // Utiliser la config (180px)
            
            this.ctx.strokeStyle = '#FF5722';
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([12, 6]);
            this.ctx.beginPath();
            this.ctx.moveTo(hitLineX, 20);
            this.ctx.lineTo(hitLineX, 160);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // Indicateur "Jouez ici"
            this.ctx.fillStyle = '#FF5722';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('♪ Jouez ici ♪', hitLineX, 15);
        }
        
        drawPlayedNote() {
            // Dessiner la note actuellement jouée sur la portée
            if (!this.microphoneActive || !this.displayedNote) {
                return;
            }
            
            // Position Y de la note sur la portée
            let noteY = STAFF_POSITIONS[this.displayedNote];
            
            // Si la note n'est pas dans la table, calculer sa position
            if (noteY === undefined) {
                console.warn(`Position non définie pour ${this.displayedNote}, calcul automatique`);
                // Calculer la position basée sur la fréquence (fallback)
                const baseFreq = NOTE_FREQUENCIES['C3'] || 130.81;
                const currentFreq = NOTE_FREQUENCIES[this.displayedNote] || this.displayedFreq;
                const semitonesFromC3 = Math.round(12 * Math.log2(currentFreq / baseFreq));
                noteY = 130 - (semitonesFromC3 * 10); // 10 pixels par demi-ton
            }
            
            // Position X = ligne de jeu (nouvelle position)
            const noteX = GAME_CONFIG.hitLineX; // 180px
            
            // Couleur spéciale pour la note jouée (jaune/orange brillant)
            const playedColor = '#FFC107'; // Jaune ambré
            const playedStroke = '#FF8F00'; // Orange foncé
            
            // Dessiner la note avec un effet lumineux
            this.ctx.shadowColor = playedColor;
            this.ctx.shadowBlur = 15;
            
            this.ctx.fillStyle = playedColor;
            this.ctx.strokeStyle = playedStroke;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(noteX, noteY, GAME_CONFIG.noteRadius + 1, 0, 2 * Math.PI); // Réduit de +2 à +1
            this.ctx.fill();
            this.ctx.stroke();
            
            // Réinitialiser l'ombre
            this.ctx.shadowBlur = 0;
            
            // Dessiner les lignes supplémentaires si nécessaire
            this.drawLedgerLinesForPlayedNote(noteX, noteY, playedStroke);
            
            // Afficher le nom de la note au-dessus
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 3;
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Contour noir pour lisibilité
            this.ctx.strokeText(getNoteFrenchName(this.displayedNote), noteX, noteY - 25);
            // Texte blanc par-dessus
            this.ctx.fillText(getNoteFrenchName(this.displayedNote), noteX, noteY - 25);
            
            // Indicateur de fréquence précise (petit texte)
            this.ctx.font = '10px Arial';
            this.ctx.fillStyle = '#CCCCCC';
            this.ctx.fillText(`${this.displayedFreq.toFixed(1)} Hz`, noteX, noteY + 25);
        }
        
        drawLedgerLinesForPlayedNote(noteX, noteY, strokeColor) {
            const staffLines = GAME_CONFIG.staffLineY;
            
            if (noteY < staffLines[0] - 5) {
                // Lignes au-dessus
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 2;
                let lineY = staffLines[0] - 20;
                while (lineY >= noteY - 10) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(noteX - 14, lineY); // Réduit de 18 à 14
                    this.ctx.lineTo(noteX + 14, lineY);
                    this.ctx.stroke();
                    lineY -= 20;
                }
            } else if (noteY > staffLines[4] + 5) {
                // Lignes en-dessous
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 2;
                let lineY = staffLines[4] + 20;
                while (lineY <= noteY + 10) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(noteX - 14, lineY); // Réduit de 18 à 14
                    this.ctx.lineTo(noteX + 14, lineY);
                    this.ctx.stroke();
                    lineY += 20;
                }
            }
        }
    }
    
    // Démarrer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForLoad);
    } else {
        waitForLoad();
    }
    
})();
