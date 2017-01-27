export function replaceReact(exampleHtml: string, reactPath: string) {
  let tweaked = exampleHtml
    .replace(/<script.*react.*<\/script>/, `<script src="${reactPath}" type="text/javascript"></script>`)
    .replace('<script src="//cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react-dom.js" type="text/javascript"></script>', '');

  return tweaked;
}