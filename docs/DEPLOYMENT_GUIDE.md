# Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring](#monitoring)
7. [Backup Strategy](#backup-strategy)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Docker 20.10+
- Docker Compose 2.0+
- kubectl (for Kubernetes deployment)
- Git
- PostgreSQL 15+ (for local development)
- Node.js 18+ (for local development)

### Infrastructure Requirements
- Server with at least:
  - 2 CPU cores
  - 4GB RAM
  - 20GB disk space
- For production:
  - 4+ CPU cores
  - 8GB+ RAM
  - 50GB+ disk space
- SSL certificate (HTTPS required in production)

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd soyeulylich
```

### 2. Configure Environment Variables
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Required variables:
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production

# OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Integrations
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
NOTION_CLIENT_ID=your-notion-client-id
NOTION_CLIENT_SECRET=your-notion-client-secret
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
STRIPE_SECRET_KEY=your-stripe-secret-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Build the Application
```bash
# Backend
cd backend
npm install
npm run build

# Frontend
cd frontend
npm install
npm run build
```

## Docker Deployment

### Local Development with Docker Compose

#### 1. Start Services
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5433
- Backend on port 3000
- Frontend on port 80

#### 2. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

#### 3. Stop Services
```bash
docker-compose down
```

#### 4. Rebuild After Changes
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Production Docker Deployment

#### 1. Build Images
```bash
# Build backend
docker build -t your-dockerhub-username/soyeulylich-backend:latest ./backend

# Build frontend
docker build -t your-dockerhub-username/soyeulylich-frontend:latest ./frontend
```

#### 2. Push to Docker Hub
```bash
docker login
docker push your-dockerhub-username/soyeulylich-backend:latest
docker push your-dockerhub-username/soyeulylich-frontend:latest
```

#### 3. Deploy to Server
```bash
# Copy docker-compose.yml to server
scp docker-compose.yml user@server:/opt/soyeulylich/

# SSH to server
ssh user@server

# On server:
cd /opt/soyeulylich
docker-compose pull
docker-compose up -d
```

#### 4. Configure Nginx Reverse Proxy (Optional)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Kubernetes Deployment

### 1. Create Kubernetes Secrets
```bash
kubectl create secret generic app-secrets \
  --from-literal=database-url="postgresql://user:password@postgres:5433/soyeulylich" \
  --from-literal=jwt-secret="your-jwt-secret" \
  --from-literal=google-client-id="your-google-client-id" \
  --from-literal=google-client-secret="your-google-client-secret"
```

### 2. Apply Deployments
```bash
# Apply backend
kubectl apply -f k8s/backend-deployment.yaml

# Apply frontend
kubectl apply -f k8s/frontend-deployment.yaml
```

### 3. Verify Deployment
```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check deployment status
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend
```

### 4. Expose Services
```bash
# For LoadBalancer (if supported by your cloud provider)
kubectl expose deployment frontend --type=LoadBalancer --port=80

# For Ingress (recommended)
kubectl apply -f k8s/ingress.yaml
```

### 5. Scaling
```bash
# Scale backend to 5 replicas
kubectl scale deployment backend --replicas=5

# Scale frontend to 3 replicas
kubectl scale deployment frontend --replicas=3

# Auto-scaling (Horizontal Pod Autoscaler)
kubectl apply -f k8s/hpa.yaml
```

### 6. Updates and Rollbacks
```bash
# Update image
kubectl set image deployment/backend backend=your-dockerhub-username/soyeulylich-backend:v2.0

# Rollback if needed
kubectl rollout undo deployment/backend

# Check rollout status
kubectl rollout status deployment/backend
```

## CI/CD Pipeline

### GitHub Actions Setup

#### 1. Configure Secrets
Go to GitHub repository Settings → Secrets and variables → Actions:
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password or access token
- `SERVER_HOST`: Production server hostname
- `SERVER_USER`: SSH username
- `SSH_PRIVATE_KEY`: SSH private key

#### 2. Workflow Triggers
The CI/CD pipeline triggers on:
- Push to `main` branch
- Push to `develop` branch
- Pull requests to `main` or `develop`

#### 3. Pipeline Stages
1. **Test Backend**: Run linter, tests, build
2. **Test Frontend**: Run linter, build
3. **Build and Push**: Build Docker images, push to Docker Hub
4. **Deploy**: SSH to server, pull images, restart services

#### 4. Manual Deployment
To deploy manually:
```bash
git push origin main
```

The pipeline will automatically:
- Run tests
- Build images
- Push to Docker Hub
- Deploy to production

## Monitoring

### Prometheus + Grafana

#### 1. Start Monitoring Stack
```bash
cd monitoring
docker-compose up -d
```

#### 2. Access Dashboards
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

#### 3. Configure Grafana Data Sources
1. Login to Grafana
2. Add Prometheus data source
3. URL: `http://prometheus:9090`
4. Import dashboards from Grafana Gallery

#### 4. Key Metrics to Monitor
- Backend request rate
- Backend response time
- Database connection pool
- Error rate
- CPU and memory usage
- Disk I/O

### Application Monitoring

#### Web Vitals
The application automatically tracks Core Web Vitals:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)

View metrics at: `GET /web-vitals/average`

#### Security Audit Logs
View security events at: `GET /security-audit/recent`

## Backup Strategy

### Database Backup

#### Automated Backup Script
The backup script (`scripts/backup.sh`) automates PostgreSQL backups:
- Creates timestamped backups
- Compresses with gzip
- Retains backups for 7 days
- Cleans up old backups automatically

#### Setup Cron Job
```bash
# Add to crontab
crontab -e

# Run backup daily at 2 AM
0 2 * * * /opt/soyeulylich/scripts/backup.sh
```

#### Manual Backup
```bash
cd scripts
./backup.sh
```

#### Restore from Backup
```bash
# Decompress backup
gunzip /opt/backups/soyeulylich_backup_YYYYMMDD_HHMMSS.sql.gz

# Restore
psql -U postgres -d soyeulylich < /opt/backups/soyeulylich_backup_YYYYMMDD_HHMMSS.sql
```

### Application Backup

#### Docker Volume Backup
```bash
# Backup volumes
docker run --rm -v soyeulylich_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data
```

#### Git Backup
- Use Git for code versioning
- Regular commits
- Tag releases

## SSL/HTTPS Configuration

### Using Let's Encrypt with Certbot

#### 1. Install Certbot
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

#### 2. Obtain Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 3. Auto-renewal
Certbot automatically sets up auto-renewal. Verify:
```bash
sudo certbot renew --dry-run
```

### Manual SSL Certificate

#### 1. Generate CSR
```bash
openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private.key -out /etc/ssl/certificate.csr
```

#### 2. Submit to CA
Submit CSR to your Certificate Authority.

#### 3. Configure Nginx
```nginx
ssl_certificate /etc/ssl/certificate.crt;
ssl_certificate_key /etc/ssl/private.key;
```

## Performance Optimization

### Backend
- Enable caching in production
- Use CDN for static assets
- Optimize database queries
- Enable gzip compression
- Scale horizontally

### Frontend
- Enable code splitting
- Optimize images
- Use CDN for static assets
- Enable browser caching
- Minimize JavaScript bundles

## Security Hardening

### Firewall Configuration
```bash
# Allow only necessary ports
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw deny 5433/tcp  # PostgreSQL (block external access)
ufw enable
```

### Fail2Ban
```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Security Headers
Ensure the following headers are set:
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `X-XSS-Protection`
- `Content-Security-Policy`

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs <container-name>

# Restart container
docker restart <container-name>

# Rebuild
docker-compose down
docker-compose build
docker-compose up -d
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs postgres

# Verify DATABASE_URL
docker-compose exec backend env | grep DATABASE_URL
```

### 502 Bad Gateway
- Check if backend is running
- Verify nginx configuration
- Check firewall rules
- Review backend logs

### High Memory Usage
```bash
# Check container resource usage
docker stats

# Restart containers
docker-compose restart

# Scale up resources in docker-compose.yml
```

### SSL Certificate Issues
```bash
# Check certificate expiry
openssl x509 -enddate -noout -in /path/to/cert.pem

# Renew certificate
sudo certbot renew

# Reload nginx
sudo systemctl reload nginx
```

## Health Checks

### Backend Health Endpoint
```bash
curl http://localhost:3000/health
```

### Frontend Health Check
```bash
curl http://localhost/
```

### Database Health Check
```bash
docker exec -it postgres psql -U postgres -d soyeulylich -c "SELECT 1"
```

## Rollback Procedure

### Docker Rollback
```bash
# Stop current version
docker-compose down

# Pull previous version
docker pull your-dockerhub-username/soyeulylich-backend:previous-tag
docker pull your-dockerhub-username/soyeulylich-frontend:previous-tag

# Update docker-compose.yml with previous tags
# Start services
docker-compose up -d
```

### Kubernetes Rollback
```bash
kubectl rollout undo deployment/backend
kubectl rollout undo deployment/frontend
```

## Maintenance

### Regular Tasks
- Weekly: Review logs for errors
- Monthly: Security updates
- Monthly: Database backup verification
- Quarterly: Performance review
- Quarterly: Security audit

### Log Rotation
Configure logrotate for application logs:
```bash
sudo nano /etc/logrotate.d/soyeulylich
```

### Database Maintenance
```bash
# Vacuum database
docker exec -it postgres psql -U postgres -d soyeulylich -c "VACUUM ANALYZE"

# Reindex
docker exec -it postgres psql -U postgres -d soyeulylich -c "REINDEX DATABASE soyeulylich"
```

## Support
For deployment issues:
- Check the Developer Guide
- Review API Documentation
- Check logs for error messages
- Contact the DevOps team
