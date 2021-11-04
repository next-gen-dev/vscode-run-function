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

    commands.registerCommand("live-run.enableCodeLens", () => {
        workspace
            .getConfiguration("live-run")
            .update("enableCodeLens", true, true);
    });

    commands.registerCommand("live-run.disableCodeLens", () => {
        workspace
            .getConfiguration("live-run")
            .update("enableCodeLens", false, true);
    });

    commands.registerCommand(
        "live-run.codelensAction",
        (fileName: string, functionName: string) => {
            // Run node
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
