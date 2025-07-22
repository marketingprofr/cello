# 🎻 Cello Rhythm Game - Ave Maria

Un jeu de rythme musical interactif pour violoncelle basé sur l'Ave Maria de Gounod. Le jeu détecte les notes jouées en temps réel via le microphone et évalue la précision du joueur.

## 🎮 Fonctionnalités

- **Détection audio en temps réel** : Utilise l'API Web Audio pour détecter les notes jouées au violoncelle
- **Portée musicale défilante** : Notes en clé de Fa avec défilement horizontal
- **Système de jugement** : Perfect (±25 cents), OK (±50 cents), Miss (>50 cents)
- **Score et combo** : Système de points avec bonus de combo
- **Interface moderne** : Design sombre avec animations fluides
- **Mélodie classique** : Ave Maria de Gounod adaptée pour violoncelle

## 🚀 Installation

### Option 1: Drag & Drop sur GitHub Pages

1. **Créer un nouveau repository sur GitHub**
2. **Uploader les fichiers** : Glissez-déposez tous les fichiers dans votre repository
3. **Activer GitHub Pages** :
   - Allez dans Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / master
   - Folder: / (root)
4. **Accéder au jeu** : Votre jeu sera disponible à `https://votreusername.github.io/nom-du-repo`

### Option 2: Serveur local

```bash
# Cloner ou télécharger les fichiers
# Puis servir avec un serveur HTTP simple

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (avec http-server)
npx http-server

# Puis ouvrir http://localhost:8000
```

## 📁 Structure des fichiers

```
cello-rhythm-game/
├── index.html          # Page principale
├── style.css           # Styles et animations
├── script.js           # Logique principale du jeu
├── notes.js            # Données musicales (Ave Maria)
└── README.md           # Ce fichier
```

## 🎵 Comment jouer

1. **Démarrer** : Cliquez sur "Commencer"
2. **Autoriser le microphone** : Acceptez l'accès microphone quand demandé
3. **Jouer les notes** : Les notes défilent de droite à gauche
4. **Timing** : Jouez chaque note quand elle atteint la ligne rouge verticale
5. **Précision** : Plus vous êtes précis en intonation, plus vous gagnez de points

### Système de scoring

- **Perfect** : ±25 cents → 100 points + bonus combo
- **OK** : ±50 cents → 50 points + bonus combo réduit  
- **Miss** : >50 cents ou timing raté → 0 points, combo reset

## ⚙️ Configuration technique

### Prérequis
- Navigateur moderne supportant Web Audio API
- Microphone fonctionnel
- HTTPS recommandé pour l'accès microphone

### Paramètres modifiables (dans `notes.js`)

```javascript
const GAME_CONFIG = {
    scrollSpeed: 100,        // Vitesse de défilement (pixels/sec)
    hitLineX: 150,          // Position de la ligne de jugement
    perfectThreshold: 25,    // Seuil "perfect" en cents
    okThreshold: 50,        // Seuil "ok" en cents
    judgmentWindow: 200     // Fenêtre de timing (ms)
};
```

### Gamme de fréquences détectées
- **Plage** : 60-600 Hz (adaptée au violoncelle)
- **Notes** : Do2 (65.41 Hz) à Do5 (523.25 Hz)
- **Résolution** : Analyse FFT 4096 points

## 🛠️ Personnalisation

### Ajouter une nouvelle mélodie

Modifiez le tableau `AVE_MARIA_MELODY` dans `notes.js` :

```javascript
const NOUVELLE_MELODIE = [
    { note: 'G3', duration: 1.5, startTime: 0 },
    { note: 'C4', duration: 1.0, startTime: 1.5 },
    // ... autres notes
];
```

### Modifier l'apparence

Éditez `style.css` pour changer :
- Couleurs (variables CSS dans :root)
- Animations (keyframes)
- Tailles et positions

### Ajuster la détection audio

Dans `script.js`, méthode `detectPitch()` :
- `minDecibels` : Seuil de volume minimum
- `smoothingTimeConstant` : Lissage de l'analyse
- `fftSize` : Résolution de l'analyse

## 🎯 Conseils pour jouer

1. **Calibrage** : Jouez d'abord quelques notes pour vérifier la détection
2. **Position** : Placez-vous à ~30cm du microphone
3. **Environnement** : Évitez les bruits de fond
4. **Archet** : Notes soutenues détectées plus facilement que pizzicato
5. **Intonation** : La précision en cents est cruciale pour les scores élevés

## 🐛 Résolution de problèmes

### Le microphone ne fonctionne pas
- Vérifiez les permissions du navigateur
- Utilisez HTTPS (obligatoire sur certains navigateurs)
- Testez dans un autre navigateur

### Notes mal détectées
- Vérifiez le niveau sonore (ni trop fort, ni trop faible)
- Réduisez les bruits parasites
- Accordez votre violoncelle

### Performance lente
- Fermez les autres onglets
- Réduisez `fftSize` dans le code
- Utilisez un navigateur récent

## 📄 Licence

Ce projet est libre d'utilisation pour l'éducation musicale et le divertissement.

## 🤝 Contribution

Les améliorations sont les bienvenues ! Areas d'amélioration :
- Nouvelles mélodies classiques
- Modes de difficulté
- Meilleure détection de pitch
- Support multi-instruments
- Sauvegarde des scores

---

**Bon jeu ! 🎼**
