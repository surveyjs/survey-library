## To add a new localization:

* Fork the repo
* Create a new file in "localization" folder, name it as [language name].ts, for example: french.ts
* Copy the content from english.ts file and uncomment first and two last lines
* Translate strings
* Import this file into webpack by adding it into "entries/chunks/localization.ts" file, import "../../localization/[yourfilename]";, for example import import "../../localization/french";
* Rebuild the library, based on instruction in the readme.md file in the root and / or
* Optionally make a pull request to share your translation with the community and to include into official library release. We will rebuild the library and you will get your localization with the next minor update

## To update the existing localization:

* Fork the repo
* Find the required localization file [language name].ts, for example: french.ts
* Translate the missing strings that exists in english.ts file, but not in your [language name].ts file
* Rebuild the library, based on instruction in the readme.md file in the root and / or
* Optionally make a pull request to share your translation with the community. We will rebuild the library and you will get your localization with the next minor update
