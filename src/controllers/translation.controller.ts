import { Request, Response } from "express";
import { TranslationService } from "../services/translation/translation.service";
import { DictionaryService } from "../services/dictionary/dictionary.service";
import { TranslationRequest, TranslationResponse } from "../types/translation";

export class TranslationController {
  private translationService = new TranslationService();
  private dictionaryService = new DictionaryService();

  async translate(
    req: Request<{}, {}, TranslationRequest>,
    res: Response<TranslationResponse | { error: string }>
  ) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const [translation, dictionaryEntries] = await Promise.all([
        this.translationService.translateText(text),
        this.dictionaryService.getWordDetails(text),
      ]);

      const response: TranslationResponse = {
        translation,
        pronunciation:
          this.dictionaryService.extractPronunciation(dictionaryEntries),
        examples: this.dictionaryService.extractExamples(dictionaryEntries),
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
