import type { GrammarIssue } from '@/types';

const LANGUAGETOOL_API_URL = 'https://api.languagetool.org/v2/check';

export async function checkGrammar(text: string): Promise<GrammarIssue[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  try {
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('language', 'en-US');
    formData.append('enabledOnly', 'false');

    const response = await fetch(LANGUAGETOOL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.matches && Array.isArray(data.matches)) {
      return data.matches.map((match: any) => ({
        offset: match.offset,
        length: match.length,
        message: match.message,
        shortMessage: match.shortMessage || match.message,
        replacements: match.replacements
          ? match.replacements.slice(0, 3).map((r: any) => r.value)
          : [],
        rule: {
          id: match.rule.id,
          category: match.rule.category.name,
          issueType: match.rule.issueType || 'grammar',
        },
      }));
    }

    return [];
  } catch (error) {
    console.error('Error checking grammar:', error);
    return [];
  }
}
