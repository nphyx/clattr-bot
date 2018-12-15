Clattr Bot
==========

An experimental dice bot for discord.

Features
--------

- **Multiple Rolls in One Line**: `!r 1d20, 1d4` will roll a 20-sided die and a 10-sided die with separate results
- **Roll Dice in Groups**: `!r 1d4+3d6` will roll a 4-sided and three 6-sided dice, then add the result
- **Tag Your Rolls**: `!r 1d20+3 #to hit` will tag the result in its response
- **Keeping & Discarding Rolls**: `!r 2d20k1+3 #with advantage` will count only the highest of the two dice, likewise `!r 2d20l1+3 #disadvantage` will keep the lowest
- **Mix and Match**: `!r 2d20+6 #to hit with advantage, 1d4+3d6+3 #damage` will roll to hit and damage, and tag each roll, in one line!
- **Exploding Dice**: `!r 3d6!` will make sixes explode! `!r 3d10!5` will make anything over 5 explode! `!r 3d10!5m1` will make explosions, but only once per original die!
- **Dice Pools**: Clattr supports dice pool systems: `!r 5p10t7` will roll five 10-sided dice, and count one hit for each die that rolls 7 or higher
- **Fate Dice**: You can use fate dice too if you're in to that sort of thing: `!r 4f+3` rolls four fate dice, and adds 3 to the result
- **Cleans Up its Mess**: Clattr will remove your roll message and tag you in a new message when it has a result - clattr, but no cluttr!
- **Nicely Formatted**: Clattr puts its results (plus tags) at the start of its response where they belong, and displays the details afterward
- **Better Randomness**: Clattr will give more 'random-feeling' results than some dice rollers, no streaks or runs (it uses the mersenne-twister PRNG algorithm, if you're curious)

Using the bot
-------------
Every roll starts with `!r ` - that tells the bot to pay attention and read the rest of the line. It will ignore any other messages.

Here's a full breakdown of a single dice roll, with some examples:

|             | count | type  |  size | target | rule        | max   | mod    | tag      | result |
|-------------|-------|-------|-------|--------|-------------|-------|--------|----------|--------|
|  accepts    | [int] | d,p,f | [int] | t[int] | !,k,l[int]  | [int] | m[int] | +/-[int] |        |
| **Examples**|       |       |       |        |             |       |        |          |        |
| `1d20 #hit` | 1     | d     | 20    |        |             |       |        | hit      | roll 1d20, with the tag 'hit' |
| `2d20k1+3`  | 2     | d     | 20    |        | k1          |       | +3     |          | roll 2 d20s, keep the highest, and add 3 |
| `4d20l2-1`  | 2     | d     | 20    |        | k2          |       | -3     |          | roll 2 d20s, keep the lowest 2, and subtract 3 |
| `3d6!`      | 3     | d     | 6     |        | !           |       |        |          | roll 3 exploding d6s |
| `3d6!5`     | 3     | d     | 6     |        | !5          |       | m1     |          | roll 3 exploding d6s that explode on 5 or 6 |
| `3d6!m1`    | 3     | d     | 6     |        | !           |       | m1     |          | roll 3 exploding d6s, but they only explode once |
| `3d6!5m1`   | 3     | d     | 6     |        | !5          |       | m1     |          | roll 3 exploding d6s that explode on 5 or 6, but they only explode once |
| `3p6t4`     | 3     | p     | 6     | t4     |             |       |        |          | roll a pool of 3d6, counting 4 or higher as a hit |
| `3p6t4!`    | 3     | p     | 6     | t4     | !           |       |        |          | roll a pool of 3d6, counting 4 or higher as a hit, exploding on 6 |
| `4f+3`      | 4     | f     | 3     |        |             |       |        | +3       | roll 4 fate dice, add 3 to the result |

An explanation of the columns:

|            | required  | possible values  | description |
|------------|-----------|------------------|-------------|
| count      | yes       | any whole number | the number of dice to roll |
| type       | yes       | `d`, `p`, or `f` | roll as individual dice and add their values (`d`), as a pool and count the hits (`p`), or roll fate dice (`f`) |
| size       | no        | any whole number | the size of the die to roll - defaults to 6 for type d, 10 for type p, and 3 for fate (displayed as '+', ' ', and '-') |
| target     | sometimes | any whole number | the target number to count as a hit, required for dice pools - otherwise unused |
| rule       | no        | `!`, `k`, or `l` | special rules for how the dice should be handled - exploding (`!`), keep the highest (`1`), keep the lowest (`1) |
| rule value | no        | any whole number | for exploding dice, any die equal or higher than this will explode (the highest possible value by default), for keep lower/higher, the number of dice to keep |
| max        | no        | `m`, 1-5         | for exploding dice, the number of times a die can explode (default 5, and can't be set higher than 5) | 
| modifier   | no        | any number       | for individual dice (`d`) and fate dice (`f`) only, a number to be added to the result |
| tag        | no        | `#`, text        | a tag to add to the roll group, can be almost any character except `,` |

This might get a little overwhelming. Don't think too much about it, and check out the examples. It's easier than it looks when you're staring at giant tables.

Adding Multiple Rolls Together
------------------------------
You can add together multiple rolls with `+`. Subtracting one roll from another roll and other math operators will come later. Dice can be placed in any order.

Examples:

- *`!r 3d6+1d4+1`*: # add together the results of three 6-sided dice, one 4-sided die, and add 1
- *`!r 2d20k1`*: roll two twenty-sided dice, and keep the higher of the two

Rolling Multiple Groups Separately
----------------------------------
You can do separate rolls on one line, separated by a comma. Each roll can have a tag, can add together multiple dice types, and can use different rules and dice types

Examples:

- *`!r 1d20+6 #to hit, 1d4+3d6+3 #damage`*: make your hit and damage rolls on the same line
- *`!r 3p6! #to hit, 1d8+4 #damage`*: freely mix dice types and rules - exploding d6 pools for hit and d8s with modifier for damage? no problem!

Setup
-----

Clattr is currently in testing and you probably shouldn't even be reading this. You can't install the "official" version because it's not hosted online. You'll have
to run it on your own computer for now, or know someone who does. Will set up a server after completing the rest of its needed features.

1) download the source code: `git clone https://github.com/nphyx/clattr-bot`
2) change to the clattr-bot directory: `cd clattr-bot`
3) install packages: `npm install .`
4) follow standard Discord bot setup procedure [https://discordjs.guide/#/preparations/setting-up-a-bot-application]
5) get your bot token (use the guide above, and note that Clattr requires the 'manage messages' permission)
6) run the bot, in Linux: `export DISCORD_TOKEN=<your bot token> && node index.js`
7) start playing!

License
-------
GPL 3.0 - see LICENSE.txt

Yes you're welcome to clone this, modify it, contribute changes, etc. If you're a random passer-by. If you choose to contribute, please write unit tests. Also, sorry for the mess, it's a WIP.
