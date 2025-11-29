import type { Message, ChatExport } from '@/types';

export function exportToText(messages: Message[]): void {
  const text = messages
    .map((msg) => {
      const date = new Date(msg.timestamp).toLocaleString();
      const sender = msg.sender === 'user' ? 'You' : 'AI';
      return `[${date}] ${sender}: ${msg.text}`;
    })
    .join('\n\n');

  downloadFile(text, 'chat-export.txt', 'text/plain');
}

export function exportToJSON(messages: Message[]): void {
  const exportData: ChatExport = {
    messages,
    exportedAt: Date.now(),
    version: '1.0.0',
  };

  const json = JSON.stringify(exportData, null, 2);
  downloadFile(json, 'chat-export.json', 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
