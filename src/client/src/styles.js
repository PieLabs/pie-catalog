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


export let boxShadow = `box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1));`
