# AIent - AI Agent Marketplace

AIent is a decentralized marketplace for creating, trading, and interacting with AI agents. Built with Next.js 14, TypeScript, and Prisma.

## 🌟 Features

- 🔐 User authentication with JWT and secure session management
- 💼 AI agent creation and management
- 🏪 Marketplace for trading AI agents
- 📊 Real-time price charts and market data
- 💬 TradeGPT AI assistant for market insights
- 🌓 Dark/Light mode support
- 📱 Responsive design

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Context
- **Email Service:** Mailgun
- **AI Integration:** OpenAI API

## 📁 Project Structure
aient/
├── app/                    # Next.js app directory

│   ├── api/               # API routes

│   ├── (app)/             # Protected routes

│   ├── (marketing)/       # Public marketing pages

│   └── context/           # React Context providers

├── components/            # React components

│   ├── ui/               # shadcn/ui components

│   └── ...               # Custom components

├── lib/                   # Utility functions

├── prisma/               # Database schema and migrations

└── types/                # TypeScript type definitions


## 📦 Installation

sudo apt update && sudo apt upgrade -y
sudo apt install git curl -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - sudo apt install -y nodejs
sudo npm install -g pnpm
node -v
npm -v
pnpm -v


git clone https://github.com/ichidokiri/Launchpad-AIent.git
cd Launchpad-AIent
(copy .env to the current folder)
git pull origin main


pnpm install
sudo apt update && sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Enable it to start on boot
sudo systemctl status postgresql  # Check if it’s running
sudo -i -u postgres
psql
CREATE DATABASE launchpad_database;
ALTER USER postgres WITH PASSWORD 'XXXXX';
\q
exit


pnpm prisma generate
pnpm prisma db push

pnpm build
pnpm start
(pnpm dev)


sudo apt update && sudo apt install nginx -y
sudo systemctl status nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo nano /etc/nginx/sites-available/tradegpt

```
server {
    listen 80;
    server_name tradegpt.site www.tradegpt.site;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

sudo ln -s /etc/nginx/sites-available/tradegpt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tradegpt.site -d www.tradegpt.site
sudo certbot renew --dry-run

cd ~/launchpad/Launchpad-AIent
pnpm build
pnpm start


npm install -g pm2
pm2 start "pnpm start" --name tradegpt
pm2 startup
pm2 save
