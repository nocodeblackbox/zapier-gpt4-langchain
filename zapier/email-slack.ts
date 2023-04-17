import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutor, ZapierToolKit } from "langchain/agents";
import { ZapierNLAWrapper } from "langchain/tools";

export const run = async () => {
  const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.0 });
  const zapier = new ZapierNLAWrapper();
  const toolkit = await ZapierToolKit.fromZapierNLAWrapper(zapier);

  const executor = await initializeAgentExecutor(
    toolkit.tools,
    model,
    "zero-shot-react-description",
    true
  );
  console.log("Loaded agents. \n");

  // map out and see what tools are connected from Zapier NLA agent
  await toolkit.tools.map((tool) => {
    console.log(tool.name);
    console.log(`${tool.description} \n`);
  });

  const input = `

  Grab the invoice from my email, 
  summarize it's body and send it in the #projects channel.

  `;

  console.log(`Executing with input "${input}"...`);

  const result = await executor.call({ input });

  console.log(`Got output ${result.output}`);
};

run();
