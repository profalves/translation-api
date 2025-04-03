import { TranslationService } from "./translation.service";
import nock from "nock";
import config from "../../config/app";

describe("TranslationService", () => {
  let service: TranslationService;

  beforeAll(() => {
    service = new TranslationService();
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  it("should translate text successfully", async () => {
    const mockResponse = {
      translatedText: "olá",
    };

    if (!config.translateUrl) {
      throw new Error("Translation URL is not defined");
    }
    nock(config.translateUrl).post("/translate").reply(200, mockResponse);

    const result = await service.translateText("hello");
    expect(result).toBe("olá");
  });

  it("should throw error on translation failure", async () => {
    if (!config.translateUrl) {
      throw new Error("Translation URL is not defined");
    }
    nock(config.translateUrl).post("/translate").reply(500);

    await expect(service.translateText("hello")).rejects.toThrow(
      "Translation service error"
    );
  });
});
