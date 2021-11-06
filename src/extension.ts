// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ChildProcessWithoutNullStreams } from "child_process";
import {
    ExtensionContext,
    languages,
    commands,
    Disposable,
    workspace,
    window,
    OutputChannel,
    TextDocument,
    DocumentFilter,
} from "vscode";
import { CodelensProvider } from "./CodelensProvider";
import { moduleFunctionProcess } from "./runner";

const documentFilter: DocumentFilter[] = [
    {
        language: "typescript",
        scheme: "file", // only files from disk
        pattern: "**/*.{ts,tsx}",
    },
    {
        language: "javascript",
        scheme: "file", // only files from disk
        pattern: "**/*.mjs",
    },
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

function pipeProcessToOutput(
    channel: OutputChannel,
    proc: ChildProcessWithoutNullStreams,
) {
    proc.stdout.on("data", function (data) {
        channel.append(data.toString());
    });
    proc.stderr.on("data", function (data) {
        channel.append(data.toString());
    });
    // TODO: Consider informing the user that the function is done executing, and how long it took
    proc.on("close", function (code) {
        channel.appendLine("");
    });
    proc.on("error", function (err) {
        console.error(err); // Extension issue
        // TODO: Maybe just append a message like: "Error with Run Function extension, please submit an issue at $URL"
        channel.appendLine(err.message);
        if (err.stack) {
            channel.appendLine(err.stack);
        }
    });
}

export function activate(context: ExtensionContext) {
    const codelensProvider = new CodelensProvider();
    const output = window.createOutputChannel("Run Function Extension");
    disposables.push(output);

    languages.registerCodeLensProvider(documentFilter, codelensProvider);

    commands.registerCommand("run-function.enableCodeLens", () => {
        workspace
            .getConfiguration("run-function")
            .update("enableCodeLens", true, true);
    });

    commands.registerCommand("run-function.disableCodeLens", () => {
        workspace
            .getConfiguration("run-function")
            .update("enableCodeLens", false, true);
    });

    commands.registerCommand(
        "run-function.codelensAction",
        async (document: TextDocument, functionName: string, line: number) => {
            output.show(true);
            if (document.isDirty) {
                await document.save();
            }
            const fileName = document.uri.path;
            output.appendLine(`Executing ${functionName}()`); // in file ${fileName}:${line}
            const proc = moduleFunctionProcess(fileName, functionName);
            pipeProcessToOutput(output, proc);
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
