import { Router, Request, Response, RequestHandler } from "express";
import { TranslationController } from "../controllers/translation.controller";

const router = Router();
const controller = new TranslationController();

router.post("/translate", (async (
  req: Request,
  res: Response
): Promise<void> => {
  await controller.translate(req, res);
}) as RequestHandler);

router.get("/", (req: Request, res: Response): void => {
  res.send("Translation API ready");
});

export default router;
