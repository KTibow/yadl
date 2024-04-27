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
export const getNcode = () => {
  let functionName = between(text, `(b=a.get("n"))&&(b=`, `(`);
  if (functionName.includes("[")) {
    const listName = functionName.split("[")[0];
    functionName = between(text, `var ${listName}=[`, `]`);
  }

  const functionData = cutAfterFinish(
    text.split(`${functionName}=function(a)`)[1]
  );
  return `function(a) {
${functionData}
}`;
};
