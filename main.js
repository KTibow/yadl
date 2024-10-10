import { between, cutAfterFinish } from "./lib.js";

const resp1 = await fetch("https://www.youtube.com/watch?v=jNQXAC9IVRw");
const playerHTML = await resp1.text();
const playerURL = new URL(
  between(playerHTML, `"jsUrl":"`, `"`),
  "https://www.youtube.com"
);
const resp2 = await fetch(playerURL.href);
const text = await resp2.text();

export const getDecipher = () => {
  const functionName = between(text, `a.set("alr","yes");c&&(c=`, `(`);

  const functionData = cutAfterFinish(
    text.split(`${functionName}=function(a)`)[1]
  );
  const resourceName = between(functionData, `a=a.split("");`, `.`);
  const resourceData = cutAfterFinish(text.split(`var ${resourceName}=`)[1]);
  return `function(a) {
const ${resourceName} = ${resourceData};
${functionData}
}`;
};
const RE1 = /(\w+).length\|\|\w+\(""\)/;
const fastReverse = (str) => {
  let newStr = "";
  for (let i = str.length - 1; i >= 0; i--) {
    newStr += str[i];
  }
  return newStr;
}
export const getNcode = () => {
  const functionIndex = text.indexOf("enhanced_except");
  const functionSpace = functionIndex != -1 && text.slice(functionIndex - 6000, functionIndex + 600);
  const functionText = functionSpace && functionSpace.match(/function\(a\){var .+?enhanced_except.+?}.+?}/s);
  if (functionText) return functionText[0];

  let functionName;
  if (!functionName && RE1.test(text)) {
    functionName = RE1.exec(text)[1];
  }
  if (!functionName) throw new Error("failed to find ncode function");

  if (between(text, `var ${functionName}=[`, `]`)) {
    functionName = between(text, `var ${functionName}=[`, `]`);
  }
  const functionData = cutAfterFinish(
    text.split(`${functionName}=function(a)`)[1]
  );
  return `function(a) {
  ${functionData}
  }`;
};
console.log(`const decipher = ${getDecipher()};
const ncode = ${getNcode()};`);
