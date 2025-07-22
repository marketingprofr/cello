// Version progressive qui ajoute les fonctionnalités étape par étape
(function() {
    'use strict';
    
    console.log('🔧 PROGRESSIVE VERSION v2.3.6 - Construction étape par étape');
    
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
        scrollSpeed: 60,
        hitLineX: 150,
        perfectThreshold: 35,
        okThreshold: 75,
        judgmentWindow: 500,
        noteRadius: 12,
        staffLineY: [50, 70, 90, 110, 130]
    };
    
    function getNoteFrenchName(note) {
        if (!note || typeof note !== 'string') return '-';
        const match = note.match(/^([A-G]#?)(\d)$/);
        if (!match) return note;
        const [, noteName, octave] = match;
        return `${FRENCH_NAMES[noteName] || noteName}${octave}`;
    }
    
    let game = null;
    
    function waitForLoad() {
        if (document.readyState === 'complete') {
            console.log('DOM loaded, creating game...');
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
            console.log('🎻 Creating game v2.3.6...');
            
            // Variables de base
            this.microphoneActive = false;
            this.isPlaying = false;
            this.audioContext = null;
            this.microphone = null;
            this.analyser = null;
            this.dataArray = null;
            this.currentVolume = 0;
            this.lastDetectedFreq = 0;
            this.lastDetectedNote = null;
            this.pitchDetectionActive = false; // NOUVEAU FLAG
            
            // Initialiser
            this.initializeElements();
            this.initializeEventListeners();
            this.setupCanvas();
            
            console.log('✅ Game created v2.3.6');
        }
        
        initializeElements() {
            console.log('🎯 Initializing elements...');
            
            // Éléments critiques avec vérification
            this.playedNoteElement = document.getElementById('playedNote');
            this.playedFreqElement = document.getElementById('playedFreq');
            
            if (!this.playedNoteElement) throw new Error('playedNote element not found!');
            if (!this.playedFreqElement) throw new Error('playedFreq element not found!');
            
            // Autres éléments
            this.micBtn = document.getElementById('micBtn');
            this.startBtn = document.getElementById('startBtn');
            this.stopBtn = document.getElementById('stopBtn');
            this.testBtn = document.getElementById('testBtn');
            this.debugBtn = document.getElementById('debugBtn');
            this.debugStatusElement = document.getElementById('debugStatus');
            this.micStatusElement = document.getElementById('micStatus');
            this.frequencyElement = document.getElementById('frequency');
            this.volumeElement = document.getElementById('volume');
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            
            console.log('✅ All elements initialized');
        }
        
        initializeEventListeners() {
            console.log('🎯 Setting up event listeners...');
            
            this.testBtn.onclick = () => {
                console.log('🎵 TEST BUTTON CLICKED');
                this.simulateNote();
            };
            
            this.micBtn.onclick = () => {
                console.log('🎤 MIC BUTTON CLICKED');
                this.toggleMicrophone();
            };
            
            this.startBtn.onclick = () => {
                console.log('▶️ START BUTTON CLICKED');
                this.startGame();
            };
            
            this.stopBtn.onclick = () => {
                console.log('⏹️ STOP BUTTON CLICKED');  
                this.stopGame();
            };
            
            this.debugBtn.onclick = () => {
                console.log('🔧 DEBUG BUTTON CLICKED');
                this.showDebugInfo();
            };
            
            console.log('✅ Event listeners ready');
        }
        
        simulateNote() {
            console.log('🎵 === SIMULATE NOTE START ===');
            
            try {
                // PROTECTION : Toujours chercher les éléments frais
                const noteEl = document.getElementById('playedNote');
                const freqEl = document.getElementById('playedFreq');
                
                if (!noteEl || !freqEl) {
                    console.error('❌ Elements not found during simulate!');
                    this.debugStatusElement.textContent = 'ERREUR: Elements not found';
                    return;
                }
                
                console.log('Updating with fresh elements...');
                noteEl.textContent = 'Do3';
                freqEl.textContent = '130.8 Hz';
                
                this.debugStatusElement.textContent = 'Test réussi!';
                console.log('✅ SIMULATE NOTE SUCCESS');
                
                // Réinitialiser après 2 secondes si pas de détection active
                if (!this.pitchDetectionActive) {
                    setTimeout(() => {
                        noteEl.textContent = '-';
                        freqEl.textContent = '- Hz';
                        this.debugStatusElement.textContent = this.microphoneActive ? 'Microphone actif' : 'En attente';
                    }, 2000);
                }
                
            } catch (error) {
                console.error('❌ Error in simulateNote:', error);
                this.debugStatusElement.textContent = 'Erreur test: ' + error.message;
            }
            
            console.log('🎵 === SIMULATE NOTE END ===');
        }
        
        async toggleMicrophone() {
            console.log('🎤 === TOGGLE MICROPHONE START ===');
            
            if (this.microphoneActive) {
                this.stopMicrophone();
            } else {
                try {
                    await this.initializeAudio();
                    this.micBtn.textContent = '🎤 Désactiver Microphone';
                    this.micBtn.style.backgroundColor = '#f44336';
                    this.micStatusElement.textContent = 'Activé - Détection active';
                    this.debugStatusElement.textContent = 'Microphone actif - Détection en cours';
                    console.log('✅ Microphone activated');
                    
                    // Démarrer la détection avec un délai
                    setTimeout(() => {
                        this.startPitchDetection();
                    }, 500);
                    
                } catch (error) {
                    console.error('❌ Error activating microphone:', error);
                    this.debugStatusElement.textContent = 'Erreur micro: ' + error.message;
                    alert('Erreur microphone: ' + error.message);
                }
            }
            
            console.log('🎤 === TOGGLE MICROPHONE END ===');
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
            
            // Configuration sensible
            this.analyser.fftSize = 4096;
            this.analyser.smoothingTimeConstant = 0.3;
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = -10;
            
            this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
            
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
                
                // MISE À JOUR SÉCURISÉE DES ÉLÉMENTS
                const volEl = document.getElementById('volume');
                const freqEl = document.getElementById('frequency');
                if (volEl) volEl.textContent = this.currentVolume;
                if (freqEl) freqEl.textContent = '0';
                
                // Seuil pour détecter une note
                if (maxAmplitude > -80) {
                    const sampleRate = this.audioContext.sampleRate;
                    const frequency = (maxIndex * sampleRate) / this.analyser.fftSize;
                    this.lastDetectedFreq = frequency;
                    
                    if (freqEl) freqEl.textContent = frequency.toFixed(1);
                    
                    // Convertir en note
                    const detectedNote = this.frequencyToNote(frequency);
                    if (detectedNote) {
                        this.lastDetectedNote = detectedNote;
                        const frenchName = getNoteFrenchName(detectedNote);
                        
                        // *** MISE À JOUR CRITIQUE AVEC PROTECTION ***
                        const noteEl = document.getElementById('playedNote');
                        const freqDisplayEl = document.getElementById('playedFreq');
                        
                        if (noteEl && freqDisplayEl) {
                            noteEl.textContent = frenchName;
                            freqDisplayEl.textContent = frequency.toFixed(1) + ' Hz';
                            
                            // Log une fois par seconde seulement
                            if (Math.random() < 0.02) { // ~2% chance = environ 1x par seconde
                                console.log(`🎵 Note: ${detectedNote} (${frenchName}) - ${frequency.toFixed(1)} Hz`);
                            }
                        } else {
                            console.warn('⚠️ playedNote/playedFreq elements not found during detection');
                        }
                    }
                } else {
                    // Pas de son détecté - réinitialiser si silence total
                    if (maxAmplitude < -95) {
                        const noteEl = document.getElementById('playedNote');
                        const freqDisplayEl = document.getElementById('playedFreq');
                        if (noteEl && freqDisplayEl) {
                            noteEl.textContent = '-';
                            freqDisplayEl.textContent = '- Hz';
                        }
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
            
            for (const [note, freq] of Object.entries(NOTE_FREQUENCIES)) {
                const difference = Math.abs(frequency - freq);
                if (difference < minDifference) {
                    minDifference = difference;
                    closestNote = note;
                }
            }
            
            // Tolérance de 15%
            if (closestNote && minDifference < NOTE_FREQUENCIES[closestNote] * 0.15) {
                return closestNote;
            }
            
            return null;
        }
        
        stopMicrophone() {
            console.log('🛑 Stopping microphone...');
            this.microphoneActive = false;
            this.pitchDetectionActive = false;
            
            if (this.microphone) {
                try {
                    this.microphone.disconnect();
                } catch (e) {
                    console.warn('Warning disconnecting microphone:', e);
                }
            }
            if (this.audioContext) {
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
        
        startGame() {
            console.log('🚀 Starting game...');
            this.isPlaying = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.debugStatusElement.textContent = 'Jeu en cours';
        }
        
        stopGame() {
            console.log('⏹️ Stopping game...');
            this.isPlaying = false;
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.debugStatusElement.textContent = this.microphoneActive ? 'Microphone actif' : 'Jeu arrêté';
        }
        
        showDebugInfo() {
            console.log('🔧 DEBUG INFO:');
            console.log(`Microphone active: ${this.microphoneActive}`);
            console.log(`Pitch detection active: ${this.pitchDetectionActive}`);
            console.log(`Game playing: ${this.isPlaying}`);
            console.log(`Last note: ${this.lastDetectedNote}`);
            console.log(`Last frequency: ${this.lastDetectedFreq}`);
            console.log(`Current volume: ${this.currentVolume}`);
            
            // Test des éléments DOM
            const noteEl = document.getElementById('playedNote');
            const freqEl = document.getElementById('playedFreq');
            console.log(`playedNote element: ${noteEl ? 'OK' : 'NOT FOUND'}`);
            console.log(`playedFreq element: ${freqEl ? 'OK' : 'NOT FOUND'}`);
            
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
            
            // Test de dessin
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.fillRect(10, 10, 50, 20);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.fillText('Canvas OK v2.3.6', 15, 22);
        }
    }
    
    // Démarrer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForLoad);
    } else {
        waitForLoad();
    }
    
})();
