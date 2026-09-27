import { Router } from "express";
import {
  getCustomerAnalytics,
  getProductAnalytics,
  getReturnsRateAnalytics,
  getSalesAnalytics,
} from "@/modules/analytics/analytics.controller";

export const analyticsRouter = Router();

analyticsRouter.get("/sales", getSalesAnalytics);
analyticsRouter.get("/products", getProductAnalytics);
analyticsRouter.get("/customers", getCustomerAnalytics);
analyticsRouter.get("/returns-rate", getReturnsRateAnalytics);
