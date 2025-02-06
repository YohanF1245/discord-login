# Discord OAuth Login

## Installation

Pour installer les dépendances, exécutez la commande suivante :

```bash
npm install
```

## Démarrage de l'application

Pour démarrer l'application, utilisez la commande suivante :

```bash
npm run start
```

## Authentification

Pour vous connecter via Discord, accédez à l'URL suivante :

```bash
http://localhost:3000/auth/discord
```

Après vous être connecté, vous recevrez un token JWT. Utilisez ce token pour accéder à la route suivante en l'incluant dans l'en-tête `Authorization` de votre requête GET :

```bash
http://localhost:3000/auth/me
```

## Utilisation de Postman pour la requête GET

### Étapes à suivre :

1. **Ouvrir Postman** : Lancez l'application Postman sur votre ordinateur.
2. **Créer une nouvelle requête** :
   - Cliquez sur le bouton "New" ou "Nouvelle requête".
   - Sélectionnez "Request" ou "Requête".
3. **Configurer la requête** :
   - Choisissez le type de requête `GET`.
   - Entrez l'URL suivante dans le champ d'URL : 
     ```bash
     http://localhost:3000/auth/me
     ```
4. **Ajouter l'en-tête d'autorisation** :
   - Allez dans l'onglet "Headers" ou "En-têtes".
   - Ajoutez une nouvelle clé `Authorization` et définissez sa valeur sur `Bearer YOUR_JWT_TOKEN`, en remplaçant `YOUR_JWT_TOKEN` par le token que vous avez reçu après la connexion.
5. **Envoyer la requête** : Cliquez sur le bouton "Send" ou "Envoyer" pour exécuter la requête.

### Exemple d'en-tête

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Configuration du fichier `.env`

### Étapes pour créer le fichier `.env`

1. **Créer le fichier** : À la racine de votre projet, créez un fichier nommé `.env`.
2. **Ajouter les variables d'environnement** : Insérez les lignes suivantes dans le fichier :

    ```env
    # Identifiants de l'application Discord
    DISCORD_CLIENT_ID=your_client_id
    DISCORD_CLIENT_SECRET=your_client_secret
    DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback

    # Clé secrète pour JWT
    JWT_SECRET=your_jwt_secret
    ```

3. **Remplacer les valeurs** : Remplacez `your_client_id`, `your_client_secret` et `your_jwt_secret` par vos propres valeurs.

### Exemple de contenu du fichier `.env`

```env
# Identifiants de l'application Discord
DISCORD_CLIENT_ID=123456789012345678
DISCORD_CLIENT_SECRET=abcdefg1234567890
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback

# Clé secrète pour JWT
JWT_SECRET=supersecretkey