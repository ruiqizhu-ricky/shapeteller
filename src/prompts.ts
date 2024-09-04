// Shall I use langchain/langgraph ?
import * as vscode from 'vscode';
import { Position } from 'vscode';

const config = vscode.workspace.getConfiguration('shapeteller');

export const SYSTEM_PROMPT_Template = `You are an expert in coding with PyTorch, Numpy, Tensorflow, Jax, or other deep learning frameworks. You are given a piece of Python code and an array/tensor variable in the code. You should provide the expected shape of the given array/tensor. 
- The shape should be in the format of a tuple of integers. 
- If the given variable is not array/tensor, you should reply with "The given variable "<Fill The Variable>" does not seem to be an array/tensor". 
`;

export const USER_PROMPT_TEMPLATE = 'Here is some Python code:\n\n```python\n{code_fragment}\n```\n\nPlease provide the expected shape of the tensor `{selected_var}` at line {line_num} and column {line_col}. ';



export function fillInString(stringTemplate: string, params: Map<string, string>): string {
    let retString = stringTemplate;
    for (let [k, v] of params) {
        retString = retString.replaceAll(`{${k}}`, v);
    }
    return retString;
}


export class PromptManager {

    getSysPrompt(): string {
        const mode = config.get('mode', 'concise');
        const is_prefer_var = config.get('is_prefer_var', true);
        let sys_prompt = SYSTEM_PROMPT_Template;
        
        if (mode === 'concise') {
            sys_prompt += '\n - Please provide concise and clear answers.\n';
        } else {
            sys_prompt += '\n - Please detail the steps how you figure out the shapes.\n';
        }

        if (is_prefer_var){
            sys_prompt += '\n - Whenever possible, use variable names instead of constant numbers.\n';
        } else {
            sys_prompt += '\n - Whenever possible, figure out the exact numbers, e.g., `(16, 50304)` of the shapes rather than using variable names, e.g. `(seq_len, vovab_size)`.\n';
        }
        return sys_prompt;
    }

    getUserPrompt(code: string, selected_var:string, pos: Position,
        docs?: Array<string>, moreCode?: Array<string> ): string 
    {
        
        const params = new Map();
        params.set('code_fragment', code);
        params.set('selected_var', selected_var);
        params.set('line_num', (pos.line+1).toString());
        params.set('line_col', (pos.character+1).toString());

        let prompt = fillInString(USER_PROMPT_TEMPLATE, params);
        if (docs) {
            prompt += '\n\nHere are some related documentation:\n\n';
            for (let doc of docs) {
                prompt += `"${doc}"\n\n`;
            }
        }

        if (moreCode) {
            prompt += '\n\nHere are some more potentiall related code fragments:\n\n';
            for (let code of moreCode) {
                prompt += `\`\`\`python\n${code}\`\`\`\n\n`;
            }
        }
        
        if (docs || moreCode) {
            const reminder = fillInString('\n\nKind reminder: Please provide the expected shape of the tensor `{selected_var}` at line {line_num} and column {line_col}.', params);
            prompt += reminder;
        }

        return prompt;
    }
}