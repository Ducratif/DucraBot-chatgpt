# 🤖 DucraBot — Discord Bot Node.js (Slash Commands)  
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=180&text=DucraBot&fontAlign=50&fontAlignY=35&desc=Slash%20Commands%20%E2%80%A2%20DB%20interne%20%E2%80%A2%20Auto-Setup&descAlign=50&descAlignY=55" />
</p>

<p align="center">
  <a href="#"><img alt="Node" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white"></a>
  <a href="#"><img alt="discord.js" src="https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white"></a>
  <a href="#"><img alt="Commands" src="https://img.shields.io/badge/Slash%20Commands-Auto%20Deploy-00C853"></a>
  <a href="#"><img alt="DB" src="https://img.shields.io/badge/DB-Interne%20(JSON)-FF6D00"></a>
  <a href="#"><img alt="Setup" src="https://img.shields.io/badge/Setup-1%20commande-7C4DFF"></a>
</p>

<p align="center">
  <a href="#">
    <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&pause=900&center=true&vCenter=true&width=760&lines=Un+bot+Discord+autonome+%3A+z%C3%A9ro+MySQL+externe.;Token+s%C3%A9par%C3%A9+dans+.env+%E2%80%A2+config+ultra+simple.;Au+d%C3%A9marrage+%3A+reset+%2B+redeploy+des+slash+commands.;%2Fsetup+cr%C3%A9e+les+channels+%2B+permissions+automatiquement." alt="Typing SVG" />
  </a>
</p>

---

## ✨ Pourquoi DucraBot ?

✅ **Plug & Play** : tu clones, tu mets le token, tu démarres.  
✅ **Aucune base externe** : DB interne auto-gérée (`data/db.json`).  
✅ **Secrets propres** : `DISCORD_TOKEN` uniquement dans `.env`.  
✅ **Slash commands fiables** : au démarrage le bot **supprime** l’existant puis **réinstalle**.  
✅ **Un seul serveur** : commandes **déployées et utilisables uniquement** sur la guild configurée (`guildId`).  
✅ **Auto-Setup** : une commande (`/setup`) pour créer **channels + permissions**.

---

## 🧭 Sommaire
- [Fonctionnalités](#-fonctionnalités)
- [Pré-requis](#-pré-requis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Auto-Setup](#-auto-setup)
- [Commandes](#-commandes)
- [Structure du projet](#-structure-du-projet)
- [DB interne](#-db-interne)
- [Déploiement Pterodactyl](#-déploiement-pterodactyl)
- [Dépannage](#-dépannage)
- [Sécurité](#-sécurité)
- [Roadmap](#-roadmap)
- [Licence](#-licence)

---

## 🚀 Fonctionnalités

### ⚡ Slash Commands — Auto reset & redeploy
À **chaque** démarrage :
1) Le bot supprime les commandes slash déjà enregistrées sur la guild  
2) Il redéploie la **liste propre** du bot

➡️ Résultat : zéro commande “fantôme”, zéro mismatch.

### 🧱 DB interne (zéro MySQL)
- Stockage local : `data/db.json`
- Création auto si absent
- Réparation automatique si fichier invalide
- Utilisée pour stocker :
  - IDs des channels créés via `/setup`
  - settings (welcome message, auto-role, etc.)

### 🏗️ /setup : l’installation en 1 commande
- Création des salons manquants
- Permissions automatiques (lecture seule, privé staff/owner…)
- Enregistrement en DB

### 🔒 Verrouillage 1 serveur
Les interactions hors de `guildId` sont refusées (ephemeral).  
➡️ Le bot n’est **pas** utilisable ailleurs par erreur.

---

## 🧰 Pré-requis
- **Node.js 18+** (recommandé : 20+)
- Un bot créé sur le **Discord Developer Portal**
- Le bot ajouté sur ton serveur avec les permissions nécessaires (Manage Channels pour `/setup`)

---

## 📥 Installation

```bash
git clone https://github.com/Ducratif/DucraBot-chatgpt.git
cd DucraBot-chatgpt
npm install
```

---

## ⚙️ Configuration

### 1) Secrets — `.env`
Copie le template :
```bash
cp .env.example .env
```

Puis ouvre `.env` :
```env
DISCORD_TOKEN=TON_TOKEN_ICI
```

> ⚠️ Ne mets jamais ton token dans `config.json` ni dans le code.

---

### 2) Config — `config.json`
Exemple :
```json
{
  "guildId": "123456789012345678",
  "ownerId": "123456789012345678",
  "staffRoleId": null,
  "features": {
    "welcome": true
  },
  "defaults": {
    "welcomeMessage": "Bienvenue {user} sur **{server}** !"
  }
}
```

**Champs :**
- `guildId` : **ID du serveur** où le bot est autorisé
- `ownerId` : ton ID Discord (owner)
- `staffRoleId` : (optionnel) rôle staff pour accès salons privés
- `features.welcome` : active/désactive le welcome
- `defaults.welcomeMessage` : template (`{user}`, `{server}`)

---

## ▶️ Lancement

```bash
npm start
```

✅ Ensuite sur ton serveur : **`/setup`** (une fois)

---

## 🏗 Auto-Setup

### ✅ Ce que fait `/setup`
- Crée les salons manquants
- Applique les permissions (lecture seule / privé staff / etc.)
- Sauvegarde les IDs dans la DB interne

> Tu peux relancer `/setup` : il complète sans casser.

---

## 🧾 Commandes

> Le bot est structuré pour accueillir **beaucoup** de commandes, proprement (1 fichier = 1 commande).
> La liste exacte dépend de ton repo, mais voici le fonctionnement attendu :

### 👑 Admin / Owner
- `/setup` → création + config auto
- (optionnel selon ton code) `/say`, `/announce`, `/config`, `/purge`, `/kick`, `/ban`, `/unban`

### 🙋 Membres
- `/help` → affiche l’aide
- `/ping` → latence / état

---

## 🗂 Structure du projet

```text
.
├─ src/
│  ├─ commands/              # Slash commands
│  ├─ events/                # Events Discord (ready, interactionCreate, guildMemberAdd…)
│  ├─ utils/                 # Helpers (deploy commands, guards, logs…)
│  └─ index.js               # Entrée du bot
├─ data/
│  └─ db.json                # DB interne auto-gérée
├─ .env.example              # Template env
├─ config.json               # Config sans secrets
├─ package.json
└─ README.md
```

---

## 🧠 DB interne

📍 **Chemin :** `data/db.json`  
✅ **Auto-créée** au premier lancement  
✅ **Auto-réparée** en cas de problème  
💡 À sauvegarder si tu migres de machine

> Reset propre : stop le bot → supprime `data/db.json` → relance.

---

## 🧩 Déploiement Pterodactyl

### Startup
- Image Node.js : **18 / 20**
- Commande :
```bash
npm start
```

### Variables
Tu peux soit :
- garder `.env` (simple)
- ou mettre `DISCORD_TOKEN` en variable d’environnement via le panel (souvent plus safe)

### Permissions
Assure-toi que le dossier `data/` est accessible en écriture.

---

## 🛠 Dépannage

<details>
<summary><b>Les slash commands n'apparaissent pas</b></summary>

- Vérifie `guildId` dans `config.json`
- Vérifie que le bot est bien sur la guild
- Redémarre le bot (redeploy automatique)
- Vérifie que ton token est bon (`.env`)
</details>

<details>
<summary><b>Erreur "Missing Access"</b></summary>

- Le bot a besoin des perms pour ce qu’il fait (ex: `Manage Channels` pour `/setup`)
- Vérifie l’ordre des rôles : le rôle du bot doit être au-dessus des rôles à gérer
</details>

<details>
<summary><b>Le bot répond "pas configuré pour ce serveur"</b></summary>

Normal : verrouillage volontaire sur une seule guild (`guildId`).
</details>

<details>
<summary><b>DB corrompue</b></summary>

Le bot tente de réparer automatiquement.  
Sinon : supprime `data/db.json` et relance.
</details>

---

## 🔐 Sécurité

✅ Token uniquement dans `.env`  
✅ Config sans secrets  
✅ DB locale uniquement  
✅ Lock sur 1 guild

Ajoute ceci à ton `.gitignore` :
```gitignore
.env
data/db.json
node_modules
```

---

## 🗺 Roadmap

- [ ] Automod (anti-lien / anti-spam)
- [ ] Système tickets (panels boutons)
- [ ] Logs avancés (audit, join/leave, mod actions)
- [ ] Giveaway / sondages / suggestions
- [ ] Dashboard config (optionnel)

---

## 📄 Licence

Ajoute une licence selon ton usage :
- MIT (simple, permissive)
- GPL (open-source strict)
- Propriétaire (si privé)

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&height=2&text=&section=footer" />
</p>
