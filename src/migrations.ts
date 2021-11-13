import { ConfigurationTarget, workspace } from "vscode";
import { ButtonDisplayType } from "./CodelensProvider";

async function migrateDeprecatedConfigForTarget(
    value: boolean,
    target: ConfigurationTarget,
) {
    const buttonDisplayValue: ButtonDisplayType = value
        ? "icon and text above"
        : "none";
    await workspace
        .getConfiguration("run-function")
        .update("buttonDisplay", buttonDisplayValue, target);
    await workspace
        .getConfiguration("run-function")
        .update("enableCodeLens", undefined, target);
}

export async function migrateDeprecatedConfig() {
    const conf = workspace
        .getConfiguration("run-function")
        .inspect<boolean>("enableCodeLens");

    if (conf === undefined) return;

    if (conf.workspaceFolderValue !== undefined) {
        await migrateDeprecatedConfigForTarget(
            conf.workspaceFolderValue,
            ConfigurationTarget.WorkspaceFolder,
        );
    }
    if (conf.workspaceValue !== undefined) {
        await migrateDeprecatedConfigForTarget(
            conf.workspaceValue,
            ConfigurationTarget.Workspace,
        );
    }
    if (conf.globalValue !== undefined) {
        await migrateDeprecatedConfigForTarget(
            conf.globalValue,
            ConfigurationTarget.Global,
        );
    }
}
