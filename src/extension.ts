// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
    ExtensionContext,
    languages,
    commands,
    Disposable,
    workspace,
    window,
} from "vscode";
import { CodelensProvider } from "./CodelensProvider";
import { runModuleFunction } from "./runner";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
    const codelensProvider = new CodelensProvider();

    languages.registerCodeLensProvider("*", codelensProvider);

    commands.registerCommand("codelens-sample.enableCodeLens", () => {
        workspace
            .getConfiguration("codelens-sample")
            .update("enableCodeLens", true, true);
    });

    commands.registerCommand("codelens-sample.disableCodeLens", () => {
        workspace
            .getConfiguration("codelens-sample")
            .update("enableCodeLens", false, true);
    });

    commands.registerCommand(
        "codelens-sample.codelensAction",
        (fileName: string, functionName: string) => {
            // Run node
            // node -e "import('./index.mjs').then(m => console.log(m.randomId2()))
            const startTime = Date.now();
            runModuleFunction(fileName, functionName)
                .then(
                    (v) => {
                        window.showInformationMessage(
                            `Result: ${JSON.stringify(v)}`,
                        );
                    },
                    (err) => {
                        console.error(err);
                        window.showInformationMessage(`CodeLens error`);
                    },
                )
                .finally(() => {
                    console.log(
                        `Execution time: ${(Date.now() - startTime) / 1000}s`,
                    );
                });
        },
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
    if (disposables) {
        disposables.forEach((item) => item.dispose());
    }
    disposables = [];
}
