export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  grammarIssues?: GrammarIssue[];
}

export interface GrammarIssue {
  offset: number;
  length: number;
  message: string;
  shortMessage: string;
  replacements: string[];
  rule: {
    id: string;
    category: string;
    issueType: string;
  };
}

export interface Prediction {
  text: string;
  confidence?: number;
}

export type Theme = 'light' | 'dark';

export interface ChatExport {
  messages: Message[];
  exportedAt: number;
  version: string;
}
