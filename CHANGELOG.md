# Change Log

All notable changes to the "vscode-run-function" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2021-11-17

### Added

-   Added an icon to the extension

### Fixed

-   Set TypeScript `module` option to `"commonjs"` to fix issues when it's set to `"esnext"` (default for create-react-app)

## [0.2.0] - 2021-11-12

### Added

-   Added the `run-function.buttonDisplay` configuration to define how to display the button to run the function

### Deprecated

-   Deprecated the `run-function.enableCodeLens` configuration in favor of the new `run-function.buttonDisplay` configuration. This will be removed on version 1

## [0.1.1] - 2021-11-08

### Fixed

-   Added typescript as an extension dependency, to avoid errors when typescript isn't a project dependency

## [0.1.0] - 2021-11-07

### Added

-   Displays a **`► Run Function`** button above exported functions
-   Click the button to immediately run the function
-   Returned values are printed in the Output View, along with logs and errors
-   Dependencies are imported properly
-   Supports `.mjs`, `.ts` and `.tsx` files
-   Auto saves the file to run the function
