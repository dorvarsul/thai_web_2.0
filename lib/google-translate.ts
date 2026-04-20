type GoogleTranslateChunk = [string, string | null, string | null, string | null];

function isGoogleTranslateChunk(value: unknown): value is GoogleTranslateChunk {
  return Array.isArray(value) && typeof value[0] === 'string';
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage = 'auto'
): Promise<string | null> {
  const candidate = text.trim();

  if (!candidate) {
    return null;
  }

  try {
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.set('client', 'gtx');
    url.searchParams.set('sl', sourceLanguage);
    url.searchParams.set('tl', targetLanguage);
    url.searchParams.set('dt', 't');
    url.searchParams.set('q', candidate);

    const response = await fetch(url.toString());
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      return null;
    }

    const translated = data[0]
      .filter(isGoogleTranslateChunk)
      .map((chunk) => chunk[0])
      .join('')
      .trim();

    return translated || null;
  } catch {
    return null;
  }
}