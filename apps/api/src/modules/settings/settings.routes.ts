import { Router } from "express";
import { getSettings } from "@/modules/settings/settings.controller";

export const settingsRouter = Router();

settingsRouter.get("/", getSettings);
