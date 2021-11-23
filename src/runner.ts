import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { parse, join } from "path";

// TODO: execute file that's not saved
// TODO: .js files

function mjsProcess(filepath: string, functionName: string) {
    const { dir } = parse(filepath);
    const args = [
        "-e",
        `import('${filepath}').then(m => m.${functionName}()).then(v => console.log(JSON.stringify(v, null, 4)), console.error)`,
    ];
    console.log(`Executing: node ${args.join(" ")}`);
    return spawn("node", args, { cwd: dir });
}

function tsProcess(filepath: string, functionName: string) {
    const { name, dir } = parse(filepath);
    const bin = join(
        __dirname,
        "..",
        "node_modules",
        "ts-node",
        "dist",
        "bin.js",
    );
    const args = [
        "-T",
        "-O",
        `{"target": "es2015", "module": "commonjs"}`,
        "-e",
        `import('./${name}').then(m => m.${functionName}()).then(v => console.log(JSON.stringify(v, null, 4)), console.error)`,
    ];
    console.log(`Executing: ${bin} ${args.join(" ")}`);
    return spawn(bin, args, { cwd: dir });
}

// function runInTerminal(filepath: string, functionName: string) {
//     const { name } = parse(filepath);
//     const terminal = window.createTerminal("Code");
//     terminal.show(true);
//     // this.sendRunEvent(executor, true);
//     // executor = this.changeExecutorFromCmdToPs(executor);
//     // let command = await this.getFinalCommandToRunCodeFile(executor, appendFile);
//     // command = this.changeFilePathForBashOnWindows(command);
//     // if (this._config.get<boolean>("clearPreviousOutput") && !isNewTerminal) {
//     //     await vscode.commands.executeCommand("workbench.action.terminal.clear");
//     // }
//     // if (this._config.get<boolean>("fileDirectoryAsCwd")) {
//     //     const cwd = this.changeFilePathForBashOnWindows(this._cwd);
//     //     this._terminal.sendText(`cd "${cwd}"`);
//     // }
//     // this._terminal.sendText(command);
//     const bin = join(
//         __dirname,
//         "..",
//         "node_modules",
//         "ts-node",
//         "dist",
//         "bin.js",
//     );
//     terminal.sendText(
//         `${bin} -T -O '{"target": "es2015"}' -e "import('./${name}').then(m => m.${functionName}()).then(v => console.log(JSON.stringify(v)), console.error)"`,
//     );
// }

export function moduleFunctionProcess(
    filepath: string,
    functionName: string,
): ChildProcessWithoutNullStreams {
    const extension = parse(filepath).ext;
    switch (extension) {
        case ".mjs":
            return mjsProcess(filepath, functionName);
        case ".ts":
        case ".tsx":
            return tsProcess(filepath, functionName);
    }
    throw new Error(`Extension "${extension}" not supported`);
}
