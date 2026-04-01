import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyANlfNODB14tvZN7fnRe7cH4F7QMcsdcZ4");

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-pro-vision",
    "gemini-pro"
];

async function checkModels() {
    for (const name of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: name });
            await model.generateContent("hello");
            console.log("SUCCESS:", name);
        } catch(e) {
            console.log("FAIL:", name, "=>", e.message.substring(0, 50));
        }
    }
}
checkModels();
