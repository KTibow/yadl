import { between, cutAfterFinish } from "./lib.js";

const resp1 = await fetch("https://www.youtube.com/watch?v=jNQXAC9IVRw");
const playerHTML = await resp1.text();
const jsUrl = between(playerHTML, `"jsUrl":"`, `"`);
const playerURL = new URL(jsUrl, "https://www.youtube.com");
const resp2 = await fetch(playerURL.href);
const text = await resp2.text();
const getDecipher = () => {
  // Look for a function that takes a string parameter and splits it
  const functionMatch = text.match(
    /[a-zA-Z0-9$_]+\s*=\s*function\([a-zA-Z]\)\{[^}]*?\.split\(""\)[^}]*?\.join/g
  );
  if (!functionMatch?.length) return "";

  const functionName = functionMatch[0].split("=")[0].trim();
  const parts = text.split(`${functionName}=`);
  if (parts.length < 2) return "";

  const fullFunction = parts[1];
  const functionBody = cutAfterFinish(fullFunction);
  if (!functionBody) return "";

  const helperMatch = /([a-zA-Z0-9$_]+)\.([a-zA-Z0-9$_]+)\([a-zA-Z],\d+\)/.exec(
    functionBody
  );
  if (!helperMatch) return "";

  const helperName = helperMatch[1];
  const helperStart = text.indexOf(`var ${helperName}={`);
  if (helperStart === -1) {
    // Try alternate format
    const altHelperStart = text.indexOf(`${helperName}={`);
    if (altHelperStart === -1) return "";
    const helperEnd = text.indexOf("};", altHelperStart) + 2;
    const helperDef = text.substring(altHelperStart - 4, helperEnd);
    const operations =
      functionBody.match(/[a-zA-Z0-9$_]+\.[a-zA-Z0-9$_]+\([a-zA-Z],\d+\)/g) ||
      [];
    const operationStr = operations.join(";");

    return `var ${helperDef}\nfunction(a){a=a.split("");${operationStr};return a.join("")}`;
  }

  const helperEnd = text.indexOf("};", helperStart) + 2;
  const helperDef = text.substring(helperStart, helperEnd);

  const operations =
    functionBody.match(/[a-zA-Z0-9$_]+\.[a-zA-Z0-9$_]+\([a-zA-Z],\d+\)/g) || [];
  const operationStr = operations.join(";");

  return `${helperDef}\nfunction(a){a=a.split("");${operationStr.replace(
    /J/g,
    "a"
  )};return a.join("")}`;
};
const RE1 = /(\w+)\.length\|\|\w+\(""\)/; // Fix dot escaping in regex
const fastReverse = (str) => {
  let newStr = "";
  for (let i = str.length - 1; i >= 0; i--) {
    newStr += str[i];
  }
  return newStr;
};
const getNcode = () => {const functionIndex = text.indexOf("enhanced_except");  // Search for the n function by looking for the enhanced_except pattern
  // Try to find the n function by looking for length check pattern
  const lengthMatch = text.match(
    /[a-zA-Z0-9$_]+=function\([a-zA-Z]\)\{[^}]*?\.length[^}]*?\.split[^}]*}/
  );
  if (lengthMatch) {

    return lengthMatch[0].replace(/^[^=]+=/, "function(a)");
  }

  // Search for the n function by looking for the enhanced_except pattern
  const searchSpace = text.indexOf("enhanced_except");
  if (searchSpace !== -1) {

    // Look for the function definition before enhanced_except
    const beforeText = text.slice(Math.max(0, searchSpace - 500), searchSpace);
    const funcMatch = beforeText.match(
      /[a-zA-Z0-9$_]+=function\([a-zA-Z]\)\{[^}]*$/
    );
    if (funcMatch) {
      // Get the full function including enhanced_except
      const afterText = text.slice(searchSpace, searchSpace + 500);
      const endMatch = afterText.match(/[^{]*\}/);
      if (endMatch) {
        const fullFunc =
          funcMatch[0] +
          afterText.slice(
            0,
            afterText.indexOf(endMatch[0]) + endMatch[0].length
          );

        return fullFunc.replace(/^[^=]+=/, "function(a)");
      }
    }
  }

  // If we didn't find a direct match, let's look for any function that manipulates strings
  const string_funcs = text.match(/function\([a-z]\)\{[^}]*?\.split\(""\)/g);


  const functionSpace =
    functionIndex != -1 &&
    text.slice(functionIndex - 6000, functionIndex + 600);
  const functionText =
    functionSpace &&
    functionSpace.match(/function\(a\){var .+?enhanced_except.+?}/s);
  if (functionText) {

    return functionText[0];
  }
  return "";
};
console.warn(`const decipher = ${getDecipher()};
const ncode = ${getNcode()};`);
