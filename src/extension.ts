import * as vscode from 'vscode';
import { HoverProvider, TextDocument, Position, CancellationToken, Hover, MarkdownString } from 'vscode';
import { getLLMClient, getCustomisedLLMClient, ILLMClient } from './llm_clients';
import { PromptManager } from './prompts';


var isOn = false;  // controls if call the LLM API when hovering over a variable
const config = vscode.workspace.getConfiguration('shapeteller');
const promptManager = new PromptManager();

const apiEndpoint = config.get('useThisAPIEndpoint');
var client: ILLMClient;
if (apiEndpoint) {
    const modelId = config.get('customisedModelId', 'unknownModelId');
    client = getCustomisedLLMClient(modelId, config.apiKey, apiEndpoint as string);
} 
else {
    client = getLLMClient(config.modelId, config.apiKey);
}


async function getTensorShapeFromLLM(document: TextDocument, position: Position, selected_var: string): Promise<string | null> {
	console.log(`Requesting shape from ${client.getModelId()} ...`);
	// TODO: finer way to select code fragments to send to the model
	const code_fragment = document.getText();
    const prompt = promptManager.getUserPrompt(code_fragment, selected_var, position);

	try {
        const generated_text = client.getCompletion(prompt, config.maxToken);
        console.log('result from LLM:' + generated_text);
        return generated_text;
    } catch (error) {
        console.error(`Error calling the ${config.modelId} model:`, error);
        if (error instanceof Error) {
            return error.message;
        }
        return null;
    }
}


class TensorShapeHoverProvider implements HoverProvider {
    async provideHover(document: TextDocument, position: Position, token: CancellationToken): Promise<Hover> {
        console.log("Hover provider created");

        const range = document.getWordRangeAtPosition(position);
        const selected_var = document.getText(range);

		if (!isOn) {
            return new Hover('**ShapeTeller:** extension is off', range);
        }

        // Request the expected tensor shape from the LLM API.
        const llmResp = await getTensorShapeFromLLM(document, position, selected_var);

        if (llmResp) {
            const message = new MarkdownString(`**ShapeTeller:** ${llmResp} \n\n---\nFrom \`${client.getModelId()}\``);
            return new Hover(message, range);
        } else{
			return new Hover('null', range);
		}
    }
}


export function activate(context: vscode.ExtensionContext) {
	console.log("Extension TensorTeller is on");
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { scheme: 'file', language: 'python' },
            new TensorShapeHoverProvider()
        )
    );
	context.subscriptions.push(vscode.commands.registerCommand('shapeteller.turnOn', () => {
		isOn = true;
		vscode.window.showInformationMessage('Tensor-Shape-Teller is on!');
	}));
	context.subscriptions.push(vscode.commands.registerCommand('shapeteller.turnOff', () => {
		isOn = false;
		vscode.window.showInformationMessage('Tensor-Shape-Teller is off!');
	}));
}


// This method is called when your extension is deactivated
export function deactivate() {}
