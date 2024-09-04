import axios from "axios";
import openai from 'openai';
import Anthropic from '@anthropic-ai/sdk';

import { SYSTEM_PROMPT } from "./prompts";

export interface ILLMClient {
    getModelId(): string;
    getCompletion(prompt: string, maxToken: number): Promise<string|null>;
}

abstract class LLMClient implements ILLMClient {
    protected modelId: string;
    protected apiKey: string;

    constructor(modelId: string, apiKey: string) {
        this.modelId = modelId;
        this.apiKey = apiKey;
    }

    getModelId(): string {
        return this.modelId;
    }

    abstract getCompletion(prompt: string, maxToken: number): Promise<string|null>;
}


/**
 * An LLM client that uses the `openai` package.
 * Many LLM platforms design there APIs in OpenAI style, 
 * and hence can be called using the `openai` package.
 */
class OpenAILike extends LLMClient {

    protected client;

    constructor(modelId: string, apiKey: string, apiEndpoint: string) {
        super(modelId, apiKey);
        this.client = new openai.OpenAI({
            apiKey: apiKey,    
            baseURL: apiEndpoint,
        });
    }

    async getCompletion(prompt: string, maxToken: number): Promise<string|null> {
        try {
            const completion = await this.client.chat.completions.create({
                model: this.modelId,         
                messages: [
                    { role: "system", content: SYSTEM_PROMPT},
                    {role: "user", content: prompt}
                ],
                max_tokens: maxToken,
                temperature: 0.15,
            });
            
            const generated_text = completion.choices[0].message.content;
            console.log('result from LLM:' + generated_text);
            return generated_text;

        } catch (error) {
            console.error('Error calling the LLM API:', error);
            if (error instanceof Error) {
                return error.message;
            } else {
                return 'Unknown error';
            }
        }
    }
}


class AnthropicClient extends LLMClient {
    protected client;

    constructor(modelId: string, apiKey: string) {
        super(modelId, apiKey);
        this.client = new Anthropic({ apiKey: apiKey });
    }

    async getCompletion(prompt: string, maxToken: number): Promise<string|null> {
        try {

            const msg = await this.client.messages.create({
                model: this.modelId,
                max_tokens: maxToken,
                temperature: 0.15,
                messages: [
                    {role: "user", content: SYSTEM_PROMPT + prompt},
                ],
              });

            const generated_text = msg.content[0].type === 'text' ? 
                                                msg.content[0].text : 
                                                'claude does not return text.';
            console.log('result from LLM:' + generated_text);
            return generated_text;
            
        } catch (error) {
            console.error('Error calling the LLM API:', error);
            if (error instanceof Error) {
                return error.message;
            } else {
                return 'Unknown error';
            }
        }
    }
}

class MoonShotClient extends OpenAILike {}

class CodeGeeXClient extends OpenAILike {}

class MistralClient extends OpenAILike {}

class OpenAIClient extends OpenAILike {}

export function getLLMClient(modelId: string, apiKey: string): LLMClient {
    if (modelId.startsWith('moonshot')) {
        return new MoonShotClient(modelId, apiKey, "https://api.moonshot.cn/v1");
    } else if (modelId.startsWith('codegeex') || modelId.startsWith('glm')) {
        return new CodeGeeXClient(modelId, apiKey, "https://open.bigmodel.cn/api/paas/v4");
    }else if (modelId.startsWith('mistral') || modelId.startsWith('codestral')) {
        return new MistralClient(modelId, apiKey, "https://api.mistral.ai/v1");
    } else if (modelId.startsWith('gpt')) {
        return new OpenAIClient(modelId, apiKey, "https://api.openai.com/v1");
    } else if (modelId.startsWith('claude')) {
        return new AnthropicClient(modelId, apiKey);
    }
    else {
        throw new Error('Unsupported model: ' + modelId);
    }
}
