// Version complète du jeu avec toutes les fonctionnalités
(function() {
    'use strict';
    
    console.log('🎻 CELLO RHYTHM GAME v2.3.7 - VERSION COMPLÈTE');
    
    // ═══ DONNÉES INTÉGRÉES ═══
    const NOTE_FREQUENCIES = {
        'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
        'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
        'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
        'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
        'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
        'C5': 523.25
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
    
    // Positions des notes sur la portée (clé de fa) - COMPLÈTES
    const STAFF_POSITIONS = {
        // Notes très graves (en dessous de la portée)
        'C1': 210, 'D1': 200, 'E1': 190, 'F1': 180, 'G1': 170, 'A1': 160, 'B1': 150,
        
        // Notes graves (portée basse)
        'C2': 170, 'D2': 160, 'E2': 150, 'F2': 140, 'G2': 130,
        'A2': 120, 'B2': 110, 
        
        // Notes moyennes (sur la portée)
        'C3': 130, 'D3': 120, 'E3': 110, 'F3': 100, 'G3': 90, 'A3': 80, 'B3': 70,
        
        // Notes aiguës (au-dessus de la portée)
        'C4': 60, 'D4': 50, 'E4': 40, 'F4': 30, 'G4': 20, 'A4': 10, 'B4': 0,
        'C5': -10, 'D5': -20, 'E5': -30, 'F5': -40, 'G5': -50,
        
        // Notes avec dièses/bémols
        'C#1': 205, 'D#1': 195, 'F#1': 175, 'G#1': 165, 'A#1': 155,
        'C#2': 165, 'D#2': 155, 'F#2': 135, 'G#2': 125, 'A#2': 115,
        'C#3': 125, 'D#3': 115, 'F#3': 95, 'G#3': 85, 'A#3': 75,
        'C#4': 55, 'D#4': 45, 'F#4': 25, 'G#4': 15, 'A#4': 5,
        'C#5': -15, 'D#5': -25, 'F#5': -45, 'G#5': -55, 'A#5': -65
    };
    
    // Mélodie Ave Maria (version simplifiée mais complète)
    const AVE_MARIA_MELODY = [
        // Mesure 1-4 : Ave Maria...
        { note: 'G3', duration: 4, startTime: 2 },
        { note: 'C3', duration: 2, startTime: 6 },
        { note: 'E3', duration: 2, startTime: 8 },
        { note: 'G3', duration: 4, startTime: 10 },
        
        // Mesure 5-8 : gratia plena...
        { note: 'A3', duration: 2, startTime: 14 },
        { note: 'G3', duration: 2, startTime: 16 },
        { note: 'F3', duration: 2, startTime: 18 },
        { note: 'E3', duration: 4, startTime: 20 },
        
        // Mesure 9-12 : Dominus tecum...
        { note: 'D3', duration: 2, startTime: 24 },
        { note: 'E3', duration: 2, startTime: 26 },
        { note: 'F3', duration: 2, startTime: 28 },
        { note: 'G3', duration: 4, startTime: 30 },
        
        // Mesure 13-16 : benedicta tu...
        { note: 'A3', duration: 2, startTime: 34 },
        { note: 'B3', duration: 2, startTime: 36 },
        { note: 'C4', duration: 4, startTime: 38 },
        { note: 'G3', duration: 4, startTime: 42 },
        
        // Notes finales
        { note: 'F3', duration: 2, startTime: 46 },
        { note: 'E3', duration: 2, startTime: 48 },
        { note: 'D3', duration: 2, startTime: 50 },
        { note: 'C3', duration: 6, startTime: 52 }
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
            console.log('🎻 Creating COMPLETE game v2.3.7...');
            
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
            this.initializeGameNotes();
            
            // Démarrer l'animation
            this.animate();
            
            console.log('✅ COMPLETE game created v2.3.7');
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
            
            this.analyser.fftSize = 8192;  // Plus de résolution pour meilleure précision
            this.analyser.smoothingTimeConstant = 0.1;  // Moins de lissage
            this.analyser.minDecibels = -100;
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
                
                // Seuil pour détecter une note (ajusté pour le volume RMS)
                if (volume > -60) {  // Seuil ajusté pour RMS
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
        
        // Détection de fréquence fondamentale par autocorrélation (YIN algorithm simplifié)
        detectFundamentalFrequency(buffer) {
            const sampleRate = this.audioContext.sampleRate;
            const bufferSize = buffer.length;
            
            // Plage de fréquences pour violoncelle (60 Hz à 1000 Hz)
            const minPeriod = Math.floor(sampleRate / 1000); // 1000 Hz max
            const maxPeriod = Math.floor(sampleRate / 60);   // 60 Hz min
            
            let bestPeriod = 0;
            let minError = Infinity;
            
            // Autocorrélation simplifiée
            for (let period = minPeriod; period < Math.min(maxPeriod, bufferSize / 2); period++) {
                let error = 0;
                let count = 0;
                
                // Calculer l'erreur pour cette période
                for (let i = 0; i < bufferSize - period; i++) {
                    const diff = buffer[i] - buffer[i + period];
                    error += diff * diff;
                    count++;
                }
                
                if (count > 0) {
                    error = error / count;
                    
                    // Normalisation YIN (optionnelle mais améliore la précision)
                    if (period > minPeriod) {
                        error = error / (1 + error);
                    }
                    
                    if (error < minError) {
                        minError = error;
                        bestPeriod = period;
                    }
                }
            }
            
            // Convertir la période en fréquence
            if (bestPeriod > 0 && minError < 0.3) { // Seuil de confiance
                // Interpolation parabolique pour améliorer la précision
                let refinedPeriod = bestPeriod;
                
                if (bestPeriod > minPeriod + 1 && bestPeriod < maxPeriod - 1) {
                    // Calculer les erreurs des périodes adjacentes
                    const y1 = this.calculatePeriodError(buffer, bestPeriod - 1);
                    const y2 = minError;
                    const y3 = this.calculatePeriodError(buffer, bestPeriod + 1);
                    
                    // Interpolation parabolique
                    const a = (y1 - 2 * y2 + y3) / 2;
                    const b = (y3 - y1) / 2;
                    
                    if (a !== 0) {
                        const peakOffset = -b / (2 * a);
                        if (Math.abs(peakOffset) < 1) {
                            refinedPeriod = bestPeriod + peakOffset;
                        }
                    }
                }
                
                return sampleRate / refinedPeriod;
            }
            
            return 0; // Pas de fréquence détectée
        }
        
        // Fonction helper pour l'interpolation
        calculatePeriodError(buffer, period) {
            let error = 0;
            let count = 0;
            
            for (let i = 0; i < buffer.length - period; i++) {
                const diff = buffer[i] - buffer[i + period];
                error += diff * diff;
                count++;
            }
            
            return count > 0 ? error / count : Infinity;
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
                this.initializeGameNotes();
                
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
            console.log('🔧 DEBUG INFO:');
            console.log(`Microphone: ${this.microphoneActive ? 'Actif' : 'Inactif'}`);
            console.log(`Détection: ${this.pitchDetectionActive ? 'Active' : 'Inactive'}`);
            console.log(`Jeu: ${this.isPlaying ? 'En cours' : 'Arrêté'}`);
            console.log(`Score: ${this.score}, Combo: ${this.combo}`);
            console.log(`Note détectée: ${this.lastDetectedNote || 'Aucune'}`);
            console.log(`Note affichée: ${this.displayedNote || 'Aucune'}`);
            console.log(`Fréquence affichée: ${this.displayedFreq} Hz`);
            console.log(`Volume: ${this.currentVolume} dB`);
            console.log(`Notes actives: ${this.gameNotes.filter(n => !n.played && !n.missed).length}`);
            
            this.debugStatusElement.textContent = 'Debug affiché en console (F12)';
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
        
        initializeGameNotes() {
            console.log('🎼 Initializing Ave Maria melody...');
            
            this.gameNotes = AVE_MARIA_MELODY.map((noteData, index) => {
                const startX = this.canvas.width + 100 + (noteData.startTime * GAME_CONFIG.scrollSpeed);
                return {
                    ...noteData,
                    x: startX,
                    y: STAFF_POSITIONS[noteData.note] || 90,
                    played: false,
                    missed: false,
                    id: index
                };
            });
            
            console.log(`✅ ${this.gameNotes.length} notes d'Ave Maria initialisées`);
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
                if (!note.played && !note.missed && note.x < GAME_CONFIG.hitLineX - 60) {
                    note.missed = true;
                    this.combo = 0;
                    console.log(`❌ Note ratée: ${note.note}`);
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
        
        drawGameNotes() {
            let visibleCount = 0;
            
            for (const note of this.gameNotes) {
                if (note.x < -50 || note.x > this.canvas.width + 50) continue;
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
                
                // Dessiner la note
                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(note.x, note.y, GAME_CONFIG.noteRadius, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
                
                // Afficher le nom de la note (première minute)
                if (this.currentTime < 60) {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 11px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(note.note, note.x, note.y - 20);
                }
                
                // Lignes supplémentaires si nécessaire
                this.drawLedgerLines(note, strokeColor);
            }
            
            // Message si pas de notes visibles
            if (visibleCount === 0 && this.isPlaying && this.currentTime < 15) {
                this.ctx.fillStyle = '#FF5722';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Les notes arrivent...', this.canvas.width / 2, 30);
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
