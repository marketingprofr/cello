const melody = [];
                const measures = []; // ✅ NOUVEAU: Array des mesures
                
                // ✅ CORRECTION: Calculer les temps de mesure de manière absolue
                for (const measureElement of measureElements) {
                    const measureNumber = parseInt(measureElement.getAttribute('number'));
                    
                    // ✅ CORRECTION: Temps absolu basé sur le numéro de mesure
                    // Chaque mesure fait 4 temps (4/4), soit 8 unités XML (divisions=2)
                    const measureStartTime = (measureNumber - 1) * 8; // Mesure 1 = temps 0, mesure 2 = temps 8, etc.
                    
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
