// The caption stays readable while the optional WebGL layer samples the notebook.
function mountNotebookGlass() {
  const caption = document.querySelector('.cover-art figcaption');
  if (!caption || typeof Container !== 'function' || !window.html2canvas ||
      matchMedia('(forced-colors: active), (prefers-reduced-transparency: reduce)').matches) return;

  const glass = new Container({ type: 'rounded', borderRadius: 16, tintOpacity: 0.18 });
  glass.element.classList.add('notebook-lens');
  glass.element.setAttribute('aria-hidden', 'true');
  glass.element.setAttribute('inert', '');
  caption.prepend(glass.element);
  glass.updateSizeFromDOM();
}

if (document.readyState === 'complete') mountNotebookGlass();
else window.addEventListener('load', mountNotebookGlass, { once: true });
