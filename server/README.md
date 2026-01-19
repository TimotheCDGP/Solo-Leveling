# Server - Solo Leveling

## Configuration de la base de données

### 1. Créer le fichier `.env`

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Le fichier `.env` contient :
```env
DATABASE_URL="postgresql://solodev:solopassword123@localhost:5432/solo_leveling?schema=public"
PORT=3000
```

### 2. Démarrer la base de données PostgreSQL

```bash
yarn db:up
```

Cette commande démarre le conteneur Docker PostgreSQL avec les identifiants suivants :
- **User**: `solodev`
- **Password**: `solopassword123`
- **Database**: `solo_leveling`
- **Port**: `5432`

### 3. Lancer les migrations

```bash
yarn db:migrate
```

### 4. Démarrer le serveur en mode développement

```bash
yarn start:dev
```

## Commandes disponibles

- `yarn db:up` - Démarrer la base de données PostgreSQL
- `yarn db:down` - Arrêter la base de données
- `yarn db:logs` - Voir les logs de PostgreSQL
- `yarn db:migrate` - Lancer les migrations Prisma
- `yarn db:studio` - Ouvrir Prisma Studio (interface graphique)
- `yarn start:dev` - Démarrer le serveur en mode développement

## Connexion à la base de données

La connexion utilise les identifiants du `docker-compose.yml` :
- Host: `localhost`
- Port: `5432`
- User: `solodev`
- Password: `solopassword123`
- Database: `solo_leveling`
