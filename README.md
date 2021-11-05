# Live Run

## Future Work

#### Missing Essential Functionality:

-   Update the README with a proper description and images

#### Ideas and Improvements:

-   Add an option to change auto-save behavior
    -   Auto-save: Saves the file when "Execute function" is clicked. This should also print "Auto saved" in the console
    -   Ask: Shows a dialog to offer saving the file
    -   Temp file: Creates a temp file in the same folder and executes that instead. Might have problems if other files require the file (circular references)
    -   Don't save: Doesn't save the file. Executes the saved file. Should notify the user that it's executing the unsaved version
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
