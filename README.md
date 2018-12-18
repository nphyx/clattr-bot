Clattr Bot
==========

An experimental dice bot for Discord.

Features
--------

**Multiple Rolls**: [make multiple rolls on a single line](#multiple-rolls), separated by a comma

**Math**: [add, subtract, multiply and divide dice results and modifiers](#using-math-operators)

**Tag Your Rolls**: [label your rolls with tags](#tagging-rolls], so the results will be marked

**Keeping & Discarding Rolls**: [roll multiple dice and keep the lowest or highest](#special-rules)

**Exploding Dice**: with optional target numbers for [explosions](#special-rules)

**Dice Pools**: Clattr supports game systems that use dice pools with target numbers

**Fate Dice**: You can use fate dice too

**Cleans Up its Mess**: Clattr removes your roll message and tags you with the result - clattr, but no cluttr!

**Nicely Formatted**: Clattr puts its results first, roll details later for easy reading 

**Better Randomness**: Clattr will give more 'random-feeling' results than some dice rollers, no streaks or runs (it uses the mersenne-twister PRNG algorithm, if you're curious)

Table of Contents
-----------------

1) [Supported Games](#supported-games)
2) [Bot Commands](#bot-commands)
3) [Examples by Game System](#examples-by-game-system)
  - [D20](#dd-3rd-5th-edition-d20-system-pathfinder)
  - [Storyteller](#storyteller)
  - [Shadowrun](#shadowrun)
  - [Fate](#fate)
4) [Syntax](#roll-syntax)
  - [Target Numbers](#target-numbers)
  - [Math](#using-math-operators)
  - [Special Rules](#special-rules)
  - [Combining Rules](#combining-rules)
  - [Multiple Rolls](#multiple rolls)
  - [Tagging Rolls](#tagging-rolls)
  - [Syntax Breakdown](#syntax-breakdown)
5) [Setup](#setup)
5) [Roadmap](#roadmap)
5) [License & Contributing](#license)

Supported Games
---------------

**D20/D&D**: dice rolls, modifiers, rolling with advantage and disadvantage - everything you need for 2nd - 5th edition, Pathfinder, and other D20 games

**WoD, nWoD, Exalted**: and other Storyteller-based games, with clean easy syntax

**Shadowrun**: supports exploding dice

**Fate**: has special rules for fate dice

**Almost Everything Else**: but if you can't use it with your favorite game, or it's kinda clunky, [let me know](https://github.com/nphyx/clattr-bot/issues)

Bot Commands
------------

Every roll starts with `:r` followed by a space - that tells the bot to pay attention and read the rest of the line. It will ignore any other messages. You can use the `:r` command in any channel where Clattr is active. When it finishes calculating your roll it will @you with the result and delete your original message, keeping things tidy.

You can also use Clattr via DM if you need to roll privately; just open a DM channel with it. It is not allowed to delete your original command in DM.

### Quick Examples:

| Example          | result |
|------------------|--------|
| `:r d20 #hit`    | roll 1d20, with the tag 'hit' |
| `:r 2d20k1+3`    | roll 2 d20s, keep the highest, and add 3 |
| `:r 4d20l2-1`    | roll 4 d20s, keep the lowest 2, and subtract 3 |
| `:r 3d6!`        | roll 3 exploding d6s |
| `:r 3d6!5`       | roll 3 exploding d6s that explode on 5 or 6 |
| `:r 3d6!m1`      | roll 3 exploding d6s, but they only explode once |
| `:r 3d6!5m1`     | roll 3 exploding d6s that explode once on 5 or 6 |
| `:r 3d6!5m1k2`   | roll 3 exploding d6s that explode once on 5 or 6, keep the highest 2 |
| `:r 3p6t4`       | roll a pool of 3d6, counting 4 or higher as a hit |
| `:r 3p6t4!`      | roll a pool of 3d6, counting 4 or higher as a hit, exploding on 6 |
| `:r 4f+3`        | roll 4 fate dice, add 3 to the result |


Examples by Game System
-----------------------

### D&D (3rd-5th edition), D20 System, Pathfinder

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

### Storyteller

Use `p` type (pool) dice. Pool dice default to d10s, so when playing storyteller you don't need to specify the die size.

| Example                                     | description |
|---------------------------------------------|-------------|
| `:r 5p`                                     | roll a pool of 10-sided dice with a target of 8-10  |
| `:r 5pt7`                                    | roll a pool of 10-sided dice with a target of 7-10, if you're special  |

### Shadowrun

You'll have to specify p6 for your shadowrun dice, but you can make them explode!

| Example                                     | description |
|---------------------------------------------|-------------|
| `:r 3p6! #firearms`                         | roll a pool of three 6-sided exploding dice  |

### Fate

Fate dice (type `f`) default to a pool of 4, so you can omit the dice count usually. Clattr will display them as `+`, `-`, and ` ` in the results.

| Example                                     | description |
|---------------------------------------------|-------------|
| `:r f+3 #athletics`                         | do an athletics check  |
| `:r 6f+3 #extra dice`                       | if you need to roll more than 4 fate dice, you can do that  |


Roll Syntax
-----------

When rolling, you can polyhedral dice (`d`), dice pools (`p`), or fate dice (`f`). You can also use plain numbers (for modifiers and other math).

The format for dice `<number of dice><die type><die size><special modifiers>`. so:

| roll      | result                                           |
|-----------|--------------------------------------------------|
| `:r 1d20` | `@you rolled 12  :::  (1d20 [12] = 12)`          |
| `:r 4p10` | `@you rolled 2  :::  (4p10 [1,10,6,8] = 2)`      |
| `:r 4f`   | `@you rolled 1  :::  (4f [[+],[+],[ ],[-]] = 1)` |
| `:r 10`   | `@you rolled 10  :::  (10)`                      |


### Target Numbers

Dice pools support target numbers:

| roll        | result                                           |
|-------------|--------------------------------------------------|
| `:r 5p10t7` | `@you rolled 3  :::  (5p10t7 [10,2,7,4,9] = 3)`  |

### Using math operators

Adding (`+`), subtracting (`+`), multiplying (`*`) and dividing (`/`) are easy:

| roll        | result                                           |
|-------------|--------------------------------------------------|
| `:r 1d20+7` | `@you rolled 22  :::  (1d20 [15] + 7 = 22)`      |
| `:r 1d20-2` | `@you rolled 3  :::  (1d20 [5] - 2 = 3)`         |
| `:r 1d20*2` | `@you rolled 22  :::  (1d20 [11] * 2 = 22)`      |
| `:r 1d20/2` | `@you rolled 9.5  :::  (1d20 [19] / 2 = 9.5)`    |

You can also use math on dice rolls:

| roll          | result                                                 |
|---------------|--------------------------------------------------------|
| `:r 1d6+1d4`  | `@you rolled 4  :::  (1d6 [3] + 1d4 [1] = 4)`          |
| `:r 3p10+4p6` | `@you rolled 3  :::  (3p10 [3,5,8] + 4p6 [3,6,6] = 3)` |

Math operations are simple left-to-right order, so if you do `3+4*2+3` you'll get `3+4=7 -> 7*2=14 -> 14+3=17`

### Special Rules

You can use keep-the-highest (`k`), keep-the-lowest (`l`), and explode (`!`) dice.

| roll          | result                                      |
|---------------|---------------------------------------------|
| `:r 2d20k1`   | `@you rolled 16  :::  (2d20k1 [3,16] = 16)` |
| `:r 2d20l1`   | `@you rolled 5  :::  (2d20l1 [5,19] = 5)`   |
| `:r 1d20!`    | `@you rolled 23  :::  (1d20! [20,3] = 23)`  |

You can set a target and maximum for exploding dice:

| roll            | result                                          |
|-----------------|-------------------------------------------------|
| `:r 1d20!19`    | `@you rolled 43 ::: (1d20!19 [20,19,4] = 43)`   |
| `:r 1d20!19m1`  | `@you rolled 39  :::  (1d20!19m1 [20,19] = 39)` |

The maximum number of explosions for a single die is 5. This is to stop clever and crazy people from crashing the bot with infinite `1d1` explosions, sorry :)

For keeping the lowest / highest dice, you can keep more than one:

| roll         | result                                          |
|--------------|-------------------------------------------------|
| `:r 3d20k2`  | `@you rolled 22  :::  (3p20k2 [5,10,12] = 22)`  |
| `:r 3p20l2`  | `@you rolled 14  :::  (3p20l2 [8,6,12] = 14)`   |

### Combining Rules

Special rules can be combined, and are executed in order.

| roll         | result                                          |
|--------------|-------------------------------------------------|
| `:r 1d20!l1` | `@you rolled 8  :::  (1d20!l1 [20,8] = 8)`      |

### Two Rolls, One Line

You can make separate rolls in a single command and display the results individually.

| roll               | result                                                           |
|--------------------|------------------------------------------------------------------|
| `:r 1d20+7, 1d6+1` | `@you rolled 12, 4  :::  (1d20 [5] + 7 = 12), (1d6 [3] + 1 = 4)` |

### Tagging Rolls

Add a tag to label your rolls using `#`

| roll                | result                                              |
|---------------------|-----------------------------------------------------|
| `:r 1d20+7 #to hit` | `@you rolled to hit: 17  :::  (1d20 [10] + 7 = 17)` |

You can tag each roll in a multi-roll command:

| roll                               | result                                                                            |
|------------------------------------|-----------------------------------------------------------------------------------|
| `:r 1d20+7 #to hit, 1d6+1 #damage` | `@you rolled to hit: 17, damage: 4  :::  (1d20 [10] + 7 = 17), (1d6 [3] + 1 = 4)` |

### Full Breakdown
------------------

|             | count | type  |  size | target | rule        | tag      | result |
|-------------|-------|-------|-------|--------|-------------|----------|--------|
|  accepts    | [int] | d,p,f | [int] | t[int] | !,k,l[int]  | +/-[int] |        |
| **Examples**|       |       |       |        |             |          |        |
| `3d6`       | 3     | d     | 6     |        | !           |          | roll 3 d6 and sum the result |
| `1d20 #hit` | 1     | d     | 20    |        |             | hit      | roll 1d20, with the tag 'hit' |
| `2d20k1`    | 2     | d     | 20    |        | k1          |          | roll 2 d20s, keep the highest |
| `4d20l2`    | 2     | d     | 20    |        | l2          |          | roll 2 d20s, keep the lowest 2 |
| `3d`        | 3     | d     | [6]   |        |             |          | roll 3 dice (defaulting to d6) |
| `3d6!`      | 3     | d     | 6     |        | !           |          | roll 3 exploding d6s |
| `3d6!5`     | 3     | d     | 6     |        | !5          |          | roll 3 exploding d6s that explode on 5 or 6 |
| `3d6!m1`    | 3     | d     | 6     |        | !m1         |          | roll 3 exploding d6s, but they only explode once |
| `3d6!5m1`   | 3     | d     | 6     |        | !5m1        |          | roll 3 exploding d6s that explode once on 5 or 6 |
| `3d6!5m1k2` | 3     | d     | 6     |        | !5m1k2      |          | roll 3 exploding d6s that explode once on 5 or 6, keep the highest 2 |
| `3p6t4`     | 3     | p     | 6     | t4     |             |          | roll a pool of 3d6, counting 4 or higher as a hit |
| `3p6`       | 3     | p     | 6     | [4]    |             |          | roll a pool of 3d6 (defaulting to target of 4-6) |
| `3p`        | 3     | p     | [10]  | [8]    |             |          | roll a pool of 3 dice (defaulting to d10, target of 8-10) |
| `3p6t4!`    | 3     | p     | 6     | t4     | !           |          | roll a pool of 3d6, counting 4 or higher as a hit, exploding on 6 |
| `4f`        | 4     | f     | [3]   |        |             |          | roll 4 fate dice |
| `f`         | [4]   | f     | [3]   |        |             |          | roll fate dice, defaulting to 4 dice |

|            | required  | value            | description |
|------------|-----------|------------------|-------------|
| count      | no        | 1-30             | the number of dice to roll. polyhedral and pool dice (`d`, `p`) default to 1 die, fate (`f`) default to 4. |
| type       | yes       | `d`, `p`, or `f` | roll as individual dice and add their values (`d`), as a pool and count the hits (`p`), or roll fate dice (`f`) |
| size       | no        | 1-100            | the size of the die to roll - defaults to 6 for type `d`, 10 for type `p`, and 3 for fate (displayed as '+', ' ', and '-') |
| target     | sometimes | any whole number | the target number to count as a hit, defaulting to roughly the top 1/4th to 1/3rd of the die size |
| rule       | no        | `!`, `k`, or `l` | special rules for how the dice should be handled - exploding (`!`), keep the highest (`1`), keep the lowest (`1) |
| rule value | no        | any whole number | for exploding dice, any die equal or higher than this will explode, for keep lower/higher, the number of dice to keep |
| max        | no        | `m`, 1-5         | for exploding dice, the number of times a die can explode (default 5, and can't be set higher than 5) | 
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
6) copy .env.example to .env and fill out the environment variables
7) run the bot, in Linux: `npm start`
8) start playing!

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
