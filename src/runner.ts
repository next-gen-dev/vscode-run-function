import { spawn } from "child_process";

// TODO: execute file that's not saved
// TODO: typescript
// TODO: .js files
export function runModuleFunction(file: string, name: string) {
    return new Promise(function (resolve, reject) {
        try {
            const process = spawn("node", [
                "-e",
                `import('${file}').then(m => m.${name}()).then(v => console.log(JSON.stringify(v)))`,
            ]);

            var result = "";
            process.stdout.on("data", function (data) {
                result += data.toString();
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
