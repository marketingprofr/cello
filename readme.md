# 🎻 Cello Rhythm Game - Ave Maria v2.2

Un jeu de rythme musical interactif pour violoncelle basé sur l'Ave Maria de Gounod. Le jeu détecte les notes jouées en temps réel via le microphone et évalue la précision du joueur.

**Version actuelle : v2.2** - Audio ultra-sensible + Notes toujours visibles

## 🆕 Nouveautés v2.2
- **🎤 Audio ultra-sensible** : Détection même avec un volume faible
- **🎵 Notes toujours visibles** : Affichage garanti sur la portée
- **🎯 Badge version visible** : Plus de doute sur la version installée
- **⚙️ Configuration plus tolérante** : Perfect ±35 cents, OK ±75 cents

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

## 🔍 Vérification des versions

### Interface utilisateur
- **Titre principal** : Le numéro de version apparaît à côté du titre
- **Pied de page** : Affiche la version et la date de mise à jour
- **Statut fichiers** : Indique si tous les fichiers sont bien chargés

### Console développeur (F12)
```
🎻 Cello Rhythm Game v2.1 - DOM fully loaded
📋 Vérification des fichiers v2.1:
✅ notes.js: OK
✅ style.css: OK  
✅ HTML: OK
✅ script.js: OK
📊 État global: ✅ Tous les fichiers OK
```

### Historique des versions
- **v2.2** : Audio ultra-sensible + notes toujours visibles + badge version
- **v2.1** : Système de versioning + robustesse améliorée  
- **v2.0** : Gestion d'erreurs complète + debug étendu
- **v1.0** : Version initiale

## ⚙️ Configuration technique

### Prérequis
- Navigateur moderne supportant Web Audio API
- Microphone fonctionnel
- HTTPS recommandé pour l'accès microphone

### Paramètres modifiables (dans `notes.js`)

```javascript
const GAME_CONFIG = {
    scrollSpeed: 60,         // Vitesse de défilement (pixels/sec)
    hitLineX: 150,          // Position de la ligne de jugement
    perfectThreshold: 35,    // Seuil "perfect" en cents (plus tolérant)
    okThreshold: 75,        // Seuil "ok" en cents (beaucoup plus tolérant)
    judgmentWindow: 500     // Fenêtre de timing (ms) - plus large
};
```

### Gamme de fréquences détectées
- **Plage** : 60-800 Hz (étendue pour violoncelle)
- **Notes** : Do2 (65.41 Hz) à Do5 (523.25 Hz)
- **Résolution** : Analyse FFT 8192 points (haute précision)
- **Sensibilité** : -100dB minimum (ultra-sensible)
- **Tolérance** : 15% d'écart fréquentiel accepté

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

1. **Volume** : Plus besoin de jouer très fort ! Volume normal suffisant
2. **Position** : Placez-vous à ~30cm du microphone
3. **Environnement** : Réduisez les bruits de fond autant que possible
4. **Archet** : Notes soutenues ET pizzicato fonctionnent maintenant
5. **Patience** : Les notes mettent quelques secondes à arriver
6. **Debug** : Les noms des notes s'affichent 30 secondes pour vous aider

## 🐛 Résolution de problèmes

### Le microphone ne fonctionne pas
- Vérifiez les permissions du navigateur
- Utilisez HTTPS (obligatoire sur certains navigateurs)
- Testez dans un autre navigateur
- Vérifiez que "Microphone: Activé - Sensibilité élevée" s'affiche

### Notes mal détectées ou volume trop faible
- ✅ **v2.2 corrige ce problème !** Ultra-sensible maintenant
- Le status devrait afficher "Sensibilité élevée"
- Volume normal suffisant (plus besoin de jouer très fort)

### Pas de notes sur la portée
- ✅ **v2.2 corrige ce problème !** Notes toujours visibles
- 3 notes de test ajoutées automatiquement
- Noms des notes affichés pendant 30 secondes

### Performance lente
- Fermez les autres onglets
- Utilisez un navigateur récent (Chrome/Firefox recommandé)

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
