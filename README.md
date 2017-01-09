#Chrome extension for NextCloud Bookmarks

This is a Chrome Extension for [NextCloud Bookmarks](https://github.com/nextcloud/bookmarks), a very popular bookmark application for NextCloud. It allows you to add, search and delete your NextCloud Bookmarks. 

This extension does not synchronize your Chrome Bookmarks with NextCloud Bookmarks and it will never perform any kind of synchronization between the browser and NextCloud.

_Note: this extension doesn't work on OwnCloud but you can fork this repo and modify the code accordingly_

## Available features

* it adds new bookmarks
* it lists latest bookmarks
* it searches and shows bookmarks by tag or by a tag combination (like 'tag1 AND tag2 AND tag3' and 'tag1 OR tag2 OR tag3')
* it deletes a bookmark

## Missing features

* it can not search a bookmark starting from a URL (API lacks the method)
* it can not edit a bookmark
* a translation (localization) system
* translations

## Disclaimer

This extension, due to its early stage, is **not ready for production**. It works but it's unsecure.

However you can still use it if you match **all** these requirements:

* you connect to your NextCloud server through a private VPN or your NextCloud server runs in your LAN
* you can connect to your NextCloud server with the HTTP protocol
* you are ready to tweak a little your NextCloud Bookmarks app
* you don't mind having this extension's credentials stored in clear text in your browser

## Screenshots

![chrome_options](https://github.com/damko/nextcloud_bookmarks_chrome/blob/master/screenshots/screenshot-nextcloud_bookmarks_chrome-chrome_options.jpg)

![add_bookmark](https://github.com/damko/nextcloud_bookmarks_chrome/blob/master/screenshots/screenshot-nextcloud_bookmarks_chrome-add_bookmark.jpg)

![save_bookmark](https://github.com/damko/nextcloud_bookmarks_chrome/blob/master/screenshots/screenshot-nextcloud_bookmarks_chrome-save_bookmark.png.jpg)

![search_by_tag](https://github.com/damko/nextcloud_bookmarks_chrome/blob/master/screenshots/screenshot-nextcloud_bookmarks_chrome-search_by_tag.jpg)

![search_by_tags_AND](https://github.com/damko/nextcloud_bookmarks_chrome/blob/master/screenshots/screenshot-nextcloud_bookmarks_chrome-search_by_tags_AND.jpg)

![search_by_tags_OR](https://github.com/damko/nextcloud_bookmarks_chrome/blob/master/screenshots/screenshot-nextcloud_bookmarks_chrome-search_by_tags_OR.jpg)

## Help needed

I'd love to have any kind of feedback on this extension.

If you are a developer have a look at the code and please open issues or send greatly appreciated PRs.

If you are not a developer please open issues and tell me what's not working for you.

Thank you!

## Installation

### Server side

The NextCloud Bookmarks API is very young and there are some things still to figure out therefore, to make this extension work, you need to temporary replace the official Bookmarks app with my version.

	cd /var/www/nextcloud/apps
	mv bookmarks bookmarks_ori
	git clone git@github.com:damko/bookmarks.git

Anyway, no worries, this is a **temporary thing**. I'm sending PRs hoping that they will be accepted and, in any case, I will change my extension code in order to work with the official Bookmarks app. Once things will sattle down, you will be able to use the discard my Bookmarks repo and use the official app package.

### Client side

On your pc, followe these step:

* clone this extension repository:

	git clone git@github.com:damko/nextcloud_bookmarks_chrome.git

* open Chrome and paste this `chrome://extensions/` in the URL bar

* click on the `Developer mode` checkbox if it's not yet checked

* click on `Load unpacked extension` and select the `nextcloud_bookmarks_chrome` directory

* click `Open`

The Nextcloud-Bookmarks extension will then appear among the other installed Chrome extensions.

Now click on Nextcloud-Bookmarks `Options` link and fill in the form with:

* URL of your NextCloud server
* NextCloud username
* NextCloud password
