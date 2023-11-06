import { toRomaji } from 'wanakana';

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
      し: 'si',
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

export const formatTime = (time?: Date) => {
  if (!time) return undefined;
  return new Date(time).toLocaleString('jp-JP', {
    timeZone: 'Asia/Tokyo',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const displayRate = (rate?: number) => {
  if (rate == undefined || rate === null) return;
  if (Number.isNaN(rate)) return '-';
  return `${Math.round(rate * 100)} %`;
};
