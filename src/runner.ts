import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { parse, join } from "path";

function mjsProcess(filepath: string, functionName: string) {
    const args = [
        "-e",
        `import('${filepath}').then(m => m.${functionName}()).then(v => console.log(JSON.stringify(v)), console.error)`,
    ];
    console.log(`Executing: node ${args.join(" ")}`);
    return spawn("node", args);
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
        '{"target": "es2015"}',
        "-e",
        `import('./${name}').then(m => m.${functionName}()).then(v => console.log(JSON.stringify(v)), console.error)`,
    ];
    console.log(`Executing: ${bin} ${args.join(" ")}`);
    return spawn(bin, args, { cwd: dir });
}

function fileProcess(
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

// TODO: display errors
// TODO: execute file that's not saved
// TODO: .js files
export function runModuleFunction(filepath: string, functionName: string) {
    return new Promise(function (resolve, reject) {
        try {
            const process = fileProcess(filepath, functionName);

            var result = "";
            process.stdout.on("data", function (data) {
                result += data.toString();
            });
            process.stderr.on("data", function (data) {
                console.error(data.toString());
            });
            // TODO: also parse error
            process.on("close", function (code) {
                // Should probably be 'exit', not 'close'
                // *** Process completed
                // console.log(result);
                resolve(JSON.parse(result));
            });
            process.on("error", function (err) {
                // *** Process creation failed
                reject(err);
            });
        } catch (e) {
            reject(e);
        }
    });
}
