# Image Processing API

A Node.js & TypeScript REST API for resizing images using Express and Sharp.

**Requires Node.js v20.19.4**
**run nvm use so it can use spacfic node version**

## Features

- Resize images via HTTP endpoint
- Save processed images to a `thumb` folder
- Async/await for all file operations
- Robust error handling
- Jasmine tests for endpoints and image processing

## Setup

1. **Clone the repository**

   ```
   git clone https://github.com/hadiheib99/image-processing-api.git
   cd image-processing-api
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Add images**
   - Place your source images in the `img` folder at the project root (e.g., `img/palmtunnel.jpg`).

4. **Build the project** (optional, for production)

   ```
   npm run build
   ```

5. **Run the server**
   ```
   npm start
   ```
   The server will start on `http://localhost:3000`.

## Usage

### Resize an Image

Send a GET request to:

```
http://localhost:3000/api/images?filename=<imageName>&width=<width>&height=<height>
```

- `filename`: Name of the image in the `img` folder (e.g., `palmtunnel.jpg`)
- `width`: Desired width (number)
- `height`: Desired height (number)

**Example:**

```
http://localhost:3000/api/images?filename=palmtunnel.jpg&width=200&height=200
```

- The processed image will be saved as `palmtunnel_thumb.jpg` in the `thumb` folder.
- The API will return the processed image file.

### Error Handling

- If any query parameter is missing, you get a 400 error with a message.
- If the image does not exist, you get a 404 error with a message.
- If processing fails, you get a 500 error with details.

## Testing

Run all tests:

```
npm test
```

## Project Structure

```
image-processing-api/
├── img/                # Source images
├── thumb/              # Processed images
├── src/                # Source code
│   ├── index.ts        # Main API file
│   ├── imgCrop.ts      # Image processing logic
│   └── ...
├── spec/               # Jasmine tests
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
