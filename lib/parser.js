/**
 * Parser functions all operate on a string, matching one character at a time until it
 * reaches a non-matching character. They all return 2-member array containing the
 * match and the rest of the string.
 */

const INTEGER = "0123456789"

/**
 * Takes the first character if it's in the list.
 * @param {string} string to search
 * @param {string} search list of characters to match
 * @return {Array<string|false>} [matched, remaining]
 */
const takeNext = exports.takeNext = (string, search) => {
  let matched = ""
  let remaining = string
  if (remaining.length && search.indexOf(remaining.charAt(0)) !== -1) {
    matched = remaining.charAt(0)
    remaining = remaining.slice(1)
  }
  return [matched ? matched : false, remaining ? remaining : false]
}

/**
 * Matches any characters in the search list.
 * @param {string} string to search
 * @param {string} search list of characters to match
 * @return {Array<string|false>} [matched, remaining]
 */
const parse = exports.parse = (string, search) => {
  let matched = ""
  let remaining = string
  let m, r = ""
  while (m !== false && r !== false) {
    [m, r] = takeNext(remaining, search)
    matched = m ? matched += m : matched
    remaining = r
  }
  return [matched ? matched : false, remaining ? remaining : false]
}

/**
 * Matches any characters not in the exclusion list.
 * @param {string} string to search
 * @param {string} exclusion list of characters to exclude
 * @return {Array<string|false>} [matched, remaining]
 */
exports.exclude = (string, exclusion) => {
  let matched = ""
  let remaining = string
  while (exclusion.indexOf(remaining.charAt(0)) === -1 && remaining.length > 0) {
    matched += remaining.charAt(0)
    remaining = remaining.slice(1)
  }
  return [matched ? matched : false, remaining ? remaining : false]
}

/**
 * As exclude, but removes the first instance of the exclusion after the match.
 */
exports.dropExclude = (string, exclusion) => {
  let [match, rest] = exports.exclude(string, exclusion)
  rest = exports.takeNext(rest, exclusion)[1]
  return [match, rest]
}

/**
 * Parses an integer, returning it as a number.
 * @param {string} string to search
 * @param {string} exclusion list of characters to exclude
 * @return {Array<string|number|false>} [matched, remaining]
 */
exports.takeInteger = (string) => {
  let remaining, sign, matched
  ;[sign, remaining] = takeNext(string, "-+")
  sign = sign || ""
  ;[matched, remaining] = parse(remaining, INTEGER)
  const int = parseInt(sign + matched)
  return [isNaN(int) ? false : int, remaining]
}
