// Version debug ultra-simple pour identifier le problème
(function() {
    'use strict';
    
    console.log('🔧 DEBUG VERSION v2.3.5 - Test ciblage DOM');
    
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
            console.log('🎻 Creating game...');
            
            // Test immédiat des éléments DOM
            this.testDOMElements();
            
            // Variables de base
            this.microphoneActive = false;
            this.audioContext = null;
            this.microphone = null;
            this.analyser = null;
            
            // Initialiser
            this.initializeElements();
            this.initializeEventListeners();
            
            console.log('✅ Game created');
        }
        
        testDOMElements() {
            console.log('🔍 Testing DOM elements...');
            
            const playedNote = document.getElementById('playedNote');
            const playedFreq = document.getElementById('playedFreq');
            
            console.log('playedNote element:', playedNote);
            console.log('playedFreq element:', playedFreq);
            
            if (playedNote) {
                console.log('playedNote current text:', playedNote.textContent);
            } else {
                console.error('❌ playedNote NOT FOUND');
            }
            
            if (playedFreq) {
                console.log('playedFreq current text:', playedFreq.textContent);
            } else {
                console.error('❌ playedFreq NOT FOUND');
            }
        }
        
        initializeElements() {
            console.log('🎯 Initializing elements...');
            
            // Éléments critiques pour le test
            this.playedNoteElement = document.getElementById('playedNote');
            this.playedFreqElement = document.getElementById('playedFreq');
            
            // Vérification immédiate
            if (!this.playedNoteElement) {
                throw new Error('playedNote element not found!');
            }
            if (!this.playedFreqElement) {
                throw new Error('playedFreq element not found!');
            }
            
            console.log('✅ playedNote element found:', this.playedNoteElement);
            console.log('✅ playedFreq element found:', this.playedFreqElement);
            
            // Autres éléments
            this.micBtn = document.getElementById('micBtn');
            this.startBtn = document.getElementById('startBtn');
            this.testBtn = document.getElementById('testBtn');
            this.debugBtn = document.getElementById('debugBtn');
            this.debugStatusElement = document.getElementById('debugStatus');
            
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
            
            this.debugBtn.onclick = () => {
                console.log('🔧 DEBUG BUTTON CLICKED');
                this.testDOMAfterAction();
            };
            
            console.log('✅ Event listeners ready');
        }
        
        simulateNote() {
            console.log('🎵 === SIMULATE NOTE START ===');
            
            // Vérifier les éléments AVANT de les modifier
            console.log('Pre-check playedNote element:', this.playedNoteElement);
            console.log('Pre-check playedFreq element:', this.playedFreqElement);
            
            if (!this.playedNoteElement) {
                console.error('❌ playedNoteElement is NULL!');
                this.debugStatusElement.textContent = 'ERREUR: playedNoteElement null';
                return;
            }
            
            if (!this.playedFreqElement) {
                console.error('❌ playedFreqElement is NULL!');
                this.debugStatusElement.textContent = 'ERREUR: playedFreqElement null';
                return;
            }
            
            try {
                console.log('Updating playedNote to "Do3"...');
                this.playedNoteElement.textContent = 'Do3';
                console.log('playedNote updated, new value:', this.playedNoteElement.textContent);
                
                console.log('Updating playedFreq to "130.8 Hz"...');
                this.playedFreqElement.textContent = '130.8 Hz';
                console.log('playedFreq updated, new value:', this.playedFreqElement.textContent);
                
                this.debugStatusElement.textContent = 'Test réussi!';
                console.log('✅ SIMULATE NOTE SUCCESS');
                
            } catch (error) {
                console.error('❌ Error in simulateNote:', error);
                this.debugStatusElement.textContent = 'Erreur test: ' + error.message;
            }
            
            console.log('🎵 === SIMULATE NOTE END ===');
        }
        
        async toggleMicrophone() {
            console.log('🎤 === TOGGLE MICROPHONE START ===');
            
            if (this.microphoneActive) {
                console.log('Stopping microphone...');
                this.stopMicrophone();
            } else {
                console.log('Starting microphone...');
                try {
                    await this.initializeAudio();
                    this.micBtn.textContent = '🎤 Désactiver Microphone';
                    this.micBtn.style.backgroundColor = '#f44336';
                    this.debugStatusElement.textContent = 'Microphone actif';
                    console.log('✅ Microphone activated');
                } catch (error) {
                    console.error('❌ Error activating microphone:', error);
                    this.debugStatusElement.textContent = 'Erreur micro: ' + error.message;
                }
            }
            
            // TESTER LES ÉLÉMENTS DOM APRÈS ACTIVATION
            console.log('Post-microphone DOM test:');
            this.testDOMAfterAction();
            
            console.log('🎤 === TOGGLE MICROPHONE END ===');
        }
        
        async initializeAudio() {
            console.log('🎤 Initializing audio...');
            
            // TEST DOM AVANT initializeAudio
            console.log('DOM check BEFORE audio init:');
            console.log('playedNoteElement:', this.playedNoteElement);
            console.log('playedFreqElement:', this.playedFreqElement);
            
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
            this.analyser.fftSize = 2048;
            
            this.microphone.connect(this.analyser);
            this.microphoneActive = true;
            
            // TEST DOM APRÈS initializeAudio
            console.log('DOM check AFTER audio init:');
            console.log('playedNoteElement:', this.playedNoteElement);
            console.log('playedFreqElement:', this.playedFreqElement);
            
            console.log('✅ Audio initialized, NOT starting detectPitch yet');
            
            // NE PAS démarrer detectPitch pour l'instant
            // this.detectPitch();
        }
        
        stopMicrophone() {
            console.log('🛑 Stopping microphone...');
            this.microphoneActive = false;
            
            if (this.microphone) {
                this.microphone.disconnect();
            }
            if (this.audioContext) {
                this.audioContext.close();
            }
            
            this.micBtn.textContent = '🎤 Activer Microphone';
            this.micBtn.style.backgroundColor = '#4CAF50';
            this.debugStatusElement.textContent = 'Microphone arrêté';
            
            // Réinitialiser l'affichage
            this.playedNoteElement.textContent = '-';
            this.playedFreqElement.textContent = '- Hz';
        }
        
        startGame() {
            console.log('🚀 === START GAME START ===');
            
            // TESTER LES ÉLÉMENTS DOM AVANT DE DÉMARRER
            this.testDOMAfterAction();
            
            this.debugStatusElement.textContent = 'Jeu démarré (mode debug)';
            console.log('✅ Game started in debug mode');
            
            console.log('🚀 === START GAME END ===');
        }
        
        testDOMAfterAction() {
            console.log('🔍 === DOM TEST AFTER ACTION ===');
            
            // Re-chercher les éléments dans le DOM
            const freshPlayedNote = document.getElementById('playedNote');
            const freshPlayedFreq = document.getElementById('playedFreq');
            
            console.log('Fresh lookup - playedNote:', freshPlayedNote);
            console.log('Fresh lookup - playedFreq:', freshPlayedFreq);
            
            console.log('Stored reference - playedNote:', this.playedNoteElement);
            console.log('Stored reference - playedFreq:', this.playedFreqElement);
            
            // Vérifier si les références sont identiques
            console.log('References match - playedNote:', freshPlayedNote === this.playedNoteElement);
            console.log('References match - playedFreq:', freshPlayedFreq === this.playedFreqElement);
            
            // Tenter une mise à jour avec les références fraîches
            if (freshPlayedNote && freshPlayedFreq) {
                console.log('Attempting update with fresh references...');
                freshPlayedNote.textContent = 'TEST FRESH';
                freshPlayedFreq.textContent = 'FRESH Hz';
                console.log('✅ Update with fresh references SUCCESS');
            } else {
                console.error('❌ Fresh references are null!');
            }
            
            console.log('🔍 === DOM TEST END ===');
        }
    }
    
    // Démarrer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForLoad);
    } else {
        waitForLoad();
    }
    
})();
