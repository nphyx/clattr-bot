Clattr Bot
[![Build Status](https://travis-ci.org/nphyx/clattr-bot.svg?branch=master)](https://travis-ci.org/nphyx/clattr-bot)
[![Coverage Status](https://coveralls.io/repos/github/nphyx/clattr-bot/badge.svg?branch=master)](https://coveralls.io/github/nphyx/clattr-bot?branch=master)
==========

An experimental dice bot for Discord.

Features
--------

**Multiple Rolls**: [make multiple rolls on a single line](#multiple-rolls), separated by a comma

**Math**: [add, subtract, multiply and divide dice results and modifiers](#using-math-operators)

**Tag Your Rolls**: [label your rolls with tags](#tagging-rolls), so the results will be marked

**Keeping & Discarding Rolls**: [roll multiple dice and keep the lowest or highest](#special-rules)

**Exploding Dice**: with optional target numbers for [explosions](#special-rules)

**Wild Dice**: supports Savage Worlds-style wild dice natively

**Dice Pools**: Clattr supports game systems that use dice pools with target numbers

**Fate Dice**: You can use fate dice too

**Cleans Up its Mess**: Clattr removes your roll message and tags you with the result - clattr, but no cluttr!

**Nicely Formatted**: Clattr puts its results first, roll details later for easy reading 

**Better Randomness**: Clattr will give more 'random-feeling' results than some dice rollers, no streaks or runs (it uses the mersenne-twister PRNG algorithm, if you're curious)

**Playing Cards**: fully simulated playing card decks, for use in Savage Worlds initiative, your Deck of Many Things, or any other card-based game mechanic

Supported Games
---------------

**D20/D&D**: dice rolls, modifiers, rolling with advantage and disadvantage - everything you need for 2nd - 5th edition, Pathfinder, and other D20 games

**WoD, nWoD, Exalted**: and other Storyteller-based games, with clean easy syntax

**Shadowrun**: supports exploding dice

**Fate**: has special rules for fate dice

**Savage Worlds**: wild dice and playing card support, plus all the other dice features

**Almost Everything Else**: but if you can't use it with your favorite game, or it's kinda clunky, [let me know](https://github.com/nphyx/clattr-bot/issues)

Quick Examples:
---------------

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
| `:r w8+2`        | roll a d8 with a d4 wild die, add 2 to the greater of the two |
| `:c 2`           | draw 2 cards from the guild deck |
| `:c 2 foo`       | draw 2 cards from the deck named 'foo' |
| `:c shuffle`     | shuffle the guild deck |
| `:c shuffle foo` | shuffle the guild deck |
| `:c list`        | list all decks in play |
| `:c remove foo`  | remove the deck named 'foo' from play |

Check out the [wiki](https://github.com/nphyx/clattr-bot/wiki) for full documentation, and the [examples section](https://github.com/nphyx/clattr-bot/wiki#examples-by-game-system) for more usage examples.

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

License
-------

GPL 3.0 - see LICENSE.txt

Yes you're welcome to clone this, modify it, contribute changes, etc. If you're a random passer-by. If you choose to contribute, please write unit tests. Also, sorry for the mess, it's a WIP.
