CI / CD notes

1) workflows

- `.github/workflows/ci.yml` : démarre le stack via `docker compose up --build -d`, exécute les migrations Prisma dans le container `server`, lance les tests et build du client, puis down.

- `.github/workflows/cd.yml` : build et push des images vers GHCR. Les images sont taggées `branch-sha` et `latest` est également poussée pour `main`.


2) Migrations Prisma

- Le workflow CI exécute `npx prisma generate` puis `npx prisma migrate deploy` à l'intérieur du container `server` avant d'exécuter les tests.(`migrate deploy` est recommandée en CI pour appliquer les migrations déjà générées).

3) Déploiement et Exposition d'une URL publique pour une PR (preview)
- A faire 


