
from gplane/pnpm:node18

workdir /app

copy . /app

workdir /app 

run pnpm i

run pnpm run build

env NEXT_PUBLIC_API_URL https://new-duro-be.onrender.com

cmd ["cd", "/app/apps/provider", "&&", "npm", "run", "dev"]


