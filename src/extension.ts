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
} from "vscode";
import { CodelensProvider } from "./CodelensProvider";
import { moduleFunctionProcess } from "./runner";

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
    // TODO: Consider informing the user that the function is done executing
    // proc.on("close", function (code) {});
    proc.on("error", function (err) {
        console.error(err); // Extension issue
        // TODO: Maybe just append a message like: "Error with LiveRun extension, please submit an issue at $URL"
        channel.appendLine(err.message);
        if (err.stack) {
            channel.appendLine(err.stack);
        }
    });
}

export function activate(context: ExtensionContext) {
    const codelensProvider = new CodelensProvider();
    const output = window.createOutputChannel("Live Run");
    disposables.push(output);

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
        (fileName: string, functionName: string, line: number) => {
            output.show(true);
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
