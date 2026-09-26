import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ordersRouter from "./orders";
import reservationsRouter from "./reservations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ordersRouter);
router.use(reservationsRouter);

export default router;
