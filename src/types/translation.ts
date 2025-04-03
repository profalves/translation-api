export interface TranslationRequest {
  text: string;
}

export interface TranslationResponse {
  translation: string;
  pronunciation?: string;
  examples: string[];
}

export interface DictionaryEntry {
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    definitions: Array<{
      example?: string;
    }>;
  }>;
}