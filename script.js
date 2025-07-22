class CelloRhythmGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isPlaying = false;
        this.startTime = 0;
        this.currentTime = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        
        // Audio
        this.audioContext = null;
        this.microphone = null;
        this.analyser = null;
        this.dataArray = null;
        this.lastDetectedNote = null;
        this.lastDetectedFreq = 0;
        
        // Notes à jouer
        this.gameNotes = [];
        this.playedNotes = [];
        
        // Elements DOM
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.scoreElement = document.getElementById('score');
        this.comboElement = document.getElementById('combo');
        this.playedNoteElement = document.getElementById('playedNote');
        this.playedOctaveElement = document.getElementById('playedOctave');
        this.judgmentElement = document.getElementById('judgment');
        this.micStatusElement = document.getElementById('micStatus');
        this.frequencyElement = document.getElementById('frequency');
        
        this.initializeEventListeners();
        this.setupCanvas();
        this.initializeGameNotes();
        
        // Animation loop
        this.animate = this.animate.bind(this);
        this.animate();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.stopBtn.addEventListener('click', () => this.stopGame());
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    initializeGameNotes() {
        this.gameNotes = AVE_MARIA_MELODY.map(noteData => ({
            ...noteData,
            x: this.canvas.width / devicePixelRatio + (noteData.startTime * GAME_CONFIG.scrollSpeed),
            y: STAFF_POSITIONS[noteData.note],
            played: false,
            missed: false
        }));
    }
    
    async startGame() {
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
        } catch (error) {
            console.error('Erreur lors du démarrage:', error);
            alert('Erreur: Impossible d\'accéder au microphone. Veuillez autoriser l\'accès.');
        }
    }
    
    stopGame() {
        this.isPlaying = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        
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
        this.analyser.smoothingTimeConstant = 0.8;
        
        this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
        
        this.microphone.connect(this.analyser);
        this.micStatusElement.textContent = 'Activé';
        
        // Démarrer la détection de fréquence
        this.detectPitch();
    }
    
    detectPitch() {
        if (!this.isPlaying) return;
        
        this.analyser.getFloatFrequencyData(this.dataArray);
        
        const minDecibels = -60;
        const sampleRate = this.audioContext.sampleRate;
        const nyquist = sampleRate / 2;
        const frequencyResolution = nyquist / this.dataArray.length;
        
        let maxAmplitude = -Infinity;
        let maxIndex = 0;
        
        // Chercher le pic de fréquence le plus fort dans la gamme du violoncelle (60-600 Hz)
        const minIndex = Math.floor(60 / frequencyResolution);
        const maxIndexSearch = Math.floor(600 / frequencyResolution);
        
        for (let i = minIndex; i < maxIndexSearch && i < this.dataArray.length; i++) {
            if (this.dataArray[i] > maxAmplitude && this.dataArray[i] > minDecibels) {
                maxAmplitude = this.dataArray[i];
                maxIndex = i;
            }
        }
        
        if (maxAmplitude > minDecibels) {
            const frequency = maxIndex * frequencyResolution;
            this.lastDetectedFreq = frequency;
            this.frequencyElement.textContent = frequency.toFixed(1);
            
            const detectedNote = this.frequencyToNote(frequency);
            if (detectedNote) {
                this.lastDetectedNote = detectedNote;
                const frenchName = getNoteFrenchName(detectedNote);
                const octave = detectedNote.slice(1);
                this.playedNoteElement.textContent = frenchName.charAt(0) + frenchName.charAt(1).toLowerCase();
                this.playedOctaveElement.textContent = octave;
                
                // Vérifier si la note correspond à une note attendue
                this.checkNoteMatch(detectedNote, frequency);
            }
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
        
        // Vérifier que la différence n'est pas trop importante (tolérance de 100 cents)
        if (closestNote && minDifference < NOTE_FREQUENCIES[closestNote] * 0.06) {
            return closestNote;
        }
        
        return null;
    }
    
    checkNoteMatch(detectedNote, frequency) {
        const currentTime = (Date.now() - this.startTime) / 1000;
        const hitLineTime = GAME_CONFIG.hitLineX / GAME_CONFIG.scrollSpeed;
        
        // Chercher les notes dans la fenêtre de jugement
        for (const note of this.gameNotes) {
            if (note.played || note.missed) continue;
            
            const noteTime = note.startTime;
            const timeDifference = Math.abs((currentTime + hitLineTime) - noteTime);
            
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
                    break;
                }
            }
        }
    }
    
    showJudgment(judgment) {
        this.judgmentElement.textContent = judgment.toUpperCase();
        this.judgmentElement.className = `judgment ${judgment}`;
        
        // Effacer après 1 seconde
        setTimeout(() => {
            this.judgmentElement.textContent = '';
            this.judgmentElement.className = 'judgment';
        }, 1000);
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.comboElement.textContent = this.combo;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width / devicePixelRatio, this.canvas.height / devicePixelRatio);
        
        if (this.isPlaying) {
            this.currentTime = (Date.now() - this.startTime) / 1000;
            this.updateGameNotes();
            this.checkMissedNotes();
        }
        
        this.drawStaff();
        this.drawClef();
        this.drawGameNotes();
        this.drawHitLine();
        
        requestAnimationFrame(this.animate);
    }
    
    updateGameNotes() {
        for (const note of this.gameNotes) {
            note.x -= (GAME_CONFIG.scrollSpeed * 16) / 1000; // 60 FPS approximation
        }
    }
    
    checkMissedNotes() {
        for (const note of this.gameNotes) {
            if (!note.played && !note.missed && note.x < GAME_CONFIG.hitLineX - 50) {
                note.missed = true;
                this.combo = 0;
                this.showJudgment('miss');
                this.updateUI();
            }
        }
    }
    
    drawStaff() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        
        // Lignes de la portée
        for (const y of GAME_CONFIG.staffLineY) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width / devicePixelRatio, y);
            this.ctx.stroke();
        }
    }
    
    drawClef() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 60px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('𝄢', 30, 100); // Clé de fa
    }
    
    drawGameNotes() {
        for (const note of this.gameNotes) {
            if (note.x < -20 || note.x > (this.canvas.width / devicePixelRatio) + 20) continue;
            
            let color = '#4CAF50';
            if (note.played) {
                color = '#2196F3';
            } else if (note.missed) {
                color = '#f44336';
            }
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(note.x, note.y, GAME_CONFIG.noteRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Lignes supplémentaires si nécessaire
            if (note.y < GAME_CONFIG.staffLineY[0] - 10) {
                // Lignes au-dessus
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 1;
                let lineY = GAME_CONFIG.staffLineY[0] - 20;
                while (lineY >= note.y - 5) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(note.x - 15, lineY);
                    this.ctx.lineTo(note.x + 15, lineY);
                    this.ctx.stroke();
                    lineY -= 20;
                }
            } else if (note.y > GAME_CONFIG.staffLineY[4] + 10) {
                // Lignes en-dessous
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 1;
                let lineY = GAME_CONFIG.staffLineY[4] + 20;
                while (lineY <= note.y + 5) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(note.x - 15, lineY);
                    this.ctx.lineTo(note.x + 15, lineY);
                    this.ctx.stroke();
                    lineY += 20;
                }
            }
        }
    }
    
    drawHitLine() {
        this.ctx.strokeStyle = '#FF5722';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(GAME_CONFIG.hitLineX, 20);
        this.ctx.lineTo(GAME_CONFIG.hitLineX, 160);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
}

// Initialiser le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new CelloRhythmGame();
});
