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
export const getNcode = () => {
  const fullFunction = text.match(/function\(a\){.+?enhanced_except.+?}.+?}/s)?.[0];
  if (fullFunction) return fullFunction;

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
