from gplane/pnpm:node18

workdir /app

copy . /app

workdir /app 

run pnpm i

run pnpm run build

workdir /app/shared/database

run npx prisma generate

run pnpm i ts-node -w

env DATABASE_URL postgres://postgres:root@localhost:5432

env QUEUE_CONNECTION_URL redis://red-ci29ksm7avj2t336jnf0:6379 

env PORT 4000

expose 4000

cmd ["npx", "ts-node", "/app/backend/doorman/src/index.ts"]



