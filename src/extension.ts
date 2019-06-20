import * as path from "path";
import * as fs from "fs";

interface IRule {
	from: string;
	to: string;
}

class Rule {
	public from: RegExp;
	public to: string;

	constructor(config: IRule) {
		this.from = new RegExp("^" + config.from + "$");
		this.to = config.to;
	}

	match(path: string): boolean {
		return path.match(this.from) !== null;
	}

	convert(path: string): string {
		return path.replace(this.from, this.to);
	}
}
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.toggleFile', () => {
		const config = vscode.workspace.getConfiguration("toggleFile");

		const rules_config = <Array<IRule>>config.get("rules");
		if (rules_config === undefined) { return; }
		const rules = rules_config.map((e) => new Rule(e));

		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) { return; }

		const root = vscode.workspace.rootPath;
		if (root === undefined) { return; }

		const relative_path = path.relative(root, editor.document.fileName);

		let convertedByfirstMatch: string | null = null;

		for (const rule of rules) {
			if (rule.match(relative_path)) {
				const converted = path.join(root, rule.convert(relative_path));
				if (convertedByfirstMatch === null) {
					convertedByfirstMatch = converted;
				}

				if (fs.existsSync(converted)) {
					vscode.workspace.openTextDocument(converted).then((doc) => {
						vscode.window.showTextDocument(doc);
					});
					return;
				}
			}
		}

		if (convertedByfirstMatch !== null) {
			vscode.window.showInputBox({prompt: "Create new file?", value: convertedByfirstMatch}).then((new_file) => {
				if (new_file === undefined) { return; }
				fs.mkdirSync(path.dirname(new_file), {recursive: true});
				fs.writeFileSync(new_file, "");
				vscode.workspace.openTextDocument(new_file).then((doc) => {
					fs.unlinkSync(new_file);
					vscode.window.showTextDocument(doc);
				});
			});
			return;
		}

		vscode.window.showInformationMessage("Toggle file: Does not match any rule");
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
