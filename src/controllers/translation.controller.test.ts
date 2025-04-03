import { Request, Response } from "express";
import { TranslationController } from "../../src/controllers/translation.controller";
import { TranslationService } from "../services/translation/translation.service";
import { DictionaryService } from "../services/dictionary/dictionary.service";

describe("TranslationController", () => {
  let controller: TranslationController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    controller = new TranslationController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };
  });

  it("should return 400 for missing text", async () => {
    mockRequest.body = {};
    await controller.translate(
      mockRequest as Request,
      mockResponse as Response
    );
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseObject.error).toBe("Text is required");
  });

  it("should return translation data", async () => {
    mockRequest.body = { text: "hello" };

    jest
      .spyOn(TranslationService.prototype, "translateText")
      .mockResolvedValue("olá");

    jest
      .spyOn(DictionaryService.prototype, "getWordDetails")
      .mockResolvedValue([
        {
          phonetics: [{ text: "/həˈloʊ/" }],
          meanings: [
            {
              definitions: [
                { example: "Hello! How are you?" },
                { example: "She said hello" },
              ],
            },
          ],
        },
      ]);

    await controller.translate(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(responseObject).toEqual({
      translation: "olá",
      pronunciation: "/həˈloʊ/",
      examples: ["Hello! How are you?", "She said hello"],
    });
  });

  it("should handle internal server error", async () => {
    mockRequest.body = { text: "hello" };

    jest
      .spyOn(TranslationService.prototype, "translateText")
      .mockRejectedValue(new Error("Service error"));

    await controller.translate(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(responseObject.error).toBe("Internal server error");
  });
});
