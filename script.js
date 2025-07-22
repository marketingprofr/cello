// Version autonome qui ne dépend pas de notes.js
(function() {
    'use strict';
    
    // ═══════════════════════════════════════
    // 🎻 CELLO RHYTHM GAME v2.3.4
    // VERSION AUTONOME: 22/07/2025
    // ═══════════════════════════════════════
    
    const GAME_VERSION = "v2.3.4";
    
    // VÉRIFICATION IMMÉDIATE DE LA VERSION
    console.log('%c═══════════════════════════════════════', 'color: #4CAF50; font-weight: bold;');
    console.log('%c🎻 CELLO RHYTHM GAME v2.3.4', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
    console.log('%c📅 BUILD: 22/07/2025 - VERSION AUTONOME', 'color: #4CAF50; font-weight: bold;');
    console.log('%c🔧 DÉTECTION AUDIO RÉPARÉE', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
    console.log('%c═══════════════════════════════════════', 'color: #4CAF50; font-weight: bold;');
    
    // ═══ DONNÉES INTÉGRÉES ═══
    // Fréquences des notes pour violoncelle
    const NOTE_FREQUENCIES = {
        'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
        'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
        'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
        'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
        'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
        'C5': 523.25
    };
    
    // Noms français des notes
    const FRENCH_NAMES = {
        'C': 'Do', 'C#': 'Do#', 'D': 'Ré', 'D#': 'Ré#', 'E': 'Mi', 'F': 'Fa',
        'F#': 'Fa#', 'G': 'Sol', 'G#': 'Sol#', 'A': 'La', 'A#': 'La#', 'B': 'Si'
    };
    
    // Configuration du jeu
    const GAME_CONFIG = {
        scrollSpeed: 60,
        hitLineX: 150,
        perfectThreshold: 35,
        okThreshold: 75,
        judgmentWindow: 500,
        noteRadius: 12,
        staffLineY: [50, 70, 90, 110, 130]
    };
    
    // Positions des notes sur la portée
    const STAFF_POSITIONS = {
        'C2': 170, 'D2': 160, 'E2': 150, 'F2': 140, 'G2': 130,
        'A2': 120, 'B2': 110, 'C3': 130, 'D3': 110, 'E3': 90,
        'F3': 80, 'G3': 70, 'A3': 60, 'B3': 50, 'C4': 40,
        'D4': 30, 'E4': 20, 'F4': 10, 'G4': 0
    };
    
    // Mélodie simple pour test
    const AVE_MARIA_MELODY = [
        { note: 'G3', duration: 2, startTime: 2 },
        { note: 'E3', duration: 2, startTime: 4 },
        { note: 'A3', duration: 2, startTime: 6 },
        { note: 'G3', duration: 4, startTime: 8 },
        { note: 'C3', duration: 2, startTime: 12 },
        { note: 'G3', duration: 2, startTime: 14 }
    ];
    
    // ═══ FONCTIONS UTILITAIRES ═══
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
    
    // Attendre que tout soit chargé
    function waitForLoad() {
        if (document.readyState === 'complete') {
            console.log(`🎻 Cello Rhythm Game ${GAME_VERSION} - DOM fully loaded`);
            initializeGame();
        } else {
            setTimeout(waitForLoad, 100);
        }
    }
    
    function initializeGame() {
        try {
            // Vérifier que tous les éléments existent
            const requiredElements = [
                'gameCanvas', 'startBtn', 'stopBtn', 'testBtn', 'debugBtn', 'micBtn',
                'score', 'combo', 'playedNote', 'playedFreq', 'judgment',
                'micStatus', 'frequency', 'volume', 'debugStatus', 'activeNotes', 'gameTime'
            ];
            
            let missingElements = [];
            for (let id of requiredElements) {
                if (!document.getElementById(id)) {
                    missingElements.push(id);
                }
            }
            
            if (missingElements.length > 0) {
                console.error(`❌ Elements missing: ${missingElements.join(', ')}`);
                return;
            }
            
            console.log('✅ All DOM elements found');
            game = new CelloRhythmGame();
            
        } catch (error) {
            console.error('❌ Error initializing game:', error);
            alert('Erreur de chargement: ' + error.message);
        }
    }
    
    class CelloRhythmGame {
        constructor() {
            console.log(`🎻 Creating CelloRhythmGame instance ${GAME_VERSION}...`);
            console.log('═══════════════════════════════════════');
            console.log('🎼 Ave Maria de Gounod - Violoncelle');
            console.log('📅 Build: 22/07/2025 - VERSION AUTONOME v2.3.4');
            console.log('🔧 Mode: Détection audio intégrée');
            console.log('═══════════════════════════════════════');
            
            // Variables de jeu
            this.isPlaying = false;
            this.startTime = 0;
            this.currentTime = 0;
            this.score = 0;
            this.combo = 0;
            this.microphoneActive = false;
            
            // Audio
            this.audioContext = null;
            this.microphone = null;
            this.analyser = null;
            this.dataArray = null;
            this.lastDetectedNote = null;
            this.lastDetectedFreq = 0;
            this.currentVolume = 0;
            
            // Notes
            this.gameNotes = [];
            
            // Initialiser
            this.initializeElements();
            this.initializeEventListeners();
            this.setupCanvas();
            this.initializeGameNotes();
            this.animate();
            
            console.log('✅ CelloRhythmGame created successfully - v2.3.4 AUTONOMOUS');
        }
        
        initializeElements() {
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            
            this.micBtn = document.getElementById('micBtn');
            this.startBtn = document.getElementById('startBtn');
            this.stopBtn = document.getElementById('stopBtn');
            this.testBtn = document.getElementById('testBtn');
            this.debugBtn = document.getElementById('debugBtn');
            
            this.scoreElement = document.getElementById('score');
            this.comboElement = document.getElementById('combo');
            this.playedNoteElement = document.getElementById('playedNote');
            this.playedFreqElement = document.getElementById('playedFreq');
            this.judgmentElement = document.getElementById('judgment');
            
            this.micStatusElement = document.getElementById('micStatus');
            this.frequencyElement = document.getElementById('frequency');
            this.volumeElement = document.getElementById('volume');
            this.debugStatusElement = document.getElementById('debugStatus');
            this.activeNotesElement = document.getElementById('activeNotes');
            this.gameTimeElement = document.getElementById('gameTime');
        }
        
        initializeEventListeners() {
            console.log('🎯 Setting up event listeners...');
            
            this.micBtn.onclick = () => {
                console.log('🎤 Microphone button clicked');
                this.toggleMicrophone();
            };
            
            this.startBtn.onclick = () => {
                console.log('▶️ Start button clicked');
                this.startGame();
            };
            
            this.stopBtn.onclick = () => {
                console.log('⏹️ Stop button clicked');
                this.stopGame();
            };
            
            this.testBtn.onclick = () => {
                console.log('🎵 Test button clicked');
                this.simulateNote();
            };
            
            this.debugBtn.onclick = () => {
                console.log('🔧 Debug button clicked');
                this.showDebugInfo();
            };
            
            console.log('✅ Event listeners set up');
        }
        
        simulateNote() {
            console.log('🎵 Simulating note...');
            
            try {
                this.lastDetectedNote = 'C3';
                this.lastDetectedFreq = 130.81;
                this.playedNoteElement.textContent = 'Do3';
                this.playedFreqElement.textContent = '130.8 Hz';
                this.showJudgment('perfect');
                
                this.debugStatusElement.textContent = 'Test réussi!';
                console.log('✅ Note simulation successful');
                
                setTimeout(() => {
                    if (this.microphoneActive) {
                        this.debugStatusElement.textContent = 'Microphone actif - Détection en cours';
                    } else {
                        this.debugStatusElement.textContent = 'En attente';
                    }
                }, 2000);
                
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
                    console.log('🎤 Activating microphone...');
                    await this.initializeAudio();
                    this.micBtn.textContent = '🎤 Désactiver Microphone';
                    this.micBtn.style.backgroundColor = '#f44336';
                    this.debugStatusElement.textContent = 'Microphone actif - Détection en cours';
                    console.log('✅ Microphone activated successfully');
                } catch (error) {
                    console.error('❌ Error activating microphone:', error);
                    this.debugStatusElement.textContent = 'Erreur micro: ' + error.message;
                    alert('Erreur microphone: ' + error.message);
                }
            }
        }
        
        stopMicrophone() {
            console.log('🛑 Stopping microphone...');
            this.microphoneActive = false;
            
            if (this.microphone) {
                try {
                    this.microphone.disconnect();
                } catch (e) {
                    console.warn('Warning disconnecting microphone:', e);
                }
            }
            if (this.audioContext && this.audioContext.state !== 'closed') {
                try {
                    this.audioContext.close();
                } catch (e) {
                    console.warn('Warning closing audio context:', e);
                }
            }
            
            this.micBtn.textContent = '🎤 Activer Microphone';
            this.micBtn.style.backgroundColor = '#4CAF50';
            this.micStatusElement.textContent = 'Désactivé';
            this.debugStatusElement.textContent = 'Microphone arrêté';
            
            // Réinitialiser l'affichage
            this.playedNoteElement.textContent = '-';
            this.playedFreqElement.textContent = '- Hz';
            this.frequencyElement.textContent = '0';
            this.volumeElement.textContent = '0';
        }
        
        async initializeAudio() {
            console.log('🎤 Initializing audio system...');
            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported');
            }
            
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                    sampleRate: 44100
                } 
            });
            
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            
            // Configuration ultra-sensible
            this.analyser.fftSize = 8192;
            this.analyser.smoothingTimeConstant = 0.1;
            this.analyser.minDecibels = -100;
            this.analyser.maxDecibels = -10;
            
            this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
            
            this.microphone.connect(this.analyser);
            this.microphoneActive = true;
            this.micStatusElement.textContent = 'Activé - Ultra-sensible';
            
            console.log('✅ Audio system initialized');
            this.detectPitch();
        }
        
        detectPitch() {
            if (!this.microphoneActive || !this.analyser) {
                if (this.microphoneActive) {
                    requestAnimationFrame(() => this.detectPitch());
                }
                return;
            }
            
            try {
                this.analyser.getFloatFrequencyData(this.dataArray);
                
                let maxAmplitude = -Infinity;
                let maxIndex = 0;
                
                // Chercher le pic de fréquence
                for (let i = 5; i < this.dataArray.length / 2; i++) {
                    if (this.dataArray[i] > maxAmplitude) {
                        maxAmplitude = this.dataArray[i];
                        maxIndex = i;
                    }
                }
                
                this.currentVolume = Math.round(maxAmplitude);
                this.volumeElement.textContent = this.currentVolume;
                
                // Seuil ultra-bas pour détecter même les sons faibles
                if (maxAmplitude > -85) {
                    const sampleRate = this.audioContext.sampleRate;
                    const frequency = (maxIndex * sampleRate) / this.analyser.fftSize;
                    this.lastDetectedFreq = frequency;
                    this.frequencyElement.textContent = frequency.toFixed(1);
                    
                    // Convertir la fréquence en note
                    const detectedNote = this.frequencyToNote(frequency);
                    if (detectedNote) {
                        this.lastDetectedNote = detectedNote;
                        const frenchName = getNoteFrenchName(detectedNote);
                        
                        // *** MISE À JOUR CRITIQUE ***
                        this.playedNoteElement.textContent = frenchName;
                        this.playedFreqElement.textContent = frequency.toFixed(1) + ' Hz';
                        
                        console.log(`🎵 Note détectée: ${detectedNote} (${frenchName}) - ${frequency.toFixed(1)} Hz`);
                        
                        // Vérifier si la note correspond (si le jeu est lancé)
                        if (this.isPlaying) {
                            this.checkNoteMatch(detectedNote, frequency);
                        }
                    }
                } else {
                    this.frequencyElement.textContent = '0';
                    // Réinitialiser l'affichage si silence complet
                    if (maxAmplitude < -95) {
                        this.playedNoteElement.textContent = '-';
                        this.playedFreqElement.textContent = '- Hz';
                    }
                }
                
            } catch (error) {
                console.error('❌ Error in detectPitch:', error);
                this.debugStatusElement.textContent = 'Erreur détection: ' + error.message;
            }
            
            requestAnimationFrame(() => this.detectPitch());
        }
        
        frequencyToNote(frequency) {
            let closestNote = null;
            let minDifference = Infinity;
            
            // Chercher la note la plus proche
            for (const [note, freq] of Object.entries(NOTE_FREQUENCIES)) {
                const difference = Math.abs(frequency - freq);
                if (difference < minDifference) {
                    minDifference = difference;
                    closestNote = note;
                }
            }
            
            // Tolérance de 20% (très permissive)
            if (closestNote && minDifference < NOTE_FREQUENCIES[closestNote] * 0.2) {
                return closestNote;
            }
            
            return null;
        }
        
        checkNoteMatch(detectedNote, frequency) {
            const currentTime = (Date.now() - this.startTime) / 1000;
            
            // Chercher les notes dans la fenêtre de jugement
            for (const note of this.gameNotes) {
                if (note.played || note.missed) continue;
                
                const noteTime = note.startTime;
                const timeDifference = Math.abs(currentTime - noteTime);
                
                if (timeDifference <= GAME_CONFIG.judgmentWindow / 1000) {
                    if (detectedNote === note.note) {
                        const expectedFreq = NOTE_FREQUENCIES[note.note];
                        const centsDifference = Math.abs(getCentsDifference(expectedFreq, frequency));
                        
                        note.played = true;
                        this.combo++;
                        
                        let judgment = 'miss';
                        let points = 0;
                        
                        if (centsDifference <= GAME_CONFIG.perfectThreshold) {
                            judgment = 'perfect';
                            points = 100 + (this.combo * 10);
                        } else if (centsDifference <= GAME_CONFIG.okThreshold) {
                            judgment = 'ok';
                            points = 50 + (this.combo * 5);
                        } else {
                            judgment = 'miss';
                            this.combo = 0;
                        }
                        
                        this.score += points;
                        this.showJudgment(judgment);
                        this.updateUI();
                        console.log(`🎯 Note jouée: ${detectedNote}, jugement: ${judgment}, cents: ${centsDifference}`);
                        break;
                    }
                }
            }
        }
        
        showJudgment(judgment) {
            try {
                this.judgmentElement.textContent = judgment.toUpperCase();
                this.judgmentElement.className = `judgment ${judgment}`;
                
                setTimeout(() => {
                    this.judgmentElement.textContent = '';
                    this.judgmentElement.className = 'judgment';
                }, 1000);
            } catch (error) {
                console.warn('Error showing judgment:', error);
            }
        }
        
        async startGame() {
            console.log('🚀 Starting game...');
            this.debugStatusElement.textContent = 'Démarrage du jeu...';
            
            try {
                if (!this.microphoneActive) {
                    await this.initializeAudio();
                }
                
                this.isPlaying = true;
                this.startTime = Date.now();
                this.score = 0;
                this.combo = 0;
                this.initializeGameNotes();
                this.updateUI();
                this.startBtn.disabled = true;
                this.stopBtn.disabled = false;
                this.debugStatusElement.textContent = 'Jeu en cours';
                
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
            
            this.debugStatusElement.textContent = this.microphoneActive ? 'Microphone actif - Détection en cours' : 'Jeu arrêté';
            this.judgmentElement.textContent = '';
            this.judgmentElement.className = 'judgment';
        }
        
        showDebugInfo() {
            console.log('🔧 Debug Info:');
            console.log(`Microphone: ${this.microphoneActive ? 'Actif' : 'Inactif'}`);
            console.log(`Jeu: ${this.isPlaying ? 'En cours' : 'Arrêté'}`);
            console.log(`Dernière note: ${this.lastDetectedNote || 'Aucune'}`);
            console.log(`Dernière fréquence: ${this.lastDetectedFreq} Hz`);
            console.log(`Volume: ${this.currentVolume} dB`);
            console.log(`Notes de jeu: ${this.gameNotes.length}`);
            
            this.debugStatusElement.textContent = 'Debug affiché en console (F12)';
            setTimeout(() => {
                this.debugStatusElement.textContent = this.microphoneActive ? 'Microphone actif - Détection en cours' : 'En attente';
            }, 2000);
        }
        
        setupCanvas() {
            console.log('🎨 Setting up canvas...');
            const container = this.canvas.parentElement;
            const width = Math.min(800, container.clientWidth - 20);
            const height = 200;
            
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
            
            console.log(`✅ Canvas: ${width}x${height}`);
        }
        
        initializeGameNotes() {
            console.log('🎼 Initializing game notes...');
            
            this.gameNotes = AVE_MARIA_MELODY.map((noteData, index) => {
                const startX = this.canvas.width + 50 + (noteData.startTime * GAME_CONFIG.scrollSpeed);
                return {
                    ...noteData,
                    x: startX,
                    y: STAFF_POSITIONS[noteData.note] || 90,
                    played: false,
                    missed: false,
                    id: index
                };
            });
            
            // Notes de test qui arrivent rapidement
            this.gameNotes.unshift(
                { note: 'C3', x: this.canvas.width + 100, y: 130, startTime: 1, played: false, missed: false, id: -1 },
                { note: 'D3', x: this.canvas.width + 200, y: 110, startTime: 2, played: false, missed: false, id: -2 },
                { note: 'G3', x: this.canvas.width + 300, y: 70, startTime: 3, played: false, missed: false, id: -3 }
            );
            
            console.log(`✅ ${this.gameNotes.length} notes initialisées`);
        }
        
        updateUI() {
            try {
                this.scoreElement.textContent = this.score;
                this.comboElement.textContent = this.combo;
                
                if (this.isPlaying) {
                    this.gameTimeElement.textContent = this.currentTime.toFixed(1);
                    const activeNotes = this.gameNotes.filter(n => 
                        n.x > -50 && n.x < this.canvas.width + 50 && !n.played && !n.missed
                    ).length;
                    this.activeNotesElement.textContent = activeNotes;
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
                this.updateUI();
                
            } catch (error) {
                console.error('Animation error:', error);
            }
            
            requestAnimationFrame(() => this.animate());
        }
        
        updateGameNotes() {
            for (const note of this.gameNotes) {
                note.x -= GAME_CONFIG.scrollSpeed / 60;
            }
        }
        
        checkMissedNotes() {
            for (const note of this.gameNotes) {
                if (!note.played && !note.missed && note.x < GAME_CONFIG.hitLineX - 50) {
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
                this.ctx.moveTo(60, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
        
        drawClef() {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 30px serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('𝄢', 30, 90);
        }
        
        drawGameNotes() {
            let visibleCount = 0;
            
            for (const note of this.gameNotes) {
                if (note.x < -50 || note.x > this.canvas.width + 50) continue;
                visibleCount++;
                
                let color = '#4CAF50';
                let strokeColor = '#2E7D32';
                
                if (note.played) {
                    color = '#2196F3';
                    strokeColor = '#1976D2';
                } else if (note.missed) {
                    color = '#f44336';
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
                
                // Afficher le nom pour debug (30 premières secondes)
                if (this.currentTime < 30) {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 12px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(note.note, note.x, note.y - 25);
                }
                
                this.drawLedgerLines(note, strokeColor);
            }
            
            // Debug
            if (visibleCount === 0 && this.isPlaying && this.currentTime < 10) {
                this.ctx.fillStyle = '#FF5722';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('En attente des notes...', this.canvas.width / 2, 30);
            }
        }
        
        drawLedgerLines(note, strokeColor) {
            const staffLines = GAME_CONFIG.staffLineY;
            
            if (note.y < staffLines[0]) {
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 1;
                let lineY = staffLines[0] - 20;
                while (lineY >= note.y - 5) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(note.x - 12, lineY);
                    this.ctx.lineTo(note.x + 12, lineY);
                    this.ctx.stroke();
                    lineY -= 20;
                }
            } else if (note.y > staffLines[4]) {
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 1;
                let lineY = staffLines[4] + 20;
                while (lineY <= note.y + 5) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(note.x - 12, lineY);
                    this.ctx.lineTo(note.x + 12, lineY);
                    this.ctx.stroke();
                    lineY += 20;
                }
            }
        }
        
        drawHitLine() {
            this.ctx.strokeStyle = '#FF5722';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([10, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(GAME_CONFIG.hitLineX, 20);
            this.ctx.lineTo(GAME_CONFIG.hitLineX, 160);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }
    
    // Démarrer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForLoad);
    } else {
        waitForLoad();
    }
    
})();
