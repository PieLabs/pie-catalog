//init shadycss polyfill
require('@webcomponents/shadycss/entrypoints/scoping-shim');

export function prepareTemplate(templateHTML, elementName) {
  const template = document.createElement('template');
  template.innerHTML = templateHTML;
  ShadyCSS.prepareTemplate(template, elementName);
  return template;
}

export function applyStyle(el, template, isShadow) {
  isShadow = isShadow !== false;

  ShadyCSS.styleElement(el);
  let templateCopy = document.importNode(template.content, true);
  if (isShadow) {
    let shadowRoot = el.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(templateCopy);
    return shadowRoot;
  } else {
    el.appendChild(templateCopy);
  }
}

export let noSelect = `
 -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */ `;

export let boxShadow = `box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1));`
