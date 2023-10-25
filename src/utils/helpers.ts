import { toRomaji } from 'wanakana';

export const isPartialMatch = (mainString: string, searchString: string) => {
  let mainIndex = 0;
  for (let i = 0; i < searchString.length; i++) {
    const char = searchString[i];
    while (mainIndex < mainString.length && mainString[mainIndex] !== char) {
      mainIndex++;
    }
    if (mainIndex === mainString.length) return false;
    mainIndex++;
  }
  return true;
};

export const hiraganaToKatakana = (text: string) => {
  return text.replace(/[\u3041-\u3096]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) + 0x60)
  );
};

export const katakanaToHiragana = (text: string) => {
  return text.replace(/[\u30a1-\u30f6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );
};

export const hiraganaToRomaji = (text: string) => {
  return toRomaji(text, {
    customRomajiMapping: {
      じ: 'zi',
      ふ: 'hu',
      しゃ: 'sya',
      しゅ: 'syu',
      しょ: 'syo',
      ちゃ: 'tya',
      ちぃ: 'tyi',
      ちゅ: 'tyu',
      ちぇ: 'tye',
      ちょ: 'tyo',
    },
  });
};
