import Router from "koa-router";
import pixRoutes from "./pix-key.routes";

const router = new Router();

router.use(pixRoutes.routes());
router.use(pixRoutes.allowedMethods());
