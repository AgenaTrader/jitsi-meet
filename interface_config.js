/* eslint-disable no-unused-vars, no-var, max-len */
/* eslint sort-keys: ["error", "asc", {"caseSensitive": false}] */

var interfaceConfig = {

    CHOOP: {
        SHOW_CALL_BUTTON: true,
    },

    APP_NAME: 'Choop Chat',
    AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
    AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',

    /**
     * Show coming soon page besides welcome page.
     */
    COMING_SOON_ENABLED: false,

    /**
     * If we should show authentication block in profile
     */
    AUTHENTICATION_ENABLE: true,

    /**
     * Disable notification about rights granted.
     */
    DISABLE_RIGHTS_GRANTED_NOTIFICATIONS: true,

    /**
     * A UX mode where the last screen share participant is automatically
     * pinned. Valid values are the string "remote-only" so remote participants
     * get pinned but not local, otherwise any truthy value for all participants,
     * and any falsy value to disable the feature.
     *
     * Note: this mode is experimental and subject to breakage.
     */
    AUTO_PIN_LATEST_SCREEN_SHARE: false, // 'remote-only',
    BRAND_WATERMARK_LINK: '',

    CLOSE_PAGE_GUEST_HINT: false, // A html text to be shown to guests on the close page, false disables it
    /**
     * Whether the connection indicator icon should hide itself based on
     * connection strength. If true, the connection indicator will remain
     * displayed while the participant has a weak connection and will hide
     * itself after the CONNECTION_INDICATOR_HIDE_TIMEOUT when the connection is
     * strong.
     *
     * @type {boolean}
     */
    CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,

    /**
     * How long the connection indicator should remain displayed before hiding.
     * Used in conjunction with CONNECTION_INDICATOR_AUTOHIDE_ENABLED.
     *
     * @type {number}
     */
    CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,

    /**
     * If true, hides the connection indicators completely.
     *
     * @type {boolean}
     */
    CONNECTION_INDICATOR_DISABLED: false,

    DEFAULT_BACKGROUND: '#d1d1d1',
    DEFAULT_LOCAL_DISPLAY_NAME: 'me',
    DEFAULT_LOGO_URL: 'images/watermark.png',
    DEFAULT_REMOTE_DISPLAY_NAME: 'ChoopChat User',

    DISABLE_DOMINANT_SPEAKER_INDICATOR: false,

    DISABLE_FOCUS_INDICATOR: false,

    /**
     * If true, notifications regarding joining/leaving are no longer displayed.
     */
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,

    /**
     * If true, presence status: busy, calling, connected etc. is not displayed.
     */
    DISABLE_PRESENCE_STATUS: false,

    /**
     * Whether the ringing sound in the call/ring overlay is disabled. If
     * {@code undefined}, defaults to {@code false}.
     *
     * @type {boolean}
     */
    DISABLE_RINGING: false,

    /**
     * Whether the speech to text transcription subtitles panel is disabled.
     * If {@code undefined}, defaults to {@code false}.
     *
     * @type {boolean}
     */
    DISABLE_TRANSCRIPTION_SUBTITLES: false,

    /**
     * Whether or not the blurred video background for large video should be
     * displayed on browsers that can support it.
     */
    DISABLE_VIDEO_BACKGROUND: true, // TODO: test version with full video quality

    DISPLAY_WELCOME_PAGE_CONTENT: true,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,

    ENABLE_DIAL_OUT: true,

    ENABLE_FEEDBACK_ANIMATION: false, // Enables feedback star animation.

    FILM_STRIP_MAX_HEIGHT: 120,

    /**
     * Whether to only show the filmstrip (and hide the toolbar).
     */
    filmStripOnly: false,

    GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,

    /**
     * Hide the invite prompt in the header when alone in the meeting.
     */
    HIDE_INVITE_MORE_HEADER: false,

    INITIAL_TOOLBAR_TIMEOUT: 4000,
    JITSI_WATERMARK_LINK: '',

    LANG_DETECTION: true, // Allow i18n to detect the system language
    LIVE_STREAMING_HELP_LINK: 'https://jitsi.org/live', // Documentation reference for the live streaming feature.
    LOCAL_THUMBNAIL_RATIO: 16 / 9, // 16:9

    /**
     * Maximum coefficient of the ratio of the large video to the visible area
     * after the large video is scaled to fit the window.
     *
     * @type {number}
     */
    MAXIMUM_ZOOMING_COEFFICIENT: 1.3,

    /**
     * Whether the mobile app Jitsi Meet is to be promoted to participants
     * attempting to join a conference in a mobile Web browser. If
     * {@code undefined}, defaults to {@code true}.
     *
     * Should be disabled for Choop
     *
     * @type {boolean}
     */
    MOBILE_APP_PROMO: false, // disabled for Choop

    NATIVE_APP_NAME: 'Choop Chat',

    // Names of browsers which should show a warning stating the current browser
    // has a suboptimal experience. Browsers which are not listed as optimal or
    // unsupported are considered suboptimal. Valid values are:
    // chrome, chromium, edge, electron, firefox, nwjs, opera, safari
    OPTIMAL_BROWSERS: [ 'chrome', 'chromium', 'firefox', 'nwjs', 'electron', 'safari' ],

    POLICY_LOGO: null,
    PROVIDER_NAME: 'ChoopChat',

    /**
     * If true, will display recent list
     *
     * @type {boolean}
     */
    RECENT_LIST_ENABLED: true,
    REMOTE_THUMBNAIL_RATIO: 1, // 1:1

    SETTINGS_SECTIONS: [ 'devices', 'language', 'moderator', 'profile', 'calendar' ],
    SHOW_BRAND_WATERMARK: false,

    /**
    * Decides whether the chrome extension banner should be rendered on the landing page and during the meeting.
    * If this is set to false, the banner will not be rendered at all. If set to true, the check for extension(s)
    * being already installed is done before rendering.
    */
    SHOW_CHROME_EXTENSION_BANNER: false,

    /**
     * Functionality permissions for each roles.
     */

    ROLE_PERMISSIONS: {
        tiles: [ 'owner', 'presenter', 'executive' ],
        video: [ 'owner', 'presenter', 'executive', 'temp_presenter' ],
        audio: [ 'owner', 'presenter', 'executive', 'temp_presenter' ],
        sharing: [ 'owner', 'presenter', 'executive', 'temp_presenter' ],
        makecall: [ 'owner', 'presenter', 'executive' , 'temp_presenter' ],

        // settings button
        sharedvideo: [ 'owner', 'presenter', 'executive', 'temp_presenter' ],
        videobackgroundblur: [ 'owner', 'presenter', 'executive', 'temp_presenter' ],
        raisehand: ['owner', 'executive', 'presenter', 'temp_presenter', 'listener'],
        invite: [ 'owner', 'presenter', 'executive', 'temp_presenter' ],
        desktop: [ 'owner', 'presenter', 'executive', 'temp_presenter' ],
        lostconnection: [ 'owner', 'presenter', 'executive', 'temp_presenter' ]
    },

    SHOW_DEEP_LINKING_IMAGE: false,
    SHOW_JITSI_WATERMARK: false,
    SHOW_POWERED_BY: false,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    SHOW_WATERMARK_FOR_GUESTS: false, // if watermark is disabled by default, it can be shown only for guests

    /*
     * If indicated some of the error dialogs may point to the support URL for
     * help.
     */
    SUPPORT_URL: 'https://github.com/AgenaTrader/jitsi-meet/issues/new',

    TOOLBAR_ALWAYS_VISIBLE: false,

    /**
     * The name of the toolbar buttons to display in the toolbar, including the
     * "More actions" menu. If present, the button will display. Exceptions are
     * "livestreaming" and "recording" which also require being a moderator and
     * some values in config.js to be enabled. Also, the "profile" button will
     * not display for users with a JWT.
     * Notes:
     * - it's impossible to choose which buttons go in the "More actions" menu
     * - it's impossible to control the placement of buttons
     * - 'desktop' controls the "Share your screen" button
     */

    TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'info',

        // 'chat', 'livestreaming', 'localrecording',
        'recording',
        'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
        'security', 'toggle-audio', 'toggle-picture'
    ],

    TOOLBAR_TIMEOUT: 4000,

    // Browsers, in addition to those which do not fully support WebRTC, that
    // are not supported and should show the unsupported browser page.
    UNSUPPORTED_BROWSERS: [],

    /**
     * Whether to show thumbnails in filmstrip as a column instead of as a row.
     */
    VERTICAL_FILMSTRIP: true,

    // Determines how the video would fit the screen. 'both' would fit the whole
    // screen, 'height' would fit the original video height to the height of the
    // screen, 'width' would fit the original video width to the width of the
    // screen respecting ratio.
    VIDEO_LAYOUT_FIT: 'width',

    /**
     * If true, hides the video quality label indicating the resolution status
     * of the current large video.
     *
     * @type {boolean}
     */
    VIDEO_QUALITY_LABEL_DISABLED: false,

    /**
     * When enabled, the kick participant button will not be presented for users without a JWT
     */
    // HIDE_KICK_BUTTON_FOR_GUESTS: false,

    /**
     * How many columns the tile view can expand to. The respected range is
     * between 1 and 5.
     */
    // TILE_VIEW_MAX_COLUMNS: 5,

    /**
     * Specify custom URL for downloading android mobile app.
     */
    // MOBILE_DOWNLOAD_LINK_ANDROID: 'https://play.google.com/store/apps/details?id=org.jitsi.meet',

    /**
     * Specify URL for downloading ios mobile app.
     */
    // MOBILE_DOWNLOAD_LINK_IOS: 'https://itunes.apple.com/us/app/jitsi-meet/id1165103905',

    /**
     * Specify Firebase dynamic link properties for the mobile apps.
     */
    // MOBILE_DYNAMIC_LINK: {
    //    APN: 'org.jitsi.meet',
    //    APP_CODE: 'w2atb',
    //    CUSTOM_DOMAIN: undefined,
    //    IBI: 'com.atlassian.JitsiMeet.ios',
    //    ISI: '1165103905'
    // },

    /**
     * Specify mobile app scheme for opening the app from the mobile browser.
     */
    // APP_SCHEME: 'org.jitsi.meet',

    /**
     * Specify the Android app package name.
     */
    // ANDROID_APP_PACKAGE: 'org.jitsi.meet',

    /**
     * Override the behavior of some notifications to remain displayed until
     * explicitly dismissed through a user action. The value is how long, in
     * milliseconds, those notifications should remain displayed.
     */
    // ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 15000,

    // List of undocumented settings
    /**
     INDICATOR_FONT_SIZES
     PHONE_NUMBER_REGEX
    */

    // Allow all above example options to include a trailing comma and
    // prevent fear when commenting out the last value.
    // eslint-disable-next-line sort-keys
    makeJsonParserHappy: 'even if last key had a trailing comma'

    // No configuration value should follow this line.
};

document.addEventListener('DOMContentLoaded', () => {
    if ( ! hasJWTProtection() ) {
        // See https://issues.agenatrader.com/issues/34973
        console.log("Adding a Chat button to the Toolbar.");
        interfaceConfig.TOOLBAR_BUTTONS.push('chat');
    }
})

function hasJWTProtection() {
    const jwtFeatureState = APP.store.getState()['features/base/jwt'];
    return !!jwtFeatureState.jwt;
}

/* eslint-enable no-unused-vars, no-var, max-len */
