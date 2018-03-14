To add a new localization:

* Fork the repo
* Create a new file in "localization" folder, name it as [language name].ts, for example: french.ts
* Copy the content from english.ts file and uncomment first and two last lines
* Translate strings
* Import this file into webpack by adding it into "entries/chunks/localization.ts" file, import "../../localization/[yourfilename]";, for example import import "../../localization/french";
* Rebuild the library, based on instruction in the readme.md file in the root
* Optionally make a pull request to share your translation with the community and to include into official library release
