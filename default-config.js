/* eslint-disable no-unused-vars, no-var */

// TODO: merge with upstream config.js so we can have all possible values documented here

var config = {
    hosts: {
        domain: 'choop.chat',

        muc: 'conference.choop.chat' // FIXME: use XEP-0030

        // focus: 'focus.meet.jit.si',
    },
    disableSimulcast: true,
    enableRemb: true,
    enableTcc: true,
    resolution: 540,
    maxFps: 30,
    desktopSharingFrameRate: {
        max: 30
    },
    constraints: {
        video: {
            frameRate: {
                max: 30
            },
            height: {
                ideal: 540,
                max: 540,
                min: 180
            },
            width: {
                ideal: 960,
                max: 960,
                min: 360
            }
        }
    },
    enableInsecureRoomNameWarning: false,
    externalConnectUrl: '//meet.jit.si/http-pre-bind',
    analytics: {
        // The Google Analytics Tracking ID:
        googleAnalyticsTrackingId: 'UA-167283179-1',

        // The Amplitude APP Key:
        // amplitudeAPPKey: '<APP_KEY>'

        // Array of script URLs to load as lib-jitsi-meet "analytics handlers".
        scriptURLs: [
            'libs/analytics-ga.min.js' // google-analytics
            // "https://www.googletagmanager.com/gtag/js?id=UA-167283179-1"
        ]
    },
    enableP2P: true, // flag to control P2P connections
    // New P2P options
    p2p: {
        enabled: true,
        preferH264: true,
        disableH264: true,
        useStunTurn: true // use XEP-0215 to fetch STUN and TURN servers for the P2P connection
    },
    useStunTurn: true, // use XEP-0215 to fetch TURN servers for the JVB connection
    useTurnUdp: false,
    bosh: '/http-bind', // FIXME: use xep-0156 for that

    // websocket: 'wss://meet.jit.si/xmpp-websocket', // FIXME: use xep-0156 for that

    clientNode: 'http://jitsi.org/jitsimeet', // The name of client node advertised in XEP-0115 'c' stanza

    // deprecated desktop sharing settings, included only because older version of jitsi-meet require them
    desktopSharing: 'ext', // Desktop sharing method. Can be set to 'ext', 'webrtc' or false to disable.
    chromeExtensionId: null, // Id of desktop streamer Chrome extension
    desktopSharingSources: ['screen', 'window'],
    desktopSharingChromeExtId: null, // Id of desktop streamer Chrome extension
    desktopSharingChromeSources: ['screen', 'window', 'tab'],
    useRoomAsSharedDocumentName: false,
    enableLipSync: false,
    disableRtx: false, // Enables RTX everywhere
    enableScreenshotCapture: false,
    openBridgeChannel: 'websocket', // One of true, 'datachannel', or 'websocket'
    channelLastN: 20, // The default value of the channel attribute last-n.
    startBitrate: '600',
    disableAudioLevels: true, // TODO: change to false later
    disableSuspendVideo: true,
    stereo: false,

    // forceJVB121Ratio:  -1,
    enableTalkWhileMuted: true,
    enableNoAudioDetection: true,
    enableNoisyMicDetection: true,
    enableClosePage: true,
    disableLocalVideoFlip: true,
    transcribingEnabled: false,
    enableRecording: false,
    liveStreamingEnabled: true,
    fileRecordingsEnabled: false,
    fileRecordingsServiceEnabled: false,
    fileRecordingsServiceSharingEnabled: false,
    requireDisplayName: false,
    enableWelcomePage: true,
    isBrand: false,
    dialInNumbersUrl: 'https://api.jitsi.net/phoneNumberList',

    // dialInConfCodeUrl:  'https://api.jitsi.net/conferenceMapper',

    dialOutCodesUrl: 'https://api.jitsi.net/countrycodes',
    dialOutAuthUrl: 'https://api.jitsi.net/authorizephone',

    // inviteServiceCallFlowsUrl: 'https://api.jitsi.net/conferenceinvitecallflows',
    startAudioMuted: 9,
    startVideoMuted: 9,

    /**
     * @property {boolean} enableUserRolesBasedOnToken
     * @default false
     *
     * Needs to be `true` to enable the invitation form where you can search for people
     * using the `peopleSearchUrl` endpoint.
     */
    enableUserRolesBasedOnToken: true,

    enableLayerSuspension: true,
    feedbackPercentage: 0,

    prejoinPageEnabled: false,

    /**
     * Disable deep linking support. Deep links are used to trigger native apps when using a phone.
     * This needs to be `true` to allow mobile browsers. Otherwise users will be denied access
     * or presented with a mobile app promo page - this is controlled by interface config `MOBILE_APP_PROMO`.
     *
     * For Choop this should be true.
     * @property {boolean} disableDeepLinking
     * @default false
     */
    disableDeepLinking: true,

    e2eping: {
        pingInterval: -1
    },
    abTesting: {
    },
    peopleSearchUrl: '/peopleSearch',
    inviteServiceUrl: '/conferenceInvite',
    peopleSearchQueryTypes: [ 'user' /*, 'conferenceRooms'*/ ],

    tokenAuthUrl: '/joinRoom?roomName={room}',
    makeCall: '/makeCall?jwt={jwt}&userId={userId}',
    testing: {
        capScreenshareBitrate: 1,
        octo: {
            probability: 1
        }
    }
};

/* eslint-enable no-unused-vars, no-var */
