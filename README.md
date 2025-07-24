## 🐳 Local Docker Setup for FlexiPay
** This guide explains how to run FlexiPay locally using Docker Compose, ideal for development and testing before deploying to Docker Swarm, cloud, or production environments.**

## 📁 Project Structure

```bash
flexipay/
│
├── models/
│ ├── User.model.js
│ ├── PaymentMethod.model.js
│ └── Transaction.model.js
│
├── routes/
│ ├── payment.routes.js
│ ├── merchant.routes.js
│ └── webhook.routes.js
│
├── services/
│ ├── stripe.service.js
│ ├── paypal.service.js
│ └── scheduler.service.js
│
├── utils/
│ ├── paginate.js
│ ├── slice.js
│ └── response.js
│
├── jobs/
│ └── weeklyPayout.js
│
├── config/
│ └── stripe.js
│ └── paypal.js
│
└── index.js
└── Dockerfile
└── .dockerignore
└── docker-compose.yaml
└── .env.compose
```


## ⚙️ Requirements
1. Docker Engine installed

2. Docker Compose v2+ installed

3. Port 5000 (app) and 27017 (MongoDB) should be free

---

## 📁 Environment Variables
   Create a .env.compose file in the root directory
```bash
MONGO_URL=mongodb://mongo:27017/flexipay
NODE_ENV=development
PORT=5000
```
---


## 🐳 Docker Compose Configuration

```bash
version: "3.8"

networks:
  over-node:
    driver: bridge

volumes:
  mongo-data:

services:
  web:
    build:
      context: .
    image: flexipay:1.0.1
    env_file:
      - .env
    ports:
      - "5000:5000"
    networks:
      - over-node

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    networks:
      - over-node
    volumes:
      - mongo-data:/data/db

```

---

## 🚀 Running the Project Locally

Start the compose dile
   ```bash
   docker compose up
   ```

Your backend should now be available at:

http://localhost:5000
MongoDB will be running in the background at:

mongodb://mongo:27017/flexipay

---

## 🧼 Cleanup
To stop and remove containers, networks, and volumes:
```bash
docker compose down -v --remove-orphans
```

## 📄 .dockerignore
Ensure your .dockerignore excludes unnecessary files:
```bash
node_modules
.env
logs
.git
 ```
---

## 📌 Deploy to Azure Container Application 

## 📦 Prerequisites
- Docker image built and pushed to a container registry (e.g. Docker Hub or Azure Container Registry)
- Azure CLI installed & logged in
- Azure subscription + resource group ready

## 🚀 Deployment Steps
1. Build & Push the docker image
   ```bash
   docker build -t <your-image-name> .
   docker tag <your-image-name> <registry>/<your-image-name>:v1
   docker push <registry>/<your-image-name>:v1
   ```
2. Create Azure Container App from the Portal
3.Create a new cluster on Mongo Atlas (as a SAAS) and configure the access white-list
4. Configure Environment Variables
5. Check Logs

---

## 👥 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change or enhance.

---

## 📝 License

MIT © 2025 FlexiPay

```

Would you like me to generate an example `.env`, a Postman collection, or include Stripe setup notes in the README?
```
