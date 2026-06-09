import type { TranslationTree } from './types';

export function resolveTranslation(tree: TranslationTree, path: string): string {
  const parts = path.split('.');
  let node: string | TranslationTree = tree;
  for (const part of parts) {
    if (typeof node !== 'object' || node === null || !(part in node)) {
      return path;
    }
    node = node[part];
  }
  return typeof node === 'string' ? node : path;
}

export function formatTranslation(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ''));
}
