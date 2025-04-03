import { DictionaryService } from "./dictionary.service";
import axios from "axios";
import { DictionaryEntry } from "../../types/translation";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("DictionaryService", () => {
  const dictionaryService = new DictionaryService();

  describe("getWordDetails", () => {
    it("should return word details when API call is successful", async () => {
      const mockResponse: DictionaryEntry[] = [
        {
          phonetics: [{ text: "/test/" }],
          meanings: [],
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await dictionaryService.getWordDetails("test");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("test")
      );
      expect(result).toEqual(mockResponse);
    });

    it("should return an empty array when API call fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

      const result = await dictionaryService.getWordDetails("test");

      expect(result).toEqual([]);
    });
  });

  describe("extractPronunciation", () => {
    it("should return the first pronunciation text if available", () => {
      const mockEntries: DictionaryEntry[] = [
        {
          phonetics: [{ text: "/test/" }],
          meanings: [],
        },
      ];

      const result = dictionaryService.extractPronunciation(mockEntries);

      expect(result).toBe("/test/");
    });

    it("should return undefined if no pronunciation is available", () => {
      const mockEntries: DictionaryEntry[] = [
        {
          phonetics: [],
          meanings: [],
        },
      ];

      const result = dictionaryService.extractPronunciation(mockEntries);

      expect(result).toBeUndefined();
    });
  });

  describe("extractExamples", () => {
    it("should return up to 3 examples from the entries", () => {
      const mockEntries: DictionaryEntry[] = [
        {
          phonetics: [],
          meanings: [
            {
              definitions: [
                { example: "A procedure" },
                { example: "An experiment" },
                { example: "A trial" },
                { example: "An assessment" },
              ],
            },
          ],
        },
      ];

      const result = dictionaryService.extractExamples(mockEntries);

      expect(result).toEqual(["A procedure", "An experiment", "A trial"]);
    });

    it("should return an empty array if no examples are available", () => {
      const mockEntries: DictionaryEntry[] = [
        {
          phonetics: [],
          meanings: [
            {
              definitions: [],
            },
          ],
        },
      ];

      const result = dictionaryService.extractExamples(mockEntries);

      expect(result).toEqual([]);
    });
  });
});
