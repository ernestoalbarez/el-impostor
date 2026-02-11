import { Category, Word } from '@/types/game';

/**
 * Select a random category from the list — O(1)
 */
export function selectCategory(categories: Category[]): Category {
  return categories[Math.floor(Math.random() * categories.length)];
}

/**
 * Select a random word from a category — O(1)
 */
export function selectWord(category: Category): Word {
  return category.palabras[Math.floor(Math.random() * category.palabras.length)];
}

/**
 * Get the main word for a civil player
 */
export function getCivilWord(word: Word): string {
  return word.principal;
}

/**
 * Get a hint for an impostor. 
 * If useSecondary is true and secondary hints exist, pick a random one.
 * Otherwise return pista_principal.
 */
export function getImpostorHint(word: Word, useSecondary: boolean): string {
  if (useSecondary && word.pistas_secundarias.length > 0) {
    return word.pistas_secundarias[Math.floor(Math.random() * word.pistas_secundarias.length)];
  }
  return word.pista_principal;
}
