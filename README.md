# LoLChampStats

## Summary

This is a basic Web Data Connector for use with Tableau Public that connects to Riot Games' Data Dragon API. It returns static League of Legends champion data for all champions, for the patch version(s) specified.

Currently includes the following base champion statistics...

- Champion Id
- Champion Name
- Par Type
- Role 1
- Role 2
- Armor
- Armor per Level
- Attack Damage
- Attack Damage per Level
- Attack Range
- Attack Speed Offset
- Attack Spped per Level
- Critical Strike
- Critical Strike per Level
- Health
- Health per Level
- Health Regen
- Health Regen per Level
- Movement Speed
- Mana Pool
- Mana Pool per Level
- Mana Pool Regen
- Mana Pool Regen per Level
- Magic Resist
- Magic Resist per Level

## Development Server

* make sure you have nodejs installed on your machine
* run `npm install` in the directory to have express installed
* run `npm run start` to start the express server
* navigate to http://localhost:8080

## References

[Tableau Public](https://public.tableau.com/en-us/s/)

[Tableau Public - Web Data Connector](http://tableau.github.io/webdataconnector/)

[Riot Games - League of Legends](http://na.leagueoflegends.com)

[Riot Games - Data Dragon](https://developer.riotgames.com/static-data.html)
