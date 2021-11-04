import * as vscode from "vscode";

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
            /export\s+((async\s+)?function\s+([^\(]+)|const\s+.+\s*=\s*\([^\s=]*\)\s*=>)/g;

        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken,
    ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        if (
            vscode.workspace
                .getConfiguration("codelens-sample")
                .get("enableCodeLens", true)
        ) {
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
                    this.codeLenses.push(
                        new vscode.CodeLens(range, {
                            title: "Execute function",
                            // tooltip: "Tooltip provided by sample extension",
                            command: "codelens-sample.codelensAction",
                            arguments: [document.fileName, matches[3]],
                        }),
                    );
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
        if (
            vscode.workspace
                .getConfiguration("codelens-sample")
                .get("enableCodeLens", true)
        ) {
            return codeLens;
        }
        return null;
    }
}
