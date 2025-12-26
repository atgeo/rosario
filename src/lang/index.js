export async function loadLang (code) {
  switch (code) {
    case 'en':
      return import('./en.js').then(m => m.default)
    default:
      throw new Error(`Unsupported language: ${code}`)
  }
}
