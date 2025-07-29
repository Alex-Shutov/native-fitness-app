//
//
//  const hyphenatePhrase = (phrase) => {
//   return phrase
//     .split(' ')
//     .map(word => hyphenate(word))
//     .join(' ');
// };

import createHyphenator from 'hyphen';
import pattern from 'hyphen/patterns/ru';

const hyphenate = createHyphenator(pattern, { hyphenChar: '\u00AD' });
export const mapGoalsFromApi = (goalsApi) => {
  return goalsApi
    .filter((el) => el.active)
    .map((e) => ({
      id: e.id,
      value: hyphenate(e.name),
    }));
};
