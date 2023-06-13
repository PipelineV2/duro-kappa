import expressapp from 'expressapp';
import { Router } from "express";
import duro from "duro-queue/src/routes";
import admin from "admin/src/routes";

const router = Router();

router.get('/', (_, res) => { res.send("Welcome to DURO doorman! happy waiting :)") })
router.use('/admin', admin);
router.use('/queue', duro);

expressapp(router)
