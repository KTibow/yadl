import { between, cutAfterFinish } from "./lib.js";

const resp = await fetch(
  "https://www.youtube.com/s/player/9135c2ab/player_ias.vflset/en_US/base.js"
);
const text = await resp.text();

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
