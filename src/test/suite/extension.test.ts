import { it } from "mocha";
import { match, doesNotMatch, strictEqual, fail } from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { window } from "vscode";
// import * as myExtension from '../../extension';
import { CodelensProvider } from "../../CodelensProvider";

suite("Extension Test Suite", () => {
    window.showInformationMessage("Start all tests.");

    const provider = new CodelensProvider();

    function getRegex(): RegExp {
        // @ts-ignore
        return new RegExp(provider.regex);
    }

    it("should match export function", () => {
        match("export function funcName() {}", getRegex());
    });

    it("should match exported async function", () => {
        match("export async function funcName() {}", getRegex());
    });

    it("should match exported variables with function", () => {
        match("export const varName = function () {}", getRegex());
        match("export let varName = function () {}", getRegex());
        match("export var varName = function () {}", getRegex());
        match("export const varName = async function () {}", getRegex());
        match("export let varName = async function () {}", getRegex());
        match("export var varName = async function () {}", getRegex());
        match("export const varName = () => {}", getRegex());
        match("export let varName = () => {}", getRegex());
        match("export var varName = () => {}", getRegex());
        match("export const varName = () => 2", getRegex());
        match("export let varName = () => 2", getRegex());
        match("export var varName = () => 2", getRegex());
    });

    it("should match functions after import", () => {
        const code = `import { join, parse } from "path";\n\nexport function pathInfo() {}`;

        // Test if it matches
        match(code, getRegex());

        // Checks if it's the correct index (right line)
        const matches = getRegex().exec(code);
        if (matches) {
            strictEqual(matches.index, code.indexOf("export"));
        } else {
            fail("Failed to match regex");
        }
    });

    it("should not match functions inside strings", () => {
        doesNotMatch(`"export async function funcName() {}"`, getRegex());
        doesNotMatch(`"export function funcName() {}"`, getRegex());
        doesNotMatch(`export const name = "function name() {}"`, getRegex());
        doesNotMatch(`export const varName = "function () {}"`, getRegex());
        doesNotMatch(`export const varName = "() => {}"`, getRegex());
    });

    it("should not match functions in comments", () => {
        doesNotMatch(`// export async function funcName() {}`, getRegex());
        doesNotMatch(`/* export async function funcName() {} */`, getRegex());
        doesNotMatch(`export const varName = 1 // function () {}`, getRegex());
        doesNotMatch(`export const varName = 1 // () => 1`, getRegex());
        doesNotMatch(
            `export const varName = 1 /* function () {} */`,
            getRegex(),
        );
        doesNotMatch(`export const varName = 1 /* () => 1 */`, getRegex());
    });
});
