export const between = (string, chop1, chop2) => {
  string = string.slice(string.indexOf(chop1) + chop1.length);
  return string.slice(0, string.indexOf(chop2));
};
export const cutAfterFinish = (string) => {
  let open, close;
  if (string[0] == "[") {
    open = "[";
    close = "]";
  } else if (string[0] == "{") {
    open = "{";
    close = "}";
  }

  let counter = 0;
  let quote = undefined;
  let escape = false;
  for (let i = 0; i < string.length; i++) {
    if (escape) {
      escape = false;
      continue;
    }
    if (string[i] == "\\") {
      escape = true;
      continue;
    }

    if (quote && string[i] == quote) {
      quote = undefined;
      continue;
    } else if (quote) {
      continue;
    }

    if (string[i] == open) {
      // console.log("incrementing counter on", string.slice(i - 1, i + 2));
      counter++;
    } else if (string[i] == close) {
      // console.log("decreasing counter on", string.slice(i - 1, i + 2));
      counter--;
    } else if (string[i] == '"') {
      quote = '"';
    } else if (string[i] == "'") {
      quote = "'";
    } else if (string[i - 1].match(/[,\n]/) && string[i] == "/") {
      quote = "/";
    }
    if (counter == 0) {
      return string.substring(0, i + 1);
    }
  }
};
