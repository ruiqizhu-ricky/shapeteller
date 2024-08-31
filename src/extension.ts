import * as vscode from 'vscode';
import { HoverProvider, TextDocument, Position, CancellationToken, Hover, MarkdownString } from 'vscode';
import { getLLMClient } from './llm_clients';


const config = vscode.workspace.getConfiguration('shapeteller');
const client = getLLMClient(config.modelId, config.apiKey);
var isOn = false;  // controls if call the LLM API when hovering over a variable


async function getTensorShapeFromLLM(document: TextDocument, position: Position, selected_var: string): Promise<string | null> {
	console.log("Requesting shape ...");
	// TODO: finer way to select code pieces to send to the model
	const code_fragment = document.getText();
	// TODO: crafted prompts
	const prompt = `Here is some Python code:\n\n\`\`\`python\n${code_fragment}\n\`\`\`\n\nPlease provide the expected shape of the tensor \`${selected_var}\` at line ${position.line + 1}, whenever possible, use variable names instead of constant numbers.`;

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


class PyTorchTensorHoverProvider implements HoverProvider {
    async provideHover(document: TextDocument, position: Position, token: CancellationToken): Promise<Hover> {
        console.log("Hover provider created");

        const range = document.getWordRangeAtPosition(position);
        const selected_var = document.getText(range);

		if (!isOn) {
            return new Hover('Tensor-teller is off', range);
        }

        // Request the expected tensor shape from the LLM API.
        const llmResp = await getTensorShapeFromLLM(document, position, selected_var);

        if (llmResp) {
            const message = new MarkdownString(`**ShapeTeller:** ${llmResp}`);
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
            new PyTorchTensorHoverProvider()
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
