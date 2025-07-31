// Version complète du jeu avec toutes les fonctionnalités - LIT SHEET1.XML
(function() {
    'use strict';
    
    console.log('🎻 CELLO RHYTHM GAME v2.5.0 - LECTURE FICHIER XML');
    
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
        scrollSpeed: 80,
        hitLineX: 150,
        perfectThreshold: 35,
        okThreshold: 70,
        judgmentWindow: 800,
        noteRadius: 14,
        staffLineY: [50, 70, 90, 110, 130]
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
            console.log('🎻 Creating COMPLETE game v2.5.0 (XML Reader)...');
            
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
            
            console.log('✅ COMPLETE game created v2.5.0 (XML Reader)');
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
        
        checkNoteMatch(detectedNote, frequency) {
            const currentTime = (Date.now() - this.startTime) / 1000;
            
            for (const note of this.gameNotes) {
                if (note.played || note.missed) continue;
                
                const noteTime = note.startTime;
                const timeDifference = Math.abs(currentTime - noteTime);
                
                if (timeDifference <= GAME_CONFIG.judgmentWindow / 1000) {
                    if (detectedNote === note.note) {
                        const expectedFreq = NOTE_FREQUENCIES[note.note];
                        const centsDifference = Math.abs(getCentsDifference(expectedFreq, frequency));
                        
                        note.played = true;
                        
                        let judgment = 'miss';
                        let points = 0;
                        
                        if (centsDifference <= GAME_CONFIG.perfectThreshold) {
                            judgment = 'perfect';
                            points = 100 + (this.combo * 10);
                            this.combo++;
                        } else if (centsDifference <= GAME_CONFIG.okThreshold) {
                            judgment = 'ok';
                            points = 50 + (this.combo * 5);
                            this.combo++;
                        } else {
                            judgment = 'miss';
                            this.combo = 0;
                        }
                        
                        this.score += points;
                        this.showJudgment(judgment);
                        this.updateUI();
                        
                        console.log(`🎯 Note jouée: ${detectedNote}, jugement: ${judgment}, points: +${points}`);
                        break;
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
            console.log('🔧 DEBUG INFO v2.5.1 - LECTURE XML + MESURES:');
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
            const visibleNotes = this.gameNotes.filter(n => n.x > -50 && n.x < this.canvas.width + 50).length;
            
            console.log(`🎼 MÉLODIE (depuis sheet1.xml):`)
            console.log(`  Total: ${totalNotes} notes`);
            console.log(`  Visibles: ${visibleNotes} notes`);
            console.log(`  Jouées: ${playedNotes}, Ratées: ${missedNotes}`);
            console.log(`  Progression: ${Math.round(((playedNotes + missedNotes) / totalNotes) * 100)}%`);
            
            // Debug des premières notes visibles
            const visibleNotesArray = this.gameNotes.filter(n => n.x > -50 && n.x < this.canvas.width + 50);
            if (visibleNotesArray.length > 0) {
                console.log(`🎵 NOTES VISIBLES (premières 5):`);
                for (let i = 0; i < Math.min(5, visibleNotesArray.length); i++) {
                    const note = visibleNotesArray[i];
                    console.log(`  ${note.note} - x:${Math.round(note.x)}, y:${note.y}, durée:${note.duration}`);
                }
            } else {
                console.log(`❌ AUCUNE NOTE VISIBLE !`);
                if (totalNotes > 0) {
                    console.log(`🔍 DEBUG - Premières notes du jeu:`);
                    for (let i = 0; i < Math.min(5, totalNotes); i++) {
                        const note = this.gameNotes[i];
                        console.log(`  ${note.note} - x:${Math.round(note.x)}, startTime:${note.startTime}, currentTime:${this.currentTime}`);
                    }
                }
            }
            
            console.log(`📊 MESURES: ${this.measures.length} mesures chargées`);
            
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
            
            this.debugStatusElement.textContent = 'Debug v2.5.1 affiché en console (F12)';
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
                let currentTime = 0;
                
                for (const measureElement of measureElements) {
                    const measureNumber = measureElement.getAttribute('number');
                    const measureStartTime = currentTime;
                    
                    // ✅ NOUVEAU: Ajouter la mesure
                    measures.push({
                        number: parseInt(measureNumber),
                        startTime: (measureStartTime / divisions) * 4, // Convertir en unités du jeu
                        xmlTime: measureStartTime
                    });
                    
                    // Traiter toutes les notes de cette mesure
                    const noteElements = measureElement.querySelectorAll('note');
                    
                    for (const noteElement of noteElements) {
                        const restElement = noteElement.querySelector('rest');
                        const durationElement = noteElement.querySelector('duration');
                        
                        if (!durationElement) continue;
                        
                        const duration = parseInt(durationElement.textContent);
                        
                        if (restElement) {
                            // C'est un silence, avancer le temps sans ajouter de note
                            currentTime += duration;
                            continue;
                        }
                        
                        const pitchElement = noteElement.querySelector('pitch');
                        if (!pitchElement) continue;
                        
                        const stepElement = pitchElement.querySelector('step');
                        const octaveElement = pitchElement.querySelector('octave');
                        const alterElement = pitchElement.querySelector('alter');
                        
                        if (!stepElement || !octaveElement) continue;
                        
                        const step = stepElement.textContent;
                        let octave = parseInt(octaveElement.textContent);
                        const alter = alterElement ? parseInt(alterElement.textContent) : 0;
                        
                        // ✅ NOUVEAU: Appliquer la transposition
                        let transposedNote = this.transposeNote(step, octave, alter, chromaticTranspose);
                        
                        // Convertir les durées MusicXML en unités du jeu
                        const gameDuration = (duration / divisions) * 4;
                        
                        melody.push({
                            note: transposedNote,
                            duration: gameDuration,
                            startTime: (currentTime / divisions) * 4,
                            measureNumber: parseInt(measureNumber) // ✅ NOUVEAU: Numéro de mesure
                        });
                        
                        currentTime += duration;
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
                // Configuration du timing et positionnement
                const timeScale = GAME_CONFIG.scrollSpeed / 4; // Convertir les unités de durée en pixels
                const startX = this.canvas.width + 100 + (noteData.startTime * timeScale);
                const noteWidth = noteData.duration * (timeScale / 4); // Largeur proportionnelle à la durée
                
                return {
                    ...noteData,
                    x: startX,
                    y: STAFF_POSITIONS[noteData.note] || 90,
                    width: Math.max(noteWidth, 20), // Largeur minimum de 20px
                    played: false,
                    missed: false,
                    id: index
                };
            });
            
            console.log(`✅ ${this.gameNotes.length} notes d'Ave Maria initialisées avec durées visuelles`);
            console.log(`✅ ${this.measures.length} mesures initialisées`);
            
            // Afficher quelques exemples dans la console
            if (this.gameNotes.length > 0) {
                console.log('📋 Exemples de notes avec durées (depuis sheet1.xml):');
                for (let i = 0; i < Math.min(5, this.gameNotes.length); i++) {
                    const note = this.gameNotes[i];
                    const measureInfo = note.measureNumber ? ` (mesure ${note.measureNumber})` : '';
                    console.log(`  ${note.note}: durée=${note.duration}, largeur=${note.width}px, startTime=${note.startTime}${measureInfo}`);
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
                        n.x > -50 && n.x < this.canvas.width + 50 && !n.played && !n.missed
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
                
                this.drawStaff();
                this.drawClef();
                this.drawMeasureBars(); // ✅ NOUVEAU: Barres de mesure
                this.drawGameNotes();
                this.drawHitLine();
                this.drawPlayedNote(); // NOUVEAU : Note jouée en temps réel
                this.updateUI();
                
            } catch (error) {
                console.error('Animation error:', error);
            }
            
            requestAnimationFrame(() => this.animate());
        }
        
        updateGameNotes() {
            for (const note of this.gameNotes) {
                note.x -= (GAME_CONFIG.scrollSpeed / 60) * (60/60); // 60 FPS
            }
        }
        
        checkMissedNotes() {
            for (const note of this.gameNotes) {
                // Prendre en compte la largeur de la note pour le calcul de ratage
                const noteEnd = note.x + (note.width || 0);
                if (!note.played && !note.missed && noteEnd < GAME_CONFIG.hitLineX - 30) {
                    note.missed = true;
                    this.combo = 0;
                    console.log(`❌ Note ratée: ${note.note} (durée: ${note.duration})`);
                }
            }
        }
        
        drawStaff() {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            
            for (const y of GAME_CONFIG.staffLineY) {
                this.ctx.beginPath();
                this.ctx.moveTo(80, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
        
        drawClef() {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 35px serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('𝄢', 40, 90); // Clé de fa
        }
        
        drawMeasureBars() {
            if (!this.measures || this.measures.length === 0) return;
            
            // Configuration pour les barres de mesure
            const timeScale = GAME_CONFIG.scrollSpeed / 4;
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
                // Calculer la position X de la barre de mesure
                const measureX = this.canvas.width + 100 + (measure.startTime * timeScale) - (currentGameTime * timeScale * 4);
                
                // Ne dessiner que les barres visibles
                if (measureX < -50 || measureX > this.canvas.width + 50) continue;
                
                // Dessiner la barre verticale
                this.ctx.beginPath();
                this.ctx.moveTo(measureX, 40); // Un peu au-dessus de la portée
                this.ctx.lineTo(measureX, 140); // Un peu en-dessous de la portée
                this.ctx.stroke();
                
                // Dessiner le numéro de mesure au-dessus
                this.ctx.fillText(measure.number.toString(), measureX, 35);
            }
        }
        
        drawGameNotes() {
            let visibleCount = 0;
            
            if (!this.gameNotes || this.gameNotes.length === 0) {
                console.warn('❌ Aucune note dans gameNotes !');
                return;
            }
            
            for (const note of this.gameNotes) {
                // Vérifier si la note (avec sa largeur) est visible
                if (note.x + note.width < -50 || note.x > this.canvas.width + 50) continue;
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
                
                // Choisir la forme selon la durée
                if (note.width <= 25) {
                    // Notes courtes : cercle classique
                    this.ctx.beginPath();
                    this.ctx.arc(note.x, note.y, GAME_CONFIG.noteRadius, 0, 2 * Math.PI);
                    this.ctx.fill();
                    this.ctx.stroke();
                } else {
                    // Notes longues : rectangle arrondi (représente la durée)
                    const height = GAME_CONFIG.noteRadius * 1.5;
                    const radius = Math.min(10, note.width / 4);
                    
                    this.ctx.beginPath();
                    this.ctx.roundRect(note.x - note.width/2, note.y - height/2, note.width, height, radius);
                    this.ctx.fill();
                    this.ctx.stroke();
                    
                    // Ajouter une petite tête de note pour la lisibilité
                    this.ctx.beginPath();
                    this.ctx.arc(note.x - note.width/2 + GAME_CONFIG.noteRadius, note.y, GAME_CONFIG.noteRadius - 2, 0, 2 * Math.PI);
                    this.ctx.fill();
                    this.ctx.stroke();
                }
                
                // Afficher le nom de la note (pendant la première minute)
                if (this.currentTime < 60) {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 11px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(note.note, note.x, note.y - 20);
                    
                    // Afficher la durée pour debug (premières 10 secondes)
                    if (this.currentTime < 10) {
                        this.ctx.font = '9px Arial';
                        this.ctx.fillStyle = '#ccc';
                        this.ctx.fillText(`${note.duration}`, note.x, note.y + 20);
                    }
                }
                
                // Lignes supplémentaires si nécessaire
                this.drawLedgerLines(note, strokeColor);
            }
            
            // Debug: afficher le nombre de notes visibles
            if (this.isPlaying && visibleCount === 0) {
                console.warn(`⚠️ Aucune note visible ! Total notes: ${this.gameNotes.length}, temps: ${this.currentTime.toFixed(2)}s`);
            }
            
            // Message si pas de notes visibles
            if (visibleCount === 0 && this.isPlaying && this.currentTime < 15) {
                this.ctx.fillStyle = '#FF5722';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Les notes arrivent...', this.canvas.width / 2, 30);
                
                // Debug: afficher la position de la première note
                if (this.gameNotes.length > 0) {
                    const firstNote = this.gameNotes[0];
                    this.ctx.fillStyle = '#FFA500';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText(`Première note: ${firstNote.note} à x=${Math.round(firstNote.x)}`, this.canvas.width / 2, 50);
                }
            }
        }
        
        drawLedgerLines(note, strokeColor) {
            const staffLines = GAME_CONFIG.staffLineY;
            
            if (note.y < staffLines[0] - 5) {
                // Lignes au-dessus
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 1;
                let lineY = staffLines[0] - 20;
                while (lineY >= note.y - 10) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(note.x - 15, lineY);
                    this.ctx.lineTo(note.x + 15, lineY);
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
                    this.ctx.moveTo(note.x - 15, lineY);
                    this.ctx.lineTo(note.x + 15, lineY);
                    this.ctx.stroke();
                    lineY += 20;
                }
            }
        }
        
        drawHitLine() {
            this.ctx.strokeStyle = '#FF5722';
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([12, 6]);
            this.ctx.beginPath();
            this.ctx.moveTo(GAME_CONFIG.hitLineX, 20);
            this.ctx.lineTo(GAME_CONFIG.hitLineX, 160);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // Indicateur "Jouez ici"
            this.ctx.fillStyle = '#FF5722';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('♪ Jouez ici ♪', GAME_CONFIG.hitLineX, 15);
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
            
            // Position X = ligne de jeu
            const noteX = GAME_CONFIG.hitLineX;
            
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
            this.ctx.arc(noteX, noteY, GAME_CONFIG.noteRadius + 2, 0, 2 * Math.PI);
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
                    this.ctx.moveTo(noteX - 18, lineY);
                    this.ctx.lineTo(noteX + 18, lineY);
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
                    this.ctx.moveTo(noteX - 18, lineY);
                    this.ctx.lineTo(noteX + 18, lineY);
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
