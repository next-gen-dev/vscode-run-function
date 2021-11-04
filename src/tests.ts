export function textAsyncRegex() {
    const regex =
        /export\s+((async\s+)?function\s+([^\(]+)|const\s+.+\s*=\s*\([^\s=]*\)\s*=>)/g;
    const asyncText = "export async function asyncFunc() {}";
    const asyncMatch = new RegExp(regex).exec(asyncText) ?? [];
    const syncText = "export function syncFunc() {}";
    const syncMatch = new RegExp(regex).exec(syncText) ?? [];
    return [asyncMatch[3], syncMatch[3]];
}
