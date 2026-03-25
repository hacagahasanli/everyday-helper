import levenshteinDistance from "./levenshtein-distance";
import normalizeAzText from "./normalize-az-text";

export const enum SearchMode {
  DEEP = 'deep',
  LIGHT = 'light',
  NORMAL = 'normal',
}

export interface SearchableOption {
  label: string;
  value: string;
  children?: SearchableOption[];
}

const advancedSearch = <T extends SearchableOption>(
  options: T[],
  searchTerm: string,
  mode: SearchMode = SearchMode.DEEP,
): T[] => {
  if (!searchTerm) return options;

  const term = normalizeAzText(searchTerm);

  switch (mode) {
    case SearchMode.LIGHT:
      return lightSearch(options, term);
    case SearchMode.NORMAL:
      return normalSearch(options, term);
    case SearchMode.DEEP:
    default:
      return deepSearch(options, term);
  }
};

const lightSearch = <T extends SearchableOption>(options: T[], searchTerm: string): T[] => {
  const filteredOptions: T[] = [];

  for (const option of options) {
    const normalizedLabel = normalizeAzText(option.label || '');
    const parentMatches = normalizedLabel.includes(searchTerm);

    let filteredChildren: SearchableOption[] = [];
    if (option.children?.length) {
      filteredChildren = option.children.filter((child) => {
        const normalizedChildLabel = normalizeAzText(child.label || '');
        return normalizedChildLabel.includes(searchTerm);
      });
    }

    if (parentMatches || filteredChildren.length > 0) {
      filteredOptions.push({
        ...option,
        children: filteredChildren,
      } as T);
    }
  }

  return filteredOptions;
};

const normalSearch = <T extends SearchableOption>(options: T[], searchTerm: string): T[] => {
  const searchWords = searchTerm.split(' ').filter(Boolean);
  const scoredOptions: Array<{ option: T; score: number }> = [];

  for (const option of options) {
    const normalizedLabel = normalizeAzText(option.label || '');
    let parentScore = 0;

    for (const word of searchWords) {
      if (normalizedLabel.includes(word)) {
        parentScore += 15;
      } else {
        const wordsInLabel = normalizedLabel.split(' ');
        const hasCloseMatch = wordsInLabel.some((labelWord) => {
          const distance = levenshteinDistance(word, labelWord);
          return distance <= Math.min(2, Math.floor(word.length / 3));
        });
        if (hasCloseMatch) {
          parentScore += 5;
        }
      }
    }

    let filteredChildren: SearchableOption[] = [];
    if (option.children?.length) {
      filteredChildren = option.children
        .map((child) => {
          const normalizedChildLabel = normalizeAzText(child.label || '');
          let childScore = 0;

          for (const word of searchWords) {
            if (normalizedChildLabel.includes(word)) {
              childScore += 15;
            } else {
              const wordsInChildLabel = normalizedChildLabel.split(' ');
              const hasCloseMatch = wordsInChildLabel.some((labelWord) => {
                const distance = levenshteinDistance(word, labelWord);
                return distance <= Math.min(2, Math.floor(word.length / 3));
              });
              if (hasCloseMatch) {
                childScore += 5;
              }
            }
          }

          return childScore >= 8 ? { ...child, score: childScore } : null;
        })
        .filter(Boolean) as SearchableOption[];
    }

    if (parentScore >= 8 || filteredChildren.length > 0) {
      scoredOptions.push({
        option: { ...option, children: filteredChildren } as T,
        score: parentScore,
      });
    }
  }

  return scoredOptions.sort((a, b) => b.score - a.score).map((item) => item.option);
};

const deepSearch = <T extends SearchableOption>(options: T[], searchTerm: string): T[] => {
  const searchWords = searchTerm.split(' ').filter(Boolean);
  const scoredOptions: Array<{ option: T; score: number }> = [];

  for (const option of options) {
    const normalizedLabel = normalizeAzText(option.label || '');
    let parentScore = 0;

    for (const word of searchWords) {
      if (normalizedLabel.includes(word)) {
        parentScore += 20;
      } else {
        const wordsInLabel = normalizedLabel.split(' ');
        const minDistance = Math.min(
          ...wordsInLabel.map((labelWord) => levenshteinDistance(word, labelWord)),
        );
        if (minDistance <= Math.max(Math.floor(word.length / 2), 3)) {
          parentScore += 10 / (minDistance + 1);
        }
      }
    }

    let filteredChildren: SearchableOption[] = [];
    if (option.children?.length) {
      filteredChildren = option.children
        .map((child) => {
          const normalizedChildLabel = normalizeAzText(child.label || '');
          let childScore = 0;

          for (const word of searchWords) {
            if (normalizedChildLabel.includes(word)) {
              childScore += 20;
            } else {
              const wordsInChildLabel = normalizedChildLabel.split(' ');
              const minDistance = Math.min(
                ...wordsInChildLabel.map((labelWord) => levenshteinDistance(word, labelWord)),
              );
              if (minDistance <= Math.max(Math.floor(word.length / 2), 3)) {
                childScore += 10 / (minDistance + 1);
              }
            }
          }

          return childScore >= 3 ? { ...child, score: childScore } : null;
        })
        .filter(Boolean) as SearchableOption[];
    }

    if (parentScore >= 3 || filteredChildren.length > 0) {
      scoredOptions.push({
        option: { ...option, children: filteredChildren } as T,
        score: parentScore,
      });
    }
  }

  return scoredOptions.sort((a, b) => b.score - a.score).map((item) => item.option);
};

export default advancedSearch;