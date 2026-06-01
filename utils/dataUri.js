import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
  //get extension of the filename for conversion
  const extensionName = path.extname(file.originalname).toString();

  //converts to base 64 for cloudinary upload
  return parser.format(extensionName, file.buffer).content;
};

export default getDataUri;
