require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function modifyImage() {
  // Path to the input image that you want to modify
  const inputImagePath = "toa-heftiba-R3jg-diuM3g-unsplash.jpg"; // Update this with your image path
  
  // Read and encode the image
  const imageData = fs.readFileSync(inputImagePath);
  const mimeType = inputImagePath.endsWith('.jpg') || inputImagePath.endsWith('.jpeg') 
    ? 'image/jpeg' : 'image/png';
  const imageBase64 = imageData.toString('base64');
  
  const imageObject = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType
    }
  };

  // Prompt for modifying the image
  const prompt = "Please modify this image to add a reliastic dog on bed"; // Customize this prompt
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    }
  });

  try {
    // Send both the image and text prompt
    const response = await model.generateContent([imageObject, prompt]);
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("gemini-edited-image-4.png", buffer);
        console.log("Modified image saved as gemini-modified-image.png");
      }
    }
  } catch (error) {
    console.error("Error modifying image:", error);
  }
}

modifyImage();
