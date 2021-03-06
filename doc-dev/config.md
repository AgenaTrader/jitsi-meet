Jitsi Configuration
===================

TODO:
    - split interface config to a separate file or a different section; it's similar, but different.

Introduction
------------

Jitsi configuration can be found in `config.js` file.

For Choop we have a different file named `default-config.js` that will be copied as **the** config of our Jitsi installation.

Interface config is located in `interface_config.js`.

How config values are loaded?
-----------------------------

Nginx config has an alias for `/config.js` that points to `$domain-config.js`.

`react/features/base/config`

`appNavigate -> setConfig -> setConfigFromURLParams -> SET_CONFIG`

During navigation with `appNavigate` the `setConfig` action is dispatched.
The `setConfig` is actually returning another dispatcher.

With the help of `setConfigFromURLParams`, the `config` values are merged from multiple sources.

A new `config` object is used with `SET_CONFIG` action.

A reducer method `_setConfig` moves the config values to `features/base/config` state.

Interface config is loaded as a global variable.

How to read config values?
-----------------------------------------------

For `config.js` you access the Redux store state.

```js
getState()['features/base/config']
```

For `interface_config.js` you use global `interfaceConfig` variable.

```js
// file: react/features/recent-list/functions.web.js
export function isRecentListEnabled() {
    return interfaceConfig.RECENT_LIST_ENABLED;
}
```

How to add new config values?
-----------------------------

### Different Config Files

Just add config values to either `config.js` or `interface_config.js`.

The `interface_config.js` is used to control visibility and behavior of UI elements. It focuses on the frontend.
E.g. hide a pre-join page, hide buttons, change colors, hide invitation popup, etc.

The `config.js` is a more generic configuration file. Some of its values are passed to the core `lib-jitsi-meet` library.
You should use this file for a config that is supposed to control the overall behavior of the app.
E.g. change BOSH endpoint, start with audio/video muted, disable p2p, adjust preferred resolution, etc.


### Config Whitelist

When config is loaded from different sources, the config keys are validated against a whitelist using `_getWhitelistedJSON`.

For `interface_config.js` it's `react/features/base/config/interfaceConfigWhitelist.js`.

For `config.js` it's `react/features/base/config/configWhitelist.js`

You can **add custom item** to the whitelist of `config.js` using `react/features/base/config/extraConfigWhitelist.js`.


Config with URL - external config override
------------------------------------------

It is possible to override config via URL hash, e.g.

```https://choop.chat/group-240#config.startWithAudioMuted=true&config.choop.opMode="edu"```

You can pass key-value paris in the URL hash, but the values must be JSON encoded.

### Where do we override config?

Config can be overridden by TY/EduPortle. We are passing `startArgs` when opening meeting window.

The `startArgs` are simply a Query String part of the TY/EduPortle URL. For e.g.

```https://tradersyard.com/meeting/join/group-342?startArgs=config.startWithAudioMuted=true```

This is then passed as na argument to Token Issuer,

```
https://choop.chat/joinRoom?roomName=group-342&tyEnv=DEV&tyToken=TY_TOKEN_VALUE&startArgs=config.startWithAudioMuted=true
```

.. which returns the actual join url for the conference with JWT token.

If no `startArgs` are passed to Token Issuer, a set of default config overrides will be provided.
