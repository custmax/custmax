## Node Version
20.12.2
## NPM Version
10.5.0
## install
```
npm install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


# deploy

## Node.js Server
Next.js can be deployed to any hosting provider that supports Node.js. Ensure your package.json has the "build" and "start" scripts:
```
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```
Then, run npm run build to build your application. Finally, run npm run start to start the Node.js server. This server supports all Next.js features.

## Docker Image
Dockerfile
```
FROM --platform=linux/amd64 node:20
WORKDIR /app

COPY package.json ./

RUN npm install

COPY .next ./.next/
COPY public ./public/
COPY package.json ./
COPY next.config.mjs ./

EXPOSE 3000

CMD ["npm", "run", "start"]
```