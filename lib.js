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
  for (let i = 0; i < string.length; i++) {
    if (quote && string[i] == quote) {
      quote = undefined;
      continue;
    } else if (quote) {
      continue;
    }

    if (string[i] == open) {
      counter++;
    } else if (string[i] == close) {
      counter--;
    } else if (string[i] == '"') {
      quote = '"';
    } else if (string[i] == "'") {
      quote = "'";
    } else if (string[i - 1] == "," && string[i] == "/") {
      quote = "/";
    }
    if (counter == 0) {
      return string.substring(0, i + 1);
    }
  }
};
