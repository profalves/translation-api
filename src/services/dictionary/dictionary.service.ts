import axios from "axios";
import { DictionaryEntry } from "../../types/translation";
import config from "../../config/app";

export class DictionaryService {
  async getWordDetails(word: string): Promise<DictionaryEntry[]> {
    try {
      const response = await axios.get<DictionaryEntry[]>(
        `${config.dictionaryApiUrl}/${encodeURIComponent(word)}`
      );
      return response.data;
    } catch (error) {
      return [];
    }
  }

  extractPronunciation(entries: DictionaryEntry[]): string | undefined {
    return entries[0]?.phonetics.find((p) => p.text)?.text;
  }

  extractExamples(entries: DictionaryEntry[]): string[] {
    return entries
      .flatMap((entry) =>
        entry.meanings.flatMap((meaning) =>
          meaning.definitions
            .filter((d) => d.example)
            .map((d) => d.example as string)
        )
      )
      .slice(0, 3); // Limita a 3 exemplos
  }
}
