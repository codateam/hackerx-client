export function stripOnlyMarkdownBlock(text: string): string {
  return text
    .replace(/^\s*```markdown\s*/, '') // match only ```markdown at the top
    .replace(/\s*```$/, '')           // match closing ```
    .trim();
}