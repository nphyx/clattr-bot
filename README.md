Clattr Bot
==========

An experimental dice bot for discord.

Features
--------

- **Multiple Rolls**: make multiple rolls on a single line, separated by a comma
- **Math**: add, subtract, multiply and divide dice results and modifiers
- **Tag Your Rolls**: label your rolls with tags, so the results will be marked
- **Keeping & Discarding Rolls**: roll multiple dice and keep the lowest or highest
- **Exploding Dice**: with optional target numbers for explosions
- **Dice Pools**: Clattr supports game systems that use dice pools with target numbers
- **Fate Dice**: You can use fate dice too
- **Cleans Up its Mess**: Clattr removes your roll message and tags you with the result - clattr, but no cluttr!
- **Nicely Formatted**: Clattr puts its results first, roll details later for easy reading 
- **Better Randomness**: Clattr will give more 'random-feeling' results than some dice rollers, no streaks or runs (it uses the mersenne-twister PRNG algorithm, if you're curious)

Supported Games
---------------

- **D&D**: dice rolls, modifiers, rolling with advantage and disadvantage - everything you need for 2nd - 5th edition!
- **WoD, nWoD, Exalted**: and other Storyteller-based games, with clean easy syntax
- **Shadowrun**: supports exploding dice
- **Fate**: has special rules for fate dice
- **Almost Everything Else**: but if you can't use it with your favorite game, or it's kinda clunky, [let me know](https://github.com/nphyx/clattr-bot/issues)

Using the bot
-------------

Every roll starts with `:r` followed by a space - that tells the bot to pay attention and read the rest of the line. It will ignore any other messages.

### Basic Rolls
When rolling, you can polyhedral dice (`d`), dice pools (`p`), or fate dice (`f`). You can also use plain numbers (for modifiers and other math).

The format for dice `<number of dice><die type><die size><special modifiers>`. so:

- `:r 1d20` rolls one 20-sided die
- `:r 4p10` rolls a pool of four 10-sided dice
- `:r 4f` rolls four fate dice
- `:r 10` is the number ten


### Target Numbers

Dice pools support target numbers:

- `:r 5p10t7` roll a pool of five 10-sided dice, and score a hit for each roll above 7

### Using math operators

Adding (`+`), subtracting (`+`), multiplying (`*`) and dividing (`/`) are easy:

- `:r 1d20+7` subtracts 2 from the result of the d20 roll
- `:r 1d20-2` subtracts 2 from the result
- `:r 1d20*2` multiplies the result by 2
- `:r 1d20/2` divides the result by 2

You can also use math on dice:

- `:r 1d6+1d4` adds the result of a d6 and a d4
- `:r 3p10+4p6` adds the hits from two pools of three 10-sided dice and four 6-sided dice

Math operations are simple left-to-right order, so if you do `3+4*2+3` you'll get `3+4=7 -> 7*2=14 -> 14+3=17`

### Special Rules

You can use keep-the-highest (`k`), keep-the-lowest (`l`), and explode (`!`) dice.

- `:r 2d20k1` rolls 2 20-sided dice and keeps the highest
- `:r 2d20l1` rolls 2 20-sided dice and keeps the lowest
- `:r 1d20!` rolls a 20-sided die that explodes on 20

You can set a target and maximum for exploding dice:

- `:r 1d20!19` a d20 that explodes on 19-20
- `:r 1d20!19m1` a d20 that explodes on 19-20, and will only reroll once (max=1)

The maximum number of explosions for a single die is 5. This is to stop clever and crazy people from crashing the bot with infinite `1d1` explosions, sorry :)

For keeping the lowest / highest dice, you can keep more than one:

- `:r 3d20k2` keeps the highest two of three d20s and adds the result together
- `:r 3p20l2` keeps the lowest two of three d20s and adds the result together

Rules can be combined:

- `:r 1d20!k1` rolls a 20-sided die, explodes on 20, and keeps the highest (critical hits!)

### Two Rolls, One Line

You can make separate rolls in a single command and display the results individually.

- `:r 1d20+7, 1d6+1` will display the d20 roll and d6 roll as separate results

### Tagging Rolls

You can add a tag to label your rolls using `#`

- `:r 1d20+7 #to hit` will tag the result with "to hit", like so: `to hit: 17  :::  (1d20 [10] + 7 = 17)`

Naturally you can tag each roll in a multi-roll command:

- `:r 1d20+7 #to hit, 1d6+1 #damage` : `to hit: 17, damage: 4  :::  (1d20 [10] + 7 = 17), (1d6 [3] + 1 = 4)`

More Examples
-------------

### Basic examples:

| Example          | result |
|------------------|--------|
| `:r d20 #hit`    | roll 1d20, with the tag 'hit' |
| `:r 2d20k1+3`    | roll 2 d20s, keep the highest, and add 3 |
| `:r 4d20l2-1`    | roll 2 d20s, keep the lowest 2, and subtract 3 |
| `:r 3d6!`        | roll 3 exploding d6s |
| `:r 3d6!5`       | roll 3 exploding d6s that explode on 5 or 6 |
| `:r 3d6!m1`      | roll 3 exploding d6s, but they only explode once |
| `:r 3d6!5m1`     | roll 3 exploding d6s that explode once on 5 or 6 |
| `:r 3d6!5m1k2`   | roll 3 exploding d6s that explode once on 5 or 6, keep the highest 2 |
| `:r 3p6t4`       | roll a pool of 3d6, counting 4 or higher as a hit |
| `:r 3p6t4!`      | roll a pool of 3d6, counting 4 or higher as a hit, exploding on 6 |
| `:r 4f+3`        | roll 4 fate dice, add 3 to the result |

### For D&D 5th Edition:

Use `d` type (polyhedral) dice.

| Example                                     | description |
|---------------------------------------------|-------------|
| `:r d20+7 #persuasion`                      | roll a persuasion check |
| `:r 8d6 #fireball`                          | roll damage for a fireball |
| `:r 2d20k1+7 #hit, 1d4+3d6+4 #sneak attack` | roll to hit with advantage + sneak attack damage |
| `:r d4+1 #1, 1d4+1 #2, 1d4+1 #3`            | roll magic missile with individual targets | 
| `:r 2d20l1-1 #con save`                     | roll a constitution save with disadvantage | 
| `:r d20+7+d4 #blessed :)`                   | roll under the effects of bless | 
| `:r d20+7-d4 #bane :(`                      | roll under the effects of bane | 
| `:r d20!l1 #hit`                            | roll 1d20 with critical hit support (keeping the second result on a 20), for 2nd/3rd Edition & Pathfinder |
| `:r d20!18l1 #hit`                          | roll 1d20 that crits on 18-20, clever girl |

### For Storyteller:

Use `p` type (pool) dice. Pool dice default to d10s, so when playing storyteller you don't need to specify the die size.

| Example                                     | description |
|---------------------------------------------|-------------|
| `:r 5p`                                     | roll a pool of 10-sided dice with a target of 8-10  |
| `:r 5p7`                                    | roll a pool of 10-sided dice with a target of 7-10, if you're special  |

### For Shadowrun

You'll have to specify p6 for your shadowrun dice, but you can make them explode!

| Example                                     | description |
|---------------------------------------------|-------------|
| `:r 3p6! #firearms`                         | roll a pool of three 6-sided exploding dice  |

### For Fate

Fate dice (type `f`) default to a pool of 4, so you can omit the dice count usually. Clattr will display them as `+`, `-`, and ` ` in the results.

| Example                                     | description |
|---------------------------------------------|-------------|
| `:r f+3 #athletics`                         | do an athletics check  |
| `:r 6f+3 #extra dice`                       | if you need to roll more than 4 fate dice, you can do that  |

Nerdy Details
-------------

Here's a full breakdown of a single dice roll, with some examples:

|             | count | type  |  size | target | rule        | mod    | tag      | result |
|-------------|-------|-------|-------|--------|-------------|--------|----------|--------|
|  accepts    | [int] | d,p,f | [int] | t[int] | !,k,l[int]  | m[int] | +/-[int] |        |
| **Examples**|       |       |       |        |             |        |          |        |
| `1d20 #hit` | 1     | d     | 20    |        |             |        | hit      | roll 1d20, with the tag 'hit' |
| `2d20k1+3`  | 2     | d     | 20    |        | k1          | +3     |          | roll 2 d20s, keep the highest, and add 3 |
| `4d20l2-1`  | 2     | d     | 20    |        | k2          | -3     |          | roll 2 d20s, keep the lowest 2, and subtract 3 |
| `3d6!`      | 3     | d     | 6     |        | !           |        |          | roll 3 exploding d6s |
| `3d6!5`     | 3     | d     | 6     |        | !5          | m1     |          | roll 3 exploding d6s that explode on 5 or 6 |
| `3d6!m1`    | 3     | d     | 6     |        | !           | m1     |          | roll 3 exploding d6s, but they only explode once |
| `3d6!5m1`   | 3     | d     | 6     |        | !5          | m1     |          | roll 3 exploding d6s that explode once on 5 or 6 |
| `3d6!5m1k2` | 3     | d     | 6     |        | !5m1k2      | m1     |          | roll 3 exploding d6s that explode once on 5 or 6, keep the highest 2 |
| `3p6t4`     | 3     | p     | 6     | t4     |             |        |          | roll a pool of 3d6, counting 4 or higher as a hit |
| `3p6t4!`    | 3     | p     | 6     | t4     | !           |        |          | roll a pool of 3d6, counting 4 or higher as a hit, exploding on 6 |
| `4f+3`      | 4     | f     | 3     |        |             |        | +3       | roll 4 fate dice, add 3 to the result |

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

Roadmap
-------

- *playing card decks*: main code is already written for basic playing card decks, just need to finish formatting rules
- *other cards*: a lot of the playing cards code is reusable, but need to create lists of face cards, suits, etc.
- *coin tosses*: same as cards, just needs to be formatted
- *help command*: display help & examples in game (later)
- *saving rolls for reuse*: planned, but needs lots of work

License
-------

GPL 3.0 - see LICENSE.txt

Yes you're welcome to clone this, modify it, contribute changes, etc. If you're a random passer-by. If you choose to contribute, please write unit tests. Also, sorry for the mess, it's a WIP.
