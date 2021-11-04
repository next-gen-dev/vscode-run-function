# Live Run

## Developing

-   Run `npm install` in terminal to install dependencies
-   Run the `Run Extension` target in the Debug View. This will:
    -   Start a task `npm: watch` to compile the code
    -   Run the extension in a new VS Code window

## VS Code API reference

### `languages` module

-   [`languages.registerCodeLensProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerCodeLensProvider)

### CodeLens Provider

-   [`CodeLensProvider`](https://code.visualstudio.com/api/references/vscode-api#CodeLensProvider)
-   [`CodeLensProvider.provideCodeLenses`](https://code.visualstudio.com/api/references/vscode-api#CodeLensProvider.provideCodeLenses)
-   [`CodeLensProvider.resolveCodeLens`](https://code.visualstudio.com/api/references/vscode-api#CodeLensProvider.resolveCodeLens)
