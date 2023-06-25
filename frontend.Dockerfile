
from gplane/pnpm:node18

workdir /app

copy ./apps/provider/ /app

workdir /app 

run npm i

arg NEXT_PUBLIC_API_URL 

env NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

run npm build

workdir /app/provider

cmd ["pnpm", "run", "start"]


