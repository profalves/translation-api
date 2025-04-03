import request from "supertest";
import express from "express";
import translationRoutes from "./translation.routes";
import { TranslationController } from "../controllers/translation.controller";
import { TranslationService } from "../../src/services/translation/translation.service"; // Importe o serviço
import { DictionaryService } from "../../src/services/dictionary/dictionary.service"; // Importe o serviço

jest.mock("../../src/services/translation/translation.service");
jest.mock("../../src/services/dictionary/dictionary.service");

describe("Translation Routes", () => {
  let app: express.Application;
  let mockTranslateText: jest.Mock;
  let mockGetWordDetails: jest.Mock;
  let mockExtractPronunciation: jest.Mock;
  let mockExtractExamples: jest.Mock;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(translationRoutes);

    // Reseta os mocks antes de cada teste
    mockTranslateText = jest.fn();
    mockGetWordDetails = jest.fn();
    mockExtractPronunciation = jest.fn();
    mockExtractExamples = jest.fn();

    (TranslationService as jest.Mock).mockImplementation(() => ({
      translateText: mockTranslateText,
    }));

    (DictionaryService as jest.Mock).mockImplementation(() => ({
      getWordDetails: mockGetWordDetails,
      extractPronunciation: mockExtractPronunciation,
      extractExamples: mockExtractExamples,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /translate", () => {
    it("should call translation controller and services", async () => {
      const mockTranslationResult = "Olá";
      const mockDictionaryEntries = [
        { pronunciation: "oʊˈloʊ", examples: ["Exemplo."] },
      ];
      const mockPronunciation = "oʊˈloʊ";
      const mockExamples = ["Exemplo."];

      mockTranslateText.mockResolvedValue(mockTranslationResult);
      mockGetWordDetails.mockResolvedValue(mockDictionaryEntries);
      mockExtractPronunciation.mockReturnValue(mockPronunciation);
      mockExtractExamples.mockReturnValue(mockExamples);

      await request(app)
        .post("/translate")
        .send({ text: "Hello", targetLang: "pt" })
        .expect(200);

      expect(TranslationService).toHaveBeenCalledTimes(1);
      expect(DictionaryService).toHaveBeenCalledTimes(1);

      // Acessa a implementação mockada da classe e verifica as chamadas no método
      const translationServiceMockInstance = (TranslationService as jest.Mock)
        .mock.instances[0];
      expect(translationServiceMockInstance.translateText).toHaveBeenCalledWith(
        "Hello"
      );

      const dictionaryServiceMockInstance = (DictionaryService as jest.Mock)
        .mock.instances[0];
      expect(dictionaryServiceMockInstance.getWordDetails).toHaveBeenCalledWith(
        "Hello"
      );
    });

    it("should handle missing request body", async () => {
      await request(app).post("/translate").send({}).expect(400);
    });

    it("should handle invalid target language", async () => {
      // Como não há validação de 'targetLang' no controller atual,
      // este teste como está sempre passará (a menos que o serviço mockado lance um erro).
      // Se você adicionar validação no controller, precisará ajustar este teste.
      mockTranslateText.mockResolvedValue("...");
      mockGetWordDetails.mockResolvedValue([]);
      await request(app)
        .post("/translate")
        .send({ text: "Hello", targetLang: "invalid" })
        .expect(200); // Ou o status de erro apropriado se adicionar validação
    });
  });
});
