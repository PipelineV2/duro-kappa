import expressapp from 'expressapp';
import { Router } from "express";
import duro from "duro-queue/src/routes";
import admin from "admin/src/routes";
import jobs from "jobs/src/index";

const router = Router();

router.use('/admin', admin);
router.use('/queue', duro);
router.use('/jobs', jobs);

expressapp(router)
