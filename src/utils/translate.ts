// Simple translation utility for user-generated content
// In a real app, this would connect to a translation service like Google Translate

const translateText = async (text: string, targetLanguage: 'en' | 'zh'): Promise<string> => {
  // For now, return original text since we don't have a translation service
  // In production, this would call a translation API
  return text;
};

// Helper to detect if text needs translation
const shouldTranslate = (text: string, currentLanguage: 'en' | 'zh'): boolean => {
  if (!text || text.trim().length === 0) return false;
  
  // Simple heuristic: if current language is Chinese but text contains mostly English characters
  if (currentLanguage === 'zh') {
    const englishChars = text.match(/[a-zA-Z]/g);
    const totalChars = text.replace(/\s/g, '').length;
    return englishChars && englishChars.length > totalChars * 0.5;
  }
  
  // If current language is English but text contains Chinese characters
  if (currentLanguage === 'en') {
    const chineseChars = text.match(/[\u4e00-\u9fff]/g);
    return chineseChars && chineseChars.length > 0;
  }
  
  return false;
};

export { translateText, shouldTranslate };