import { Router } from "express";
import { searchController } from "../../controller/common/search.controller.js";

const searchRouter = Router();
searchRouter.get('/',searchController);

export { searchRouter };