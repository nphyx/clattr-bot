const helpCards = () => `You can draw cards with \`/clattr draw\` or \`:c\` for short. Valid commands are: \`\`\`
:c                        - draw 1 card
:c <deck>                 - draw 1 card from the deck named <deck>
:c <number>               - draw <number> cards from the channel deck
:c <number> <deck>        - draw <number> cards from the deck named <deck> 
:c shuffle                - shuffle the channel deck
:c shuffle <deck>         - shuffle the deck named <deck>
:c remove <deck>          - remove the deck named <deck> from play
:c list                   - list all decks in play
\`\`\`

A pack is automatically shuffled when the deck is empty.
`


const helpDice = () => `You can roll dice with \`/clattr roll\` or \`:d\` for short.

Dice format is <?number><**type**><?number><?**modifier**><?number> where "number" is any whole number, and ? means optional.

- Ask me for more information about about dice **types** with \`/clattr help types\`.
- I support a bunch of **modifiers** for your rolls, like exploding, keep-the-lowest, keep-the-highest, and more. Ask me for more information with \`/clattr help modifiers\`.

Examples:
\`\`\`
:r 1d20                      - roll a 20-sided die
:r 2d8                       - roll two 8-sided dice
:r 3p6                       - roll a pool of three 6-sided dice, counting 5 or 6 as a hit
:r 2w6                       - roll two 6-sided dice and add a wild die (Savage Worlds)
:r f                         - roll four fate dice
\`\`\`

You can add, divide, subtract and multiply dice by other dice or by whole numbers using normal math operators.
\`\`\`
:r 1d20+1                    - roll a 20-sided die and add 1
:r 1d8-1d4                   - subtract the result of a 4-sided die from an 8-sided die
:r 1d4*1d4                   - multiply the results of two 4-sided dice
:r 2d6/2                     - roll two 6-sided dice and divide the result by two
\`\`\`

You can do multiple rolls with a single command, separated by commas:
\`\`\`
:r 1d20+1,1d8               - roll one d20, and separately roll a d8
\`\`\`

You can tag your rolls with a hashtag. I'll add your tags to the result. Tags can have anything except commas in them, which I'll interpret as the start of a new roll.
\`\`\`
:r 1d20+1#hit, 1d8#damage   - roll one d20, and separately roll a d8
:r 1d20+4#leap from the bannister and grab hold of the rope  (this totally works)
\`\`\`


`
const helpCommands = () => `
\`\`\`
Command                    Shortcut    More Info
-----------------------------------------------------------
/clattr help               (none)      /clattr help
/clattr roll               :r          /clattr help dice
/clattr draw               :d          /clattr help cards
/clattr private <command>  (none)      /clattr help private
\`\`\`
`

const helpTypes = () => `Die types are \`d\`ie, \`p\`ool, \`w\`ild, and \`f\`ate.

Normal die rolls use \`d\`. This roll type rolls each die and adds up the result. I support rules **modifiers** for things like exploding dice and keep-the-lowest/keep-the-highest (see \`/clattr help modifiers\` for more info).
\`\`\`
:r 2d20                 - roll two 20-sided dice and add up the result
\`\`\`

For games like ***Storyteller*** and ***Shadowrun***, use \`p\`ool dice. I'll roll a pool of dice, count all the results that are higher than a target number as a 'hit' or 'success' (by default, the top 1/3rd of results), and tell you the total.
\`\`\`
:r 5p10                - roll five 10-sided dice, counting 7 or higher as a success
:r 5p10t8              - roll five 10-sided dice, counting 8 or higher as a success
\`\`\`

For ***Savage Worlds***, I support the \`w\`ild die type. I'll automatically add in a d6 wild die and make your dice explode ("ace"), or a wild die of another size if you ask me to (for settings like Interface Zero where certain Edges and Cyberware provide increased die sizes). Note that Savage Worlds extras, damage rolls and other miscellany do not use wild die, just use exploding dice for that (see \`/clattr help modifiers\` for more info).
\`\`\`
:r 1w8+2               - roll one 8-sided die, add a 6-sided wild die, and add 2 to the total
:r 1w8w8               - roll one 8-sided die and add an 8-sided wild die
\`\`\`

For ***Fate***, I support the \`f\`ate die type. I'll roll special six-sided fate dice, show you which faces you rolled, and add up the result for you.
\`\`\`
:r f                   - make a standard Fate roll with 4 dice
:r 5f                  - roll five fate dice
:r f+2                 - roll four fate dice and add +2
\`\`\`
`

const helpModifiers = () => `
You can use keep-the-highest (\`k\`), keep-the-lowest (\`l\`), and explode (\`!\`) dice.
\`\`\`
:r 2d20k                - roll two 20-sided dice and keep the higher result
:r 2d20l                - roll two 20-sided dice and keep the lower result
:r 3d6!                 - roll three 6-sided dice, and roll another d6 for each 6
\`\`\`

When keeping the lowest or highest die, you can keep more than one:
\`\`\`
:r 3d20k2               - roll three 20-sided dice and keep the two highest
:r 3d20l2               - roll three 20-sided dice and keep the two lowest
\`\`\`

For exploding dice, you can set a target number if they should explode on anything other than the max result (4 for d4, 6 for d6, and so on).
\`\`\`
:r 3d6!5                - roll three 6-sided dice, and roll another d6 for each 5 or higher
\`\`\`

You can also set a limit for exploding dice, if they should only explode a certain number of times.
\`\`\`
:r 3d6!m2               - explode up to two times for each d6 rolled
\`\`\`
Note that I'll only explode a die up to 5 times in a row, though that's pretty unlikely to happen.

You can also combine rule modifiers. I'll execute them in order.
\`\`\`
:r d20!l                - roll an exploding d20 and keep only the lowest result
\`\`\`

For wild dice, if you need to use a wild die with a size other than d6, you can do that:
\`\`\`
:r 2w6w8                - roll two 6-sided dice and an 8-sided wild die
\`\`\`
`

const helpPrivate = () => `You can do commands in secret using \`/clattr private <command>\`.
- You can do this in any channel where I'm present.
- I'll DM the result to you.
- works with all commands.
- Sorry, no \`:\` shortcuts for these.
`

const helpTopics = new Map([
  ['commands', helpCommands],
  ['dice', helpDice],
  ['types', helpTypes],
  ['modifiers', helpModifiers],
  ['cards', helpCards],
  ['private', helpPrivate]
])
/**
 * Handles the clattr help interface.
 */
const handler = (params /*, author, guildId */) => {
  if (helpTopics.has(params)) return helpTopics.get(params)()

  return `
  You can ask for help about: ${[...helpTopics.keys()].map(topic => `\`${topic}\``).join(', ')}

  - I'll DM you with my responses. You can ask for more help in DM with \`/clattr help <topic>\`
  - You can also test out commands here in DMs. Go ahead, give it a try: \`/clattr roll 1d20\`

  Check out my wiki: https://github.com/nphyx/clattr-bot/wiki for even more details.
`
}

module.exports = { handler }
