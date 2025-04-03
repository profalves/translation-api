import "dotenv/config";

export default {
  port: process.env.PORT || 3000,
  translateUrl: process.env.OPEN_TRANSLATE_URL || "",
  dictionaryApiUrl: process.env.DICTIONARY_API_URL || "",
  rapidApiKey: process.env.RAPIDAPI_KEY || "",
  rapidApiHost: process.env.RAPIDAPI_HOST || "",
};
