import * as vscode from "vscode";

function getFunctionNameFromMatch(match: RegExpMatchArray): string {
    if (match[2].match(/^(const|let|var)/)) {
        return match[6];
    }
    return match[4];
}

export type ButtonDisplayType =
    | string
    | "icon and text above"
    | "icon above"
    | "none";

/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {
    private codeLenses: vscode.CodeLens[] = [];
    private regex: RegExp;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> =
        new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> =
        this._onDidChangeCodeLenses.event;

    constructor() {
        // TODO: make this regex a "function" with test inputs and outputs
        this.regex =
            /(^|(?<=\n))[\t ]*export\s+((async\s+)?function\s+([^\(]+)|(const|let|var)\s+([^\s=]+)\s*=\s*(async)?(\s+function|\s*\([^\s=]*\)\s*=>))/g;

        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    private getButtonDisplayType(): ButtonDisplayType {
        return vscode.workspace
            .getConfiguration("run-function")
            .get("buttonDisplay", "icon and text above");
    }

    private getButtonString() {
        // run-function.buttonDisplay
        const buttonDisplayType = this.getButtonDisplayType();

        switch (buttonDisplayType) {
            case "icon and text above":
                return "► Run function";
            case "icon above":
            case "icon before name":
                return "►";
            case "none":
                "";
        }
        // TODO: default case
        return "";
    }

    private isEnabled() {
        return (
            vscode.workspace
                .getConfiguration("run-function")
                .get("enableCodeLens", true) &&
            this.getButtonDisplayType() !== "none"
        );
    }

    public provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken,
    ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        if (this.isEnabled()) {
            const buttonString = this.getButtonString();
            this.codeLenses = [];
            const regex = new RegExp(this.regex);
            const text = document.getText();
            let matches;
            while ((matches = regex.exec(text)) !== null) {
                const line = document.lineAt(
                    document.positionAt(matches.index).line,
                );
                const indexOf = line.text.indexOf(matches[0]);
                if (line.firstNonWhitespaceCharacterIndex !== indexOf) {
                    continue;
                }
                const position = new vscode.Position(line.lineNumber, indexOf);
                const range = document.getWordRangeAtPosition(
                    position,
                    new RegExp(this.regex),
                );
                if (range) {
                    const name = getFunctionNameFromMatch(matches);
                    if (name) {
                        this.codeLenses.push(
                            new vscode.CodeLens(range, {
                                title: buttonString,
                                tooltip:
                                    "Executes the function and logs the returned value",
                                command: "run-function.codelensAction",
                                arguments: [document, name, line.lineNumber],
                            }),
                        );
                    }
                }
            }
            return this.codeLenses;
        }
        return [];
    }

    public resolveCodeLens(
        codeLens: vscode.CodeLens,
        token: vscode.CancellationToken,
    ) {
        if (this.isEnabled()) {
            return codeLens;
        }
        return null;
    }
}
