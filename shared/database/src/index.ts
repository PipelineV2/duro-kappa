import { Prisma } from './impl/prisma'
import { Database } from './models';
import * as dotenv from 'dotenv';
dotenv.config();


// this structure is very much up for debate... 
const databases = {
  "prisma": Prisma
} as const;

type DatabaseName = keyof typeof databases;
type FactorySettings = {
  database: DatabaseName;
  connection_string?: string;
}

function DatabaseFactory({ database = "prisma" }: FactorySettings) {
  return new databases[database]();
}

export default (function() {
  let instance: Database;

  return (): Database => {
    if (instance) return instance;
    const { database } = process.env as FactorySettings;
    instance = DatabaseFactory({ database });
    return instance;
  }
})();
