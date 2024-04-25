import { getDecipher, getNcode } from "./main.js";

const form = new FormData();
form.append(
  "metadata",
  JSON.stringify({
    main_module: "index.mjs",
    compatibility_date: "2022-03-11",
  })
);
form.append(
  "@index.js",
  new File(
    [
      `const decipher = ${getDecipher()};
const ncode = ${getNcode()};
export default {
  async fetch(request, env) {
    const requestURL = new URL(request.url);
    if (requestURL.pathname != "/") return new Response("Not found", { status: 404 });
    if (request.method != "POST") return new Response("Invalid method", { status: 405 });

    const data = await request.json();
    let url;
    if (data.url) {
      url = new URL(data.url);
    } else if (data.cipher) {
      const query = new URLSearchParams(data.cipher);
      const output = new URL(decodeURIComponent(query.get("url")));
      output.searchParams.set(query.get("sp"), decipher(query.get("s")));

      url = output;
    } else {
      return new Response("Invalid data", { status: 400 });
    }
    if (url.searchParams.has("n")) url.searchParams.set("n", ncode(url.searchParams.get("n")));
    return new Response(url.toString());
  }
}`,
    ],
    "index.mjs",
    {
      type: "application/javascript+module",
    }
  )
);
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/workers/services/ytdl/environments/production/content`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
    },
    body: form,
  }
);
if (!response.ok) throw new Error(await response.text());
console.log(await response.text());
