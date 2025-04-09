# Translation API

Translation API is a Node.js-based RESTful API that provides text translation and dictionary details, including pronunciation and example sentences.

## Features

- Translate text to a target language.
- Fetch dictionary details such as pronunciation and example sentences.
- Built with TypeScript and Express.js.
- Uses external APIs for translation and dictionary data.

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Project Structure

```bash
src/
├── config/
├── controllers/
├── routes/
├── services/
├── types/
├── utils/
└── app.ts
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/profalves/translation-api.git
   cd translation-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following environment variables
   ```bash
   PORT=3000
   DICTIONARY_API_URL=https://api.dictionaryapi.dev/api/v2/entries/en
   OPEN_TRANSLATE_URL=https://openl-translate.p.rapidapi.com
   RAPIDAPI_KEY=<your-rapidapi-key>
   RAPIDAPI_HOST=openl-translate.p.rapidapi.com
   ```

## Usage

### Development

1. Run the API in development mode with hot-reloading:

   ```bash
   npm run dev
   ```

### Production

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

### Docker

1. Build the Docker image:

   ```bash
   docker build -t translation-api .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 --env-file .env translation-api
   ```

For detailed information about Docker setup and configuration, please refer to our [Docker documentation](./docs/docker.md).

## API Endpoints

### POST `/api/translate`

Translate text and fetch dictionary details.

#### Request Body

```json
{
  "text": "hello"
}
```

#### Response

```json
{
  "translation": "olá",
  "pronunciation": "həˈləʊ",
  "examples": [
    "Hello, how are you?",
    "She said hello to everyone.",
    "Hello, this is John speaking."
  ]
}
```

### GET `/api`

Check API health and connection status.

#### Response

```text
Translation API ready
```

This endpoint helps monitor the API's operational status and connectivity.

## License

This project is licensed under the **_UNLICENSED_** license.
