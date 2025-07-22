// Version robuste qui gère les erreurs
(function() {
    'use strict';
    
    // ═══════════════════════════════════════
    // 🎻 CELLO RHYTHM GAME v2.2
    // Dernière mise à jour: 22/07/2025
    // ═══════════════════════════════════════
    
    const GAME_VERSION = "v2.2";
    let game = null;
    
    // Attendre que tout soit chargé
    function waitForLoad() {
        if (document.readyState === 'complete') {
            console.log(`🎻 Cello Rhythm Game ${GAME_VERSION} - DOM fully loaded`);
            checkFilesVersion();
            initializeGame();
        } else {
            setTimeout(waitForLoad, 100);
        }
    }
    
    function checkFilesVersion() {
        console.log(`📋 Vérification des fichiers ${GAME_VERSION}:`);
        
        const checks = {
            'notes.js': typeof AVE_MARIA_MELODY !== 'undefined' && typeof GAME_CONFIG !== 'undefined',
            'style.css': document.querySelector('.version') !== null,
            'HTML': document.querySelector('.version-footer') !== null,
            'script.js': true // Ce fichier s'exécute
        };
        
        let allOK = true;
        for (let [file, status] of Object.entries(checks)) {
            console.log(`${status ? '✅' : '❌'} ${file}: ${status ? 'OK' : 'MANQUANT'}`);
            if (!status) allOK = false;
        }
        
        const fileStatusElement = document.getElementById('fileStatus');
        if (fileStatusElement) {
            fileStatusElement.textContent = allOK ? `Tous OK (${GAME_VERSION})` : 'Erreurs détectées';
            fileStatusElement.style.color = allOK ? '#4CAF50' : '#f44336';
        }
        
        console.log(`📊 État global: ${allOK ? '✅ Tous les fichiers OK' : '❌ Erreurs détectées'}`);
        return allOK;
    }
    
    function initializeGame() {
        try {
            // Vérifier que tous les éléments existent
            const requiredElements = [
                'gameCanvas', 'startBtn', 'stopBtn', 'testBtn', 'debugBtn',
                'score', 'combo', 'playedNote', 'playedOctave', 'judgment',
                'micStatus', 'frequency', 'volume', 'debugStatus', 'activeNotes', 'gameTime'
            ];
            
            for (let id of requiredElements) {
                if (!document.getElementById(id)) {
                    console.error(`❌ Element missing: ${id}`);
                    return;
                }
            }
            
            console.log('✅ All DOM elements found');
            game = new CelloRhythmGame();
            
        } catch (error) {
            console.error('❌ Error initializing game:', error);
            document.body.innerHTML = `
                <div style="color: white; padding: 20px; background: #000;">
                    <h1>🎻 Erreur de chargement</h1>
                    <p><strong>Erreur:</strong> ${error.message}</p>
                    <p><strong>Solution:</strong> Rechargez la page ou essayez dans un autre navigateur</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 10px;">Recharger la page</button>
                </div>
            `;
        }
    }
    
    class CelloRhythmGame {
        constructor() {
            console.log(`🎻 Creating CelloRhythmGame instance ${GAME_VERSION}...`);
            console.log('═══════════════════════════════════════');
            console.log('🎼 Ave Maria de Gounod - Violoncelle');
            console.log('📅 Build: 22/07/2025');
            console.log('🔧 Mode: Debug + Robuste');
            console.log('═══════════════════════════════════════');
            
            // Elements DOM avec vérification
            this.canvas = this.getElement('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Variables de jeu
            this.isPlaying = false;
            this.startTime = 0;
            this.currentTime = 0;
            this.score = 0;
            this.combo = 0;
            
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
            
            // Elements DOM
            this.initializeElements();
            this.initializeEventListeners();
            this.setupCanvas();
            this.initializeGameNotes();
            
            console.log('✅ CelloRhythmGame created successfully');
            
            // Démarrer l'animation
            this.animate();
        }
        
        getElement(id) {
            const element = document.getElementById(id);
            if (!element) {
                throw new Error(`Element ${id} not found`);
            }
            return element;
        }
        
        initializeElements() {
            this.startBtn = this.getElement('startBtn');
            this.stopBtn = this.getElement('stopBtn');
            this.testBtn = this.getElement('testBtn');
            this.debugBtn = this.getElement('debugBtn');
            this.scoreElement = this.getElement('score');
            this.comboElement = this.getElement('combo');
            this.playedNoteElement = this.getElement('playedNote');
            this.playedOctaveElement = this.getElement('playedOctave');
            this.judgmentElement = this.getElement('judgment');
            this.micStatusElement = this.getElement('micStatus');
            this.frequencyElement = this.getElement('frequency');
            this.volumeElement = this.getElement('volume');
            this.debugStatusElement = this.getElement('debugStatus');
            this.activeNotesElement = this.getElement('activeNotes');
            this.gameTimeElement = this.getElement('gameTime');
        }
        
        initializeEventListeners() {
            console.log('🎯 Setting up event listeners...');
            
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
                this.playedNoteElement.textContent = 'Do';
                this.playedOctaveElement.textContent = '3';
                this.showJudgment('perfect');
                
                this.debugStatusElement.textContent = 'Test réussi!';
                console.log('✅ Note simulation successful');
                
                setTimeout(() => {
                    this.debugStatusElement.textContent = 'En attente';
                }, 2000);
                
            } catch (error) {
                console.error('❌ Error in simulateNote:', error);
                this.debugStatusElement.textContent = 'Erreur test: ' + error.message;
            }
        }
        
        showDebugInfo() {
            console.log('🔧 Showing debug info...');
            
            const info = {
                'Game playing': this.isPlaying,
                'Current time': this.currentTime,
                'Canvas dimensions': `${this.canvas.width}x${this.canvas.height}`,
                'Game notes count': this.gameNotes.length,
                'Audio context': this.audioContext ? 'Active' : 'Inactive',
                'Microphone': this.microphone ? 'Connected' : 'Disconnected',
                'Last detected note': this.lastDetectedNote || 'None',
                'Last detected freq': this.lastDetectedFreq,
                'Current volume': this.currentVolume
            };
            
            console.log('=== DEBUG INFO ===');
            for (let [key, value] of Object.entries(info)) {
                console.log(`${key}: ${value}`);
            }
            console.log('==================');
            
            this.debugStatusElement.textContent = 'Debug affiché en console';
            setTimeout(() => {
                this.debugStatusElement.textContent = 'En attente';
            }, 2000);
        }
        
        setupCanvas() {
            console.log('🎨 Setting up canvas...');
            
            try {
                const container = this.canvas.parentElement;
                const width = Math.min(800, container.clientWidth - 20);
                const height = 200;
                
                this.canvas.width = width;
                this.canvas.height = height;
                this.canvas.style.width = width + 'px';
                this.canvas.style.height = height + 'px';
                
                console.log(`✅ Canvas setup: ${width}x${height}`);
                
                // Test de dessin
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.fillRect(10, 10, 50, 20);
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '12px Arial';
                this.ctx.fillText('Canvas OK', 15, 22);
                
            } catch (error) {
                console.error('❌ Canvas setup error:', error);
                throw error;
            }
        }
        
        initializeGameNotes() {
            console.log('🎼 Initializing game notes...');
            
            try {
                if (typeof AVE_MARIA_MELODY === 'undefined') {
                    throw new Error('AVE_MARIA_MELODY not defined');
                }
                
                if (typeof STAFF_POSITIONS === 'undefined') {
                    throw new Error('STAFF_POSITIONS not defined');
                }
                
                if (typeof GAME_CONFIG === 'undefined') {
                    throw new Error('GAME_CONFIG not defined');
                }
                
                this.gameNotes = AVE_MARIA_MELODY.map((noteData, index) => {
                    // Position initiale plus proche pour voir les notes arriver
                    const startX = this.canvas.width + 50 + (noteData.startTime * GAME_CONFIG.scrollSpeed);
                    const note = {
                        ...noteData,
                        x: startX,
                        y: STAFF_POSITIONS[noteData.note] || 90,
                        played: false,
                        missed: false,
                        id: index
                    };
                    
                    console.log(`Note ${index}: ${noteData.note} at x=${note.x}, y=${note.y}, startTime=${noteData.startTime}`);
                    return note;
                });
                
                console.log(`✅ ${this.gameNotes.length} notes initialized`);
                
                // Ajouter quelques notes de test qui arrivent rapidement pour debug
                this.gameNotes.unshift(
                    { note: 'C3', x: this.canvas.width + 100, y: 130, startTime: 1, played: false, missed: false, id: -1 },
                    { note: 'D3', x: this.canvas.width + 200, y: 110, startTime: 2, played: false, missed: false, id: -2 },
                    { note: 'G3', x: this.canvas.width + 300, y: 80, startTime: 3, played: false, missed: false, id: -3 }
                );
                console.log('🔧 Ajout de 3 notes de test pour debug');
                
            } catch (error) {
                console.error('❌ Error initializing notes:', error);
                this.gameNotes = [
                    // Notes de secours avec des positions visibles
                    { note: 'C3', x: this.canvas.width - 100, y: 130, startTime: 1, played: false, missed: false, id: 0 },
                    { note: 'D3', x: this.canvas.width + 50, y: 110, startTime: 2, played: false, missed: false, id: 1 },
                    { note: 'G3', x: this.canvas.width + 150, y: 80, startTime: 3, played: false, missed: false, id: 2 }
                ];
                console.log('⚠️ Using fallback notes');
            }
        }
        
        async startGame() {
            console.log('🚀 Starting game...');
            this.debugStatusElement.textContent = 'Démarrage...';
            
            try {
                this.isPlaying = true;
                this.startTime = Date.now();
                this.score = 0;
                this.combo = 0;
                this.initializeGameNotes();
                this.updateUI();
                this.startBtn.disabled = true;
                this.stopBtn.disabled = false;
                this.debugStatusElement.textContent = 'Jeu actif (pas d\'audio)';
                
                console.log('✅ Game started (without audio for now)');
                
                // Essayer d'initialiser l'audio (optionnel)
                try {
                    await this.initializeAudio();
                } catch (audioError) {
                    console.warn('⚠️ Audio not available:', audioError.message);
                    this.micStatusElement.textContent = 'Non disponible';
                }
                
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
            this.debugStatusElement.textContent = 'Arrêté';
            
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
            
            this.micStatusElement.textContent = 'Désactivé';
            this.judgmentElement.textContent = '';
            this.judgmentElement.className = 'judgment';
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
                    noiseSuppression: false,
                    sampleRate: 44100
                } 
            });
            
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            
            // Configuration plus sensible
            this.analyser.fftSize = 8192;  // Plus de résolution
            this.analyser.smoothingTimeConstant = 0.1;  // Moins de lissage
            this.analyser.minDecibels = -100;  // Plus sensible aux faibles volumes
            this.analyser.maxDecibels = -10;
            
            this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
            
            this.microphone.connect(this.analyser);
            this.micStatusElement.textContent = 'Activé - Sensibilité élevée';
            
            console.log('✅ Audio initialized with high sensitivity');
            this.detectPitch();
        }
        
        detectPitch() {
            if (!this.isPlaying || !this.analyser) {
                if (this.isPlaying) {
                    requestAnimationFrame(() => this.detectPitch());
                }
                return;
            }
            
            try {
                this.analyser.getFloatFrequencyData(this.dataArray);
                
                let maxAmplitude = -Infinity;
                let maxIndex = 0;
                
                // Recherche dans une plage plus large et avec seuil plus bas
                for (let i = 5; i < this.dataArray.length / 2; i++) {
                    if (this.dataArray[i] > maxAmplitude) {
                        maxAmplitude = this.dataArray[i];
                        maxIndex = i;
                    }
                }
                
                this.currentVolume = Math.round(maxAmplitude);
                this.volumeElement.textContent = this.currentVolume;
                
                // Seuil beaucoup plus bas pour détecter les notes plus facilement
                if (maxAmplitude > -80) {  // Était -60, maintenant -80 (plus sensible)
                    const sampleRate = this.audioContext.sampleRate;
                    const frequency = (maxIndex * sampleRate) / this.analyser.fftSize;
                    this.lastDetectedFreq = frequency;
                    this.frequencyElement.textContent = frequency.toFixed(1);
                    
                    const detectedNote = this.frequencyToNote(frequency);
                    if (detectedNote && typeof getNoteFrenchName === 'function') {
                        this.lastDetectedNote = detectedNote;
                        const frenchName = getNoteFrenchName(detectedNote);
                        const octave = detectedNote.slice(1);
                        this.playedNoteElement.textContent = frenchName.replace(/[0-9]/g, '');
                        this.playedOctaveElement.textContent = octave;
                        
                        console.log(`🎵 Note détectée: ${detectedNote} (${frequency.toFixed(1)} Hz)`);
                    }
                } else {
                    this.frequencyElement.textContent = '0';
                }
                
            } catch (error) {
                console.warn('Audio detection error:', error);
            }
            
            requestAnimationFrame(() => this.detectPitch());
        }
        
        frequencyToNote(frequency) {
            if (typeof NOTE_FREQUENCIES === 'undefined') {
                return null;
            }
            
            let closestNote = null;
            let minDifference = Infinity;
            
            for (const [note, freq] of Object.entries(NOTE_FREQUENCIES)) {
                const difference = Math.abs(frequency - freq);
                if (difference < minDifference) {
                    minDifference = difference;
                    closestNote = note;
                }
            }
            
            // Tolérance plus large (15% au lieu de 10%)
            if (closestNote && minDifference < NOTE_FREQUENCIES[closestNote] * 0.15) {
                return closestNote;
            }
            
            return null;
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
            const speed = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.scrollSpeed : 80;
            for (const note of this.gameNotes) {
                note.x -= speed / 60;
            }
        }
        
        drawStaff() {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            
            const staffY = [50, 70, 90, 110, 130];
            for (const y of staffY) {
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
            const noteRadius = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.noteRadius : 12;
            
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
                
                // Dessiner la note avec contour
                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(note.x, note.y, noteRadius, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
                
                // Afficher le nom de la note pendant plus longtemps pour debug
                if (this.currentTime < 30) {  // 30 secondes au lieu de 10
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 12px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(note.note, note.x, note.y - 25);
                }
                
                // Dessiner les lignes supplémentaires si nécessaire
                this.drawLedgerLines(note);
            }
            
            // Debug: afficher le nombre de notes visibles
            if (visibleCount === 0 && this.isPlaying && this.currentTime < 10) {
                console.log(`⚠️ No visible notes at time ${this.currentTime.toFixed(1)}s`);
                // Dessiner un message de debug sur le canvas
                this.ctx.fillStyle = '#FF5722';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('En attente des notes...', this.canvas.width / 2, 30);
            } else if (visibleCount > 0) {
                console.log(`🎵 ${visibleCount} notes visibles à t=${this.currentTime.toFixed(1)}s`);
            }
        }
        
        drawHitLine() {
            const hitLineX = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.hitLineX : 150;
            this.ctx.strokeStyle = '#FF5722';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([10, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(hitLineX, 20);
            this.ctx.lineTo(hitLineX, 160);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }
    
    // Démarrer quand tout est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForLoad);
    } else {
        waitForLoad();
    }
    
})();
