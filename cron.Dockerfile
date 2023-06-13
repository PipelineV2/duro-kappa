from gplane/pnpm:node18

workdir /app

copy . /app

workdir /app 

run pnpm i

run pnpm run build

workdir /app/shared/database

run npx prisma generate

run pnpm i ts-node -w

ARG DATABASE_URL
ARG STORAGE_URL
ARG STORAGE_KEY

ENV DATABASE_URL $DATABASE_URL
ENV STORAGE_URL $STORAGE_URL
ENV STORAGE_KEY $STORAGE_KEY

env QUEUE_CONNECTION_URL redis://red-ci29ksm7avj2t336jnf0:6379 

env PORT 4000

expose 4000

cmd ["npx", "ts-node", "/app/backend/jobs/src/index.ts"]



