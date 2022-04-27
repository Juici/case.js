"use strict";

const fs = require("fs");
const path = require("path");

const UNICODE_MIN = 0x0000;
const UNICODE_MAX = 0x10ffff;

/**
 * @param {RegExp} re
 * @returns {string}
 */
function block(re) {
  let ret = "";
  let first = true;
  for (let i = UNICODE_MIN; i <= UNICODE_MAX; i++) {
    if (re.test(String.fromCodePoint(i))) {
      if (!first) {
        ret += "|";
      }
      first = false;
      ret += `"\\u${i.toString(16).padStart(4, "0")}"`;
    }
  }
  return ret;
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
function range(min, max) {
  if (max < min) {
    throw new Error("max must be greater than min");
  }

  let ret = "";
  let first = true;
  for (let i = min; i <= max; i++) {
    if (!first) {
      ret += "|";
    }
    first = false;
    ret += `"\\u${i.toString(16).padStart(4, "0")}"`;
  }
  return ret;
}

const HEADER = "// This file was automatically generated.\n\n";
const UNICODE_TYPES = {
  Ll: /^[\p{Ll}]+$/u,
  Lu: /^[\p{Lu}]+$/u,
  NonAlphanumeric: /^[^\p{Alpha}\p{N}]+$/u,
};
const UTF16_TYPES = {
  NonSurrogate1: [0x0000, 0xd7ff],
  NonSurrogate2: [0xe000, 0xffff],
  TrailingSurrogate: [0xdc00, 0xdfff],
};

const dir = path.resolve(__dirname, "../src/generated");

fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir);

function generateFile(name, content) {
  const file = path.resolve(dir, `${name}.ts`);
  fs.writeFileSync(file, HEADER + content);
}

function generateUnicode() {
  let content = "";
  for (const [name, re] of Object.entries(UNICODE_TYPES)) {
    content += "// prettier-ignore\n";
    content += `export type ${name} = ${block(re)};\n`;
  }
  generateFile("unicode", content);
}

function generateUtf16() {
  let content = "";
  for (const [name, [min, max]] of Object.entries(UTF16_TYPES)) {
    content += "// prettier-ignore\n";
    content += `export type ${name} = ${range(min, max)};\n`;
  }
  generateFile("utf16", content);
}

generateUnicode();
generateUtf16();
