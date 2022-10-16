import path from "path";
import url from "url";

import chalk from "chalk";
import fs from "graceful-fs";
import ms from "pretty-ms";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const PROJECT_ROOT = path.dirname(__dirname);
const GENERATED_DIR = path.resolve(PROJECT_ROOT, "src/types/generated");

const UNICODE_MIN = 0x0000;
const UNICODE_MAX = 0x10ffff;

const HEADER = "// This file was automatically generated.\n\n";

await fs.promises.rm(GENERATED_DIR, { recursive: true, force: true });
await fs.promises.mkdir(GENERATED_DIR);

console.log(chalk.cyanBright("generating character definition files..."));

const start = Date.now();

const unicode = block("Alphanumeric", /^[\p{Alphabetic}\p{N}]+$/u);
const utf16 = range("LeadingSurrogate", 0xd800, 0xdbff);

await Promise.all([generateFile("unicode", unicode), generateFile("utf16", utf16)]);

const duration = Date.now() - start;

console.log(
  chalk.green(
    `generated ${chalk.bold(path.relative(PROJECT_ROOT, GENERATED_DIR))} in ${chalk.bold(
      ms(duration),
    )}`,
  ),
);

/**
 * @param {string} name
 * @param {string} content
 */
async function generateFile(name, content) {
  const file = path.resolve(GENERATED_DIR, `${name}.ts`);

  await fs.promises.writeFile(file, HEADER + content, "utf-8");
}

/**
 * @param {string} name
 * @param {RegExp} re
 * @returns {string}
 */
function block(name, re) {
  let type = "";
  let i = UNICODE_MIN;

  for (; i <= UNICODE_MAX; i++) {
    // Loop until we find the first character.
    if (re.test(String.fromCharCode(i))) {
      type += unicodeEscaped(i);
      i++;
      break;
    }
  }

  for (; i <= UNICODE_MAX; i++) {
    if (re.test(String.fromCodePoint(i))) {
      type += `|${unicodeEscaped(i)}`;
    }
  }

  if (type.length === 0) {
    throw new Error(`No characters for '${name}' match: ${re}`);
  }

  return `export type ${name} = ${type};\n`;
}

/**
 * @param {string} name
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
function range(name, min, max) {
  if (max < min) {
    throw new Error(`No characters for '${name}' in empty range: [${min}, ${max}]`);
  }

  let type = unicodeEscaped(min);
  for (let i = min + 1; i <= max; i++) {
    type += `|${unicodeEscaped(i)}`;
  }
  return `export type ${name} = ${type};\n`;
}

/**
 * @param {number} c
 * @returns {string}
 */
function unicodeEscaped(c) {
  return `"\\u${c.toString(16).padStart(4, "0")}"`;
}
