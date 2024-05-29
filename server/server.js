import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { OpenAIApi, Configuration } from "openai";

dotenv.config();
const configuration = new Configuration({
  organization: "org-PqQX2kChGVcAqNFyOILI4dy1",
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is correctly set in your environment variables
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Server start!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${prompt}` }],
    });

    // const response = await openai.createCompletion({
    //   model: "gpt-4",
    //   prompt: `${prompt}`,
    //   temperature: 0, // Higher values means the model will take more risks.
    //   max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
    //   top_p: 1, // alternative to sampling with temperature, called nucleus sampling
    //   frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
    //   presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    // });
    console.log(completion.data.choices[0].message);

    res.status(200).send({
      bot: completion.data.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.get("/models", async (req, res) => {
  try {
    const models = await openai.listModels();
    res.status(200).send(models.data);
  } catch (error) {
    console.error("Failed to fetch models:", error);
    res
      .status(500)
      .send({ message: "Failed to fetch models", error: error.message });
  }
});

app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
