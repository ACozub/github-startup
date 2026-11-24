const backdrop = document.querySelector('.cover-gradient');
const staticMode = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
let visible = false;
let root;
let modules;

async function updateGradient() {
  if (!visible || staticMode.matches || document.hidden) {
    root?.unmount();
    root = undefined;
    return;
  }

  try {
    modules ??= Promise.all([
      import('react'), import('react-dom/client'), import('@shadergradient/react')
    ]);
    const [{ createElement }, { createRoot }, { ShaderGradientCanvas, ShaderGradient }] = await modules;
    if (root || !visible || staticMode.matches || document.hidden) return;

    const palette = getComputedStyle(backdrop);
    root = createRoot(backdrop);
    root.render(createElement(ShaderGradientCanvas, {
      pixelDensity: 1, style: { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    }, createElement(ShaderGradient, {
      type: 'plane', animate: 'on', lightType: '3d', grain: 'off',
      color1: palette.getPropertyValue('--shader-forest').trim(),
      color2: palette.getPropertyValue('--shader-sage').trim(),
      color3: palette.getPropertyValue('--shader-teal').trim(),
      brightness: 0.85,
      cDistance: 3.6, cPolarAngle: 90, uFrequency: 5.5, uStrength: 4, uSpeed: 0.12
    })));
  } catch (error) {
    console.warn('Cover shader unavailable. Using the static gradient.', error);
  }
}

new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  updateGradient();
}).observe(backdrop);
staticMode.addEventListener('change', updateGradient);
document.addEventListener('visibilitychange', updateGradient);
