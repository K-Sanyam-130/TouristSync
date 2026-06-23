// voiceTranslator/translateText.js
// Isolated translation utility — swap the API provider here without touching any UI component.

import { getShortCode } from './translatorConstants';

const LIBRE_TRANSLATE_URL = 'https://libretranslate.de/translate';

/**
 * Translate text from one language to another.
 * @param {string} text — the text to translate
 * @param {string} sourceLang — BCP-47 code (e.g. 'en-US')
 * @param {string} targetLang — BCP-47 code (e.g. 'hi-IN')
 * @returns {Promise<string>} — the translated text
 */
export async function translateText(text, sourceLang, targetLang) {
  const source = getShortCode(sourceLang);
  const target = getShortCode(targetLang);

  try {
    const response = await fetch(LIBRE_TRANSLATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: 'text',
      }),
    });

    if (!response.ok) {
      return await fallbackTranslate(text, source, target);
    }

    const data = await response.json();

    if (data.error) {
      return await fallbackTranslate(text, source, target);
    }

    return data.translatedText;
  } catch (error) {
    return await fallbackTranslate(text, source, target);
  }
}

/**
 * Fallback translation using MyMemory API (free, no key, 1000 words/day)
 */
async function fallbackTranslate(text, source, target) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    throw new Error('Translation not available');
  } catch (error) {
    throw new Error('Translation failed. Please try again.');
  }
}
