# Live Run

## Future Work

#### Missing Essential Functionality:

-   Rename settings strings
-   Handle unsaved files
    -   Either use the in-memory contents of the file, or ask the user to save the file
-   Report errors
-   Redirect logs to the Output or Debug Console

#### Ideas and Improvements:

-   Give feedback to the user when the function starts running (useful for long-running functions)
-   Support `.js` and `.jsx` files
-   Add a setting to choose the output between the information alert and just the Output or Debug Console
-   Only show the CodeLens for supported file extensions
-   Add a VSCode command (Cmd+Shift+P) to run the current function

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
