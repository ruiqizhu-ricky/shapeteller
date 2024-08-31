import { Position } from 'vscode';

interface IPromptManager {
    getPrompt(code: string, pos: Position, docs: Array<string>|null, moreCode: Array<string>|null): string;
  }