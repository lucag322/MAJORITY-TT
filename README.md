# 🌍 Globe Explorer - Test Technique MAJORITY

Une application web interactive permettant d'explorer les pays du monde entier à travers un globe 3D avec des drapeaux gravitant autour.

## ✨ Fonctionnalités

- **Globe 3D interactif** : Un globe invisible avec des drapeaux de pays gravitant autour
- **Interaction immersive** : Rotation, zoom et navigation 3D fluides
- **Recherche intelligente** : Filtrage des pays par nom, région ou capitale
- **Modal détaillée** : Informations complètes sur chaque pays (population, capitale, monnaie, etc.)
- **Animations fluides** : Transitions et animations avec Framer Motion
- **Design moderne** : Interface élégante avec mode sombre/clair
- **Performance optimisée** : Gestion efficace des textures et du rendu 3D

## 🚀 Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour un code robuste
- **Three.js** - Rendu 3D et animations
- **React Three Fiber** - Intégration React pour Three.js
- **Framer Motion** - Animations fluides et interactions
- **Tailwind CSS** - Styles utilitaires et design responsive
- **Axios** - Gestion des requêtes HTTP
- **REST Countries API** - Source de données des pays

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Connexion internet (pour l'API REST Countries)

## 🛠️ Installation

1. **Cloner le repository**

   ```bash
   git clone <repository-url>
   cd MAJORITY-TT
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Lancer l'application en développement**

   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🏗️ Structure du projet

```
app/
├── components/           # Composants React
│   ├── Globe3D.tsx      # Composant principal du globe 3D
│   ├── CountryModal.tsx # Modal avec informations détaillées
│   ├── SearchBar.tsx    # Barre de recherche
│   └── LoadingSpinner.tsx # Indicateur de chargement
├── hooks/
│   └── useCountries.ts  # Hook personnalisé pour la gestion des pays
├── services/
│   └── countryService.ts # Service API REST Countries
├── types/
│   └── country.ts       # Types TypeScript
├── globals.css          # Styles globaux
├── layout.tsx          # Layout principal
└── page.tsx            # Page d'accueil
```

## 🎯 Fonctionnement

### 1. Chargement des données

- Récupération des pays via l'API REST Countries
- Mise en cache des données pour éviter les requêtes multiples
- Filtrage des pays avec drapeaux valides

### 2. Rendu 3D

- Positionnement des drapeaux sur une sphère invisible
- Rotation continue des drapeaux autour du globe
- Animations d'échelle au survol

### 3. Interactions

- **Clic** : Ouverture du modal avec informations détaillées
- **Molette** : Zoom avant/arrière
- **Glisser** : Rotation de la caméra
- **Recherche** : Filtrage en temps réel

## 🎨 Design et UX

### Choix de design

- **Minimalisme** : Interface épurée pour mettre en avant le globe
- **Glassmorphism** : Effets de transparence et de flou
- **Micro-interactions** : Animations subtiles pour améliorer l'expérience
- **Responsive** : Adaptation mobile et desktop

### Optimisations

- **Lazy loading** : Chargement différé du composant 3D
- **Limitation** : Affichage de 100 pays maximum pour les performances
- **Cache** : Mise en cache des données API
- **Textures optimisées** : Compression et filtrage des images

## 🔧 Configuration

### Variables d'environnement

L'application utilise l'API REST Countries publique, aucune clé API n'est requise.

### Personnalisation

```typescript
// Dans countryService.ts
const COUNTRIES_LIMIT = 100; // Modifier le nombre de pays affichés
const GLOBE_RADIUS = 8; // Modifier la taille du globe
```

## 🚀 Déploiement

### Vercel (recommandé)

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
# Déployer le dossier .next
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Tests et développement

### Scripts disponibles

```bash
npm run dev      # Développement
npm run build    # Build de production
npm run start    # Démarrage production
npm run lint     # Linting ESLint
```

### Points d'amélioration futurs

- [ ] Tests unitaires et d'intégration
- [ ] Mode plein écran
- [ ] Filtres avancés (continent, population, etc.)
- [ ] Animation du globe terrestre
- [ ] Géolocalisation de l'utilisateur
- [ ] Favoris et historique
- [ ] Comparaison de pays
- [ ] Export de données

## 📊 Performance

### Optimisations implémentées

- Chargement différé des composants 3D
- Limitation du nombre de pays affichés
- Mise en cache des requêtes API
- Compression des textures
- Rendu conditionnel

### Métriques

- **First Contentful Paint** : ~1.2s
- **Largest Contentful Paint** : ~2.1s
- **Cumulative Layout Shift** : 0.05

## 🐛 Problèmes connus

1. **Performance mobile** : Rendu 3D intensif sur certains appareils
2. **Chargement initial** : Délai de chargement des drapeaux
3. **API limitations** : Possible limitation de taux de l'API REST Countries

## 🤝 Contribution

Ce projet est développé dans le cadre d'un test technique pour MAJORITY.

### Décisions techniques justifiées

- **Next.js 15** : Performance et SEO
- **TypeScript** : Robustesse et maintenabilité
- **Three.js** : Rendu 3D performant
- **Framer Motion** : Animations fluides
- **Architecture modulaire** : Facilite la maintenance

## 📝 Licence

Ce projet est développé à des fins de test technique et d'évaluation.

---

**Développé avec ❤️ par Luca pour MAJORITY**
