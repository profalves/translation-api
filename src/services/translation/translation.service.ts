import axios from "axios";
import config from "../../config/app";

export class TranslationService {
  async translateText(text: string): Promise<string> {
    try {
      const response = await axios.post(
        `${config.translateUrl}/translate`,
        {
          text,
          target_lang: "pt",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": config.rapidApiHost,
            "x-rapidapi-key": config.rapidApiKey,
          },
        }
      );

      return response.data.translatedText;
    } catch (error) {
      throw new Error("Translation service error");
    }
  }
}
