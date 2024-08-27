# AutoScroll 2.0

This is a fork of the [AutoScroll chrome extension](https://github.com/Pauan/AutoScroll). I've been using this plugin on my Mac for middle click scroll for a while now. Since the original extension didn't have updates for 6 years i decided to fork it and update the code so it's compliant with Manifest version 3. This way there is alternative once the original gets removed. See [Manifest V2 support timeline](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline).

## Updates from the original version

- Updated manifest.json to version 3
  - Changed "manifest_version" from 2 to 3
  - Replaced "background.scripts" with "background.service_worker"
  - Updated "web_accessible_resources" format
  - Removed "persistent" flag from background
  - Updated minimum_chrome_version to 88

### Updated

- main.js (background script)
  - Replaced direct code execution with chrome.runtime.onInstalled listener
  - Updated localStorage operations to run only on installation
    E
- src/data/AutoScroll.js

  - Replaced callback-based chrome.storage.local.get with Promise-based version
  - Updated chrome.storage.onChanged listener to use more modern JavaScript syntax

- src/data/options.js
  - Updated getOpts function to use Promise-based chrome.storage.local.get
  - Refactored chrome.storage.onChanged listener to use more modern JavaScript syntax
  - Updated chrome.storage.local.set to use object property shorthand

### Removed

- Removed "all_frames" property from content_scripts in manifest.json as it's no longer needed

### Note

- All instances of callback-based chrome.storage.local.get have been replaced with Promise-based versions throughout the codebase
