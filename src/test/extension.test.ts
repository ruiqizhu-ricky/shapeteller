import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

import { fillInString } from '../prompts';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('fillInString test', () => {
		let tmpl = 'Hello, {forename} {surname}! Goodbye, {forename}!';
		let params = new Map<string, string>;
		params.set('forename', 'John');
		params.set('surname', 'Doe');
		params.set('name', 'John Doe');
		assert.strictEqual('Hello, John Doe! Goodbye, John!', fillInString(tmpl, params));
		params.set('forename', 'Jane');
		assert.strictEqual('Hello, Jane Doe! Goodbye, Jane!', fillInString(tmpl, params));
	});
});


