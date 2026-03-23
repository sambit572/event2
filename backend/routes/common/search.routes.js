import { Router } from "express";
import { searchController, getSearchSuggestions } from "../../controller/common/search.controller.js";

const searchRouter = Router();
searchRouter.get('/',searchController);
searchRouter.get('/suggestion',getSearchSuggestions);

export { searchRouter };