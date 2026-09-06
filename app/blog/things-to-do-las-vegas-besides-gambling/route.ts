// The guide this URL served was retired: Search Console recorded no clicks and no
// impressions for it over 90 days. There is no equivalent page to send readers to, and
// redirecting a general Las Vegas activities guide to a mahjong page would be the kind of
// irrelevant redirect Google treats as a soft 404, so this returns a clean 410 instead.
// A route handler and a page cannot share a segment, which is why page.tsx is gone.
// Next will not prerender a non-200 route handler, so this stays dynamic; the response is a
// constant, so that costs nothing.

const BODY = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page Removed | Las Vegas Mahjong</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
         background: #11124a; color: #fff; font-family: system-ui, sans-serif; text-align: center; padding: 2rem; }
  a { color: #39e639; font-weight: 600; }
  p { color: rgba(255,255,255,0.7); line-height: 1.7; max-width: 34rem; }
</style>
</head>
<body>
  <main>
    <h1>This guide has been removed</h1>
    <p>It is not coming back, so there is nothing to update your bookmarks to. If you came here
    looking for something to do in Las Vegas, our
    <a href="https://www.lasvegasmahj.com/schedule">class and open play schedule</a> is the best
    place to start, or see
    <a href="https://www.lasvegasmahj.com/mahjong-parties-las-vegas">mahjong parties</a>
    for group events.</p>
  </main>
</body>
</html>`;

export function GET() {
  return new Response(BODY, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}
