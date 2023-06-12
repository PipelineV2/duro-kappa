
from gplane/pnpm:node18

workdir /app

copy . /app

workdir /app 

run pnpm i

arg NEXT_PUBLIC_API_URL 

env NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

run pnpm run build

workdir /app/apps/provider

cmd ["pnpm", "run", "start"]


