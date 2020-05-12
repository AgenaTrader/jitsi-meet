/**
 * Create an action for when the settings are updated.
 *
 * {
 *     type: SETTINGS_UPDATED,
 *     settings: {
 *         audioOutputDeviceId: string,
 *         avatarID: string,
 *         avatarURL: string,
 *         cameraDeviceId: string,
 *         displayName: string,
 *         email: string,
 *         localFlipX: boolean,
 *         micDeviceId: string,
 *         serverURL: string,
 *         startAudioOnly: boolean,
 *         startWithAudioMuted: boolean,
 *         startWithVideoMuted: boolean,
 *         disableNotifications: boolean.
 *         disableLostConnectionSound: boolean.
 *     }
 * }
 */
export const SETTINGS_UPDATED = 'SETTINGS_UPDATED';
