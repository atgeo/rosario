const LANG_LOADERS = {
  en: () => import('./en.js'),
  la: () => import('./la.js'),
  it: () => import('./it.js'),
}

export async function loadLang (code) {
  const loader = LANG_LOADERS[code]

  if (!loader) {
    throw new Error(`Unsupported language: ${code}`)
  }

  const module = await loader()
  return module.default
}
