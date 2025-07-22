class CelloRhythmGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
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
        
        // Notes à jouer
        this.gameNotes = [];
        
        // Elements DOM
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.testBtn = document.getElementById('testBtn');
        this.debugBtn = document.getElementById('debugBtn');
        this.scoreElement = document.getElementById('score');
        this.comboElement = document.getElementById('combo');
        this.playedNoteElement = document.getElementById('playedNote');
        this.playedOctaveElement = document.getElementById('playedOctave');
        this.judgmentElement = document.getElementById('judgment');
        this.micStatusElement = document.getElementById('micStatus');
        this.frequencyElement = document.getElementById('frequency');
        this.volumeElement = document.getElementById('volume');
        this.debugStatusElement = document.getElementById('debugStatus');
        this.activeNotesElement = document.getElementById('activeNotes');
        this.gameTimeElement = document.getElementById('gameTime');
        
        this.initializeEventListeners();
        this.setupCanvas();
        this.initializeGameNotes();
        
        console.log('🎻 Cello Rhythm Game initialized');
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        console.log('Game notes loaded:', this.gameNotes.length);
        
        // Animation loop
        this.animate = this.animate.bind(this);
        this.animate();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.stopBtn.addEventListener('click', () => this.stopGame());
        this.testBtn.addEventListener('click', () => this.simulateNote());
        this.debugBtn.addEventListener('click', () => this.showDebugInfo());
    }
    
    setupCanvas() {
        // Fixer les dimensions du canvas
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth - 20; // padding
        const containerHeight = 200;
        
        this.canvas.width = containerWidth;
        this.canvas.height = containerHeight;
        this.canvas.style.width = containerWidth + 'px';
        this.canvas.style.height = containerHeight + 'px';
        
        console.log('Canvas setup:', containerWidth, 'x', containerHeight);
    }
    
    initializeGameNotes() {
        this.gameNotes = AVE_MARIA_MELODY.map((noteData, index) => {
            const note = {
                ...noteData,
                x: this.canvas.width + (noteData.startTime * GAME_CONFIG.scrollSpeed),
                y: STAFF_POSITIONS[noteData.note] || 90, // Position par défaut si pas trouvée
                played: false,
                missed: false,
                id: index
            };
            console.log(`Note ${index}: ${noteData.note} at position x=${note.x}, y=${note.y}`);
            return note;
        });
        console.log('Game notes initialized:', this.gameNotes.length);
    }
    
    simulateNote() {
        // Simuler une note pour tester l'affichage
        this.lastDetectedNote = 'C3';
        this.lastDetectedFreq = 130.81;
        this.playedNoteElement.textContent = 'Do';
        this.playedOctaveElement.textContent = '3';
        this.showJudgment('perfect');
        console.log('🎵 Note simulée: Do3');
    }
    
    showDebugInfo() {
        console.log('=== DEBUG INFO ===');
        console.log('Game playing:', this.isPlaying);
        console.log('Current time:', this.currentTime);
        console.log('Game notes count:', this.gameNotes.length);
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        console.log('Active notes on screen:', this.gameNotes.filter(n => n.x > -50 && n.x < this.canvas.width + 50).length);
        console.log('Audio context:', this.audioContext ? 'Active' : 'Inactive');
        console.log('Microphone:', this.microphone ? 'Connected' : 'Disconnected');
        
        // Log positions of first few notes
        this.gameNotes.slice(0, 5).forEach((note, i) => {
            console.log(`Note ${i}: ${note.note} at x=${note.x}, y=${note.y}`);
        });
    }
    
    async startGame() {
        console.log('🚀 Starting game...');
        this.debugStatusElement.textContent = 'Démarrage...';
        
        try {
            await this.initializeAudio();
            this.isPlaying = true;
            this.startTime = Date.now();
            this.score = 0;
            this.combo = 0;
            this.initializeGameNotes();
            this.updateUI();
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.debugStatusElement.textContent = 'Jeu actif';
            
            console.log('✅ Game started successfully');
        } catch (error) {
            console.error('❌ Error starting game:', error);
            this.debugStatusElement.textContent = 'Erreur: ' + error.message;
            alert('Erreur: ' + error.message + '\nVérifiez que vous autorisez le microphone.');
        }
    }
    
    stopGame() {
        console.log('⏹️ Stopping game...');
        this.isPlaying = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.debugStatusElement.textContent = 'Arrêté';
        
        if (this.microphone) {
            this.microphone.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.micStatusElement.textContent = 'Désactivé';
        this.judgmentElement.textContent = '';
        this.judgmentElement.className = 'judgment';
    }
    
    async initializeAudio() {
        console.log('🎤 Initializing audio...');
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
        
        this.analyser.fftSize = 4096;
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;
        
        this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
        
        this.microphone.connect(this.analyser);
        this.micStatusElement.textContent = 'Activé';
        
        console.log('✅ Audio initialized');
        
        // Démarrer la détection de fréquence
        this.detectPitch();
    }
    
    detectPitch() {
        if (!this.isPlaying || !this.analyser) {
            requestAnimationFrame(() => this.detectPitch());
            return;
        }
        
        this.analyser.getFloatFrequencyData(this.dataArray);
        
        const minDecibels = -70;
        const sampleRate = this.audioContext.sampleRate;
        const nyquist = sampleRate / 2;
        const frequencyResolution = nyquist / this.dataArray.length;
        
        let maxAmplitude = -Infinity;
        let maxIndex = 0;
        
        // Calculer le volume général
        let totalEnergy = 0;
        const minIndex = Math.floor(60 / frequencyResolution);
        const maxIndexSearch = Math.floor(800 / frequencyResolution);
        
        for (let i = minIndex; i < maxIndexSearch && i < this.dataArray.length; i++) {
            const amplitude = this.dataArray[i];
            totalEnergy += Math.pow(10, amplitude / 10);
            
            if (amplitude > maxAmplitude && amplitude > minDecibels) {
                maxAmplitude = amplitude;
                maxIndex = i;
            }
        }
        
        this.currentVolume = Math.round(10 * Math.log10(totalEnergy / (maxIndexSearch - minIndex)));
        this.volumeElement.textContent = this.currentVolume;
        
        if (maxAmplitude > minDecibels) {
            const frequency = maxIndex * frequencyResolution;
            this.lastDetectedFreq = frequency;
            this.frequencyElement.textContent = frequency.toFixed(1);
            
            const detectedNote = this.frequencyToNote(frequency);
            if (detectedNote) {
                this.lastDetectedNote = detectedNote;
                const frenchName = getNoteFrenchName(detectedNote);
                const octave = detectedNote.slice(1);
                this.playedNoteElement.textContent = frenchName.replace(/[0-9]/g, '');
                this.playedOctaveElement.textContent = octave;
                
                // Vérifier si la note correspond à une note attendue
                this.checkNoteMatch(detectedNote, frequency);
            }
        } else {
            this.frequencyElement.textContent = '0';
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
        
        // Tolérance plus large pour la détection
        if (closestNote && minDifference < NOTE_FREQUENCIES[closestNote] * 0.1) {
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
                    // Note correcte, calculer la précision
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
                    console.log(`🎯 Note played: ${detectedNote}, judgment: ${judgment}, cents: ${centsDifference}`);
                    break;
                }
            }
        }
    }
    
    showJudgment(judgment) {
        this.judgmentElement.textContent = judgment.toUpperCase();
        this.judgmentElement.className = `judgment ${judgment}`;
        
        setTimeout(() => {
            this.judgmentElement.textContent = '';
            this.judgmentElement.className = 'judgment';
        }, 1000);
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.comboElement.textContent = this.combo;
        
        if (this.isPlaying) {
            this.gameTimeElement.textContent = this.currentTime.toFixed(1);
            const activeNotes = this.gameNotes.filter(n => 
                n.x > -50 && n.x < this.canvas.width + 50 && !n.played && !n.missed
            ).length;
            this.activeNotesElement.textContent = activeNotes;
        }
    }
    
    animate() {
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
        
        requestAnimationFrame(this.animate);
    }
    
    updateGameNotes() {
        for (const note of this.gameNotes) {
            note.x -= GAME_CONFIG.scrollSpeed / 60; // 60 FPS
        }
    }
    
    checkMissedNotes() {
        for (const note of this.gameNotes) {
            if (!note.played && !note.missed && note.x < GAME_CONFIG.hitLineX - 50) {
                note.missed = true;
                this.combo = 0;
                console.log(`❌ Note missed: ${note.note}`);
            }
        }
    }
    
    drawStaff() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        
        // Lignes de la portée
        for (const y of GAME_CONFIG.staffLineY) {
            this.ctx.beginPath();
            this.ctx.moveTo(60, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawClef() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 40px serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('𝄢', 30, 90); // Clé de fa
    }
    
    drawGameNotes() {
        let visibleNotes = 0;
        
        for (const note of this.gameNotes) {
            if (note.x < -30 || note.x > this.canvas.width + 30) continue;
            
            visibleNotes++;
            
            let color = '#4CAF50'; // Vert pour les notes à venir
            if (note.played) {
                color = '#2196F3'; // Bleu pour les notes jouées
            } else if (note.missed) {
                color = '#f44336'; // Rouge pour les notes ratées
            }
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(note.x, note.y, GAME_CONFIG.noteRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Lignes supplémentaires si nécessaire
            this.drawLedgerLines(note);
            
            // Debug: afficher le nom de la note
            if (this.currentTime < 5) { // Les 5 premières secondes
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(note.note, note.x, note.y - 15);
            }
        }
        
        // Debug dans console si pas de notes visibles
        if (visibleNotes === 0 && this.isPlaying) {
            console.log('⚠️ No visible notes! Current time:', this.currentTime);
        }
    }
    
    drawLedgerLines(note) {
        this.ctx.strokeStyle = note.played ? '#2196F3' : note.missed ? '#f44336' : '#4CAF50';
        this.ctx.lineWidth = 1;
        
        // Lignes au-dessus de la portée
        if (note.y < GAME_CONFIG.staffLineY[0]) {
            let lineY = GAME_CONFIG.staffLineY[0] - 20;
            while (lineY >= note.y - 5) {
                this.ctx.beginPath();
                this.ctx.moveTo(note.x - 12, lineY);
                this.ctx.lineTo(note.x + 12, lineY);
                this.ctx.stroke();
                lineY -= 20;
            }
        }
        
        // Lignes en-dessous de la portée
        if (note.y > GAME_CONFIG.staffLineY[4]) {
            let lineY = GAME_CONFIG.staffLineY[4] + 20;
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

// Initialiser le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎻 Loading Cello Rhythm Game...');
    new CelloRhythmGame();
});
