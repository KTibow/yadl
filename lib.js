export const between = (string, chop1, chop2) => {
  if (string.indexOf(chop1) == -1) return "";
  string = string.slice(string.indexOf(chop1) + chop1.length);
  return string.slice(0, string.indexOf(chop2));
};
export const cutAfterFinish = (string) => {
  if (!string) {
    return "";
  }

  // Skip to the first { or [
  const start = string.indexOf("{");
  if (start === -1) return "";
  string = string.slice(start);

  let open = "{",
    close = "}";
  if (string[0] === "[") {
    open = "[";
    close = "]";
  }

  let counter = 0;
  let quote = undefined;
  let escape = false;
  let inRegex = false;
  let regexDepth = 0;

  for (let i = 0; i < string.length; i++) {
    if (escape) {
      escape = false;
      continue;
    }
    if (string[i] === "\\") {
      escape = true;
      continue;
    }

    if (quote && string[i] === quote) {
      quote = undefined;
      continue;
    } else if (quote) {
      continue;
    }

    if (inRegex) {
      if (string[i] === "[") {
        regexDepth++;
      } else if (string[i] === "]") {
        if (regexDepth > 0) {
          regexDepth--;
        } else {
          inRegex = false;
        }
      } else if (string[i] === "/" && regexDepth === 0) {
        inRegex = false;
      }
      continue;
    }

    if (string[i] === open) {
      counter++;
    } else if (string[i] === close) {
      counter--;
    } else if (string[i] === '"' || string[i] === "'") {
      quote = string[i];
    } else if (string[i] === "/" && i > 0 && string[i - 1].match(/[,\n[({]/)) {
      inRegex = true;
      regexDepth = 0;
    }

    if (counter === 0) {
      return string.substring(0, i + 1);
    }
  }
};
