# 🎻 Cello Rhythm Game - Ave Maria v2.4.0

Un jeu de rythme musical interactif pour violoncelle basé sur l'Ave Maria de Gounod. Le jeu détecte les notes jouées en temps réel via le microphone et évalue la précision du joueur.

**Version actuelle : v2.4.0** - DURÉES PROPORTIONNELLES - Ave Maria complète avec durées visuelles

## 🎼 Nouveautés v2.4.0
- **🎵 Ave Maria complète** : Mélodie entière de Gounod (39 notes)
- **📏 Durées visuelles** : Largeur des notes proportionnelle à leur durée musicale
- **📁 Fichier séparé** : `melody.js` contient toute la mélodie
- **🎶 Notation standard** : Double croche = 1, Croche = 2, Noire = 4, etc.

## 🔧 Corrections v2.3.x précédentes
- **v2.3.9** : Détection optimisée pour les notes graves du violoncelle
- **v2.3.8** : Algorithme YIN précis comme un accordeur professionnel  
- **v2.3.7** : Jeu complet avec notes sur portée en temps réel
- **v2.3.6** : Stabilisation de la détection (plus de clignotement)

## 🎮 Fonctionnalités

### 🎼 Musique et notation
- **Ave Maria de Gounod** complète transcrite pour violoncelle
- **Durées proportionnelles** : Les notes longues sont visuellement plus larges
- **Clé de fa** adaptée au registre du violoncelle
- **39 notes** couvrant toute la prière

### 🎯 Détection audio ultra-précise
- **Algorithme YIN** : Détection de pitch professionelle
- **Optimisé graves** : Spécialement calibré pour les cordes graves du violoncelle
- **Tolérance 50 cents** : Précision d'accordeur professionnel
- **Anti-octave** : Détecte la vraie fondamentale, pas les harmoniques

### 🎨 Interface visuelle
- **Notes proportionnelles** : Double croche = fine, Ronde = large
- **Note jouée en temps réel** : Jaune brillant sur la ligne de jeu
- **Portée complète** : Notes graves et aiguës avec lignes supplémentaires
- **Système de score** : Perfect/OK/Miss avec combo

## 📁 Structure des fichiers

```
cello-rhythm-game/
├── index.html          # Page principale
├── style.css           # Styles et animations  
├── melody.js           # Ave Maria complète avec durées
├── script.js           # Moteur de jeu et détection audio
└── README.md           # Ce fichier
```

## 🚀 Installation

### Option 1: GitHub Pages (Recommandée)

1. **Créer un repository** sur GitHub
2. **Uploader les 4 fichiers** : `index.html`, `style.css`, `melody.js`, `script.js`
3. **Activer Pages** : Settings → Pages → Branch: main
4. **Accéder** : `https://votreusername.github.io/nom-du-repo`

### Option 2: Serveur local

```bash
# Télécharger tous les fichiers dans un dossier
# Puis servir avec un serveur HTTP

# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Puis ouvrir http://localhost:8000
```

## 🎵 Comment jouer

### 🎤 Mode accordage
1. **"🎤 Activer Microphone"** → Accepter les permissions
2. **Jouer des notes** → Voir l'affichage en temps réel
3. **Vérifier l'accordage** → Utiliser comme accordeur précis

### 🎮 Mode jeu complet
1. **"Commencer le jeu"** → Ave Maria démarre
2. **Voir les notes arriver** de droite à gauche
3. **Jouer au bon moment** quand elles atteignent la ligne rouge
4. **Notes longues** = rectangles larges, **notes courtes** = cercles

### 🎯 Système de scoring
- **Perfect** (±25 cents) = 100 points + bonus combo
- **OK** (±35 cents) = 50 points + bonus combo réduit
- **Miss** = 0 points, combo reset

## 🎼 Personnalisation des mélodies

### Ajouter une nouvelle mélodie

Éditez `melody.js` :

```javascript
// Durées (double croche = 1)
const NOTE_DURATIONS = {
    DOUBLE_CROCHE: 1,
    CROCHE: 2, 
    NOIRE: 4,
    NOIRE_POINTEE: 6,
    BLANCHE: 8,
    BLANCHE_POINTEE: 12,
    RONDE: 16
};

const MA_MELODIE = [
    { note: 'C3', duration: NOTE_DURATIONS.NOIRE, startTime: 0 },
    { note: 'D3', duration: NOTE_DURATIONS.BLANCHE, startTime: 4 },
    // ... autres notes
];
```

### Notation des durées
- **startTime** : Position temporelle (en unités de double croche)
- **duration** : Durée musicale (double croche = 1, noire = 4, etc.)
- **note** : Nom anglo-saxon ('C3', 'D#4', etc.)

## ⚙️ Configuration technique

### Prérequis
- Navigateur moderne (Chrome/Firefox recommandé)
- Microphone fonctionnel  
- HTTPS pour l'accès microphone (automatique sur GitHub Pages)

### Paramètres modifiables

Dans `script.js`, section `GAME_CONFIG` :

```javascript
const GAME_CONFIG = {
    scrollSpeed: 80,         // Vitesse de défilement
    hitLineX: 150,          // Position ligne de jeu
    perfectThreshold: 25,    // Seuil "perfect" (cents)
    okThreshold: 35,        // Seuil "ok" (cents)  
    judgmentWindow: 800     // Fenêtre de timing (ms)
};
```

### Gamme de détection
- **Plage** : 50-1200 Hz (violoncelle complet)
- **Résolution** : FFT 16384 (haute précision)
- **Algorithme** : YIN avec validation harmonique
- **Spécialisation graves** : Optimisé pour cordes Do/Sol

## 🛠️ Résolution de problèmes

### ❌ Fichier melody.js non trouvé
- **Vérifiez** que `melody.js` est dans le même dossier
- **Rechargez** avec Ctrl+F5
- **Console** : Message d'erreur de chargement

### 🎵 Notes pas détectées
- **Volume** : Jouez assez fort (-60 dB minimum)
- **Accord** : Vérifiez l'accordage de votre violoncelle
- **Position** : 30cm du microphone recommandé

### 🎼 Notes graves imprécises  
- **Jouez soutenu** : Les graves ont besoin de plus de temps
- **Archet ferme** : Son stable et continu
- **Vérifiez** dans la console les infos de debug

### 📱 Sur mobile/tablette
- **Performance réduite** : L'algorithme YIN est exigeant
- **Microphone** : Peut être moins sensible
- **Alternative** : Utiliser sur ordinateur pour de meilleures performances

## 🎓 Utilisation pédagogique

### Pour professeurs de violoncelle
- **Outil d'accordage** précis pour les élèves
- **Travail du rythme** avec durées visuelles
- **Motivation** : Aspect ludique du jeu
- **Répertoire** : Ave Maria classique accessible

### Pour élèves
- **Feedback immédiat** sur l'intonation
- **Visualisation** des durées musicales
- **Progression** avec système de score
- **Autonomie** : Peut s'exercer seul

## 📄 Licence et crédits

- **Code** : Libre d'utilisation pour l'éducation musicale
- **Ave Maria** : Charles Gounod (1818-1893) - Domaine public
- **Algorithme YIN** : Implémentation libre basée sur les travaux de recherche
- **Éducation** : Utilisation libre dans un contexte pédagogique

## 🤝 Contribution

Améliorations bienvenues :
- **Nouvelles mélodies** classiques 
- **Modes de difficulté** variables
- **Support multi-instruments**
- **Sauvegarde des scores**
- **Mode duo/ensemble**

---

**Bon jeu et bonne musique ! 🎼🎻**
