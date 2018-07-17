## Requirements

# Option 1
```
NodeJS
NPM
MondoDb
```

# Option 2
```
Docker
Docker Compose
```

## Getting Started

Install yarn:
```js
npm install -g yarn
```

Install dependencies:
```sh
yarn
```

Set environment (vars):
```sh
cp .env.example .env
```

Start server:
```sh
# Start server
yarn start

# Tests and List of the all end points
yarn test

# Run test along with code coverage
yarn test:coverage

# Run tests on file change
yarn test:watch
```

## Option 2 Docker

#### Using Docker Compose
``` docker-compose up -d
# Goint to docker console
 docker exec -it apirestful_api_1 bash

# Tests and List of the all end points
yarn test

# Run test along with code coverage
yarn test:coverage

# Run tests on file change
yarn test:watch
```

### Usage API

```
## Auth APIs
    # POST /api/auth/login
      { username: apiUser, password: express}

  ## Misc
    # GET /api/health-check
      ✓ should return OK
    # GET /api/404
      ✓ should return 404 status

  ## User APIs
    ✓ should get valid JWT token
    # POST /api/users
      Headers { Authorization: `Bearer ${token}`}
      Body {name: '', avatar: ''}
    # GET /api/users/:userId
      Headers { Authorization: `Bearer ${token}`}
    # PUT /api/users/:userId
      Headers { Authorization: `Bearer ${token}`}
      Body {name: '', avatar: ''}
    # GET /api/users/
      Headers { Authorization: `Bearer ${token}`}
    # DELETE /api/users/
      Headers { Authorization: `Bearer ${token}`}
      Body {name: '', avatar: ''}

  ## Article APIs
    ✓ should get valid JWT token
    # POST /api/articles
      Headers { Authorization: `Bearer ${token}`}
      Body {title: '', text: '', tags: [''], userId: ''}
    # GET /api/articles/:articleId
      Headers { Authorization: `Bearer ${token}`}
    # PUT /api/articles/:articleId
      Headers { Authorization: `Bearer ${token}`}
      Body {title: '', text: '', tags: [''], userId: ''}
    # GET /api/articles/
      Headers { Authorization: `Bearer ${token}`}
    # DELETE /api/articles/
      Headers { Authorization: `Bearer ${token}`}
      Body {title: '', text: '', tags: [''], userId: ''}
