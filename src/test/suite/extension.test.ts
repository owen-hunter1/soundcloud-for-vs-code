import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { Timer } from '../../timer';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		const time = new Timer();
		let result = time.tick().time1;
		let start = new Date().getTime();
		let time2 = (new Date().getTime() - start);
		
		assert.equal(result,time2);

	});
});
