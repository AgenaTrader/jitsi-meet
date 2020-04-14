/* @flow */

import { toState } from '../redux';

import { VIDEO_MUTISM_AUTHORITY } from './constants';
import {
    getParticipantById,
    getRolesForParticipants,
    setLocalRole
} from '../../base/participants';
import _ from 'lodash';

declare var APP: Object;
declare var interfaceConfig: Object;

/**
 * Determines whether video is currently muted by the audio-only authority.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean}
 */
export function isVideoMutedByAudioOnly(stateful: Function | Object) {
    return (
        _isVideoMutedByAuthority(stateful, VIDEO_MUTISM_AUTHORITY.AUDIO_ONLY));
}

/**
 * Determines whether video is currently muted by a specific
 * {@code VIDEO_MUTISM_AUTHORITY}.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @param {number} videoMutismAuthority - The {@code VIDEO_MUTISM_AUTHORITY}
 * which is to be checked whether it has muted video.
 * @returns {boolean} If video is currently muted by the specified
 * {@code videoMutismAuthority}, then {@code true}; otherwise, {@code false}.
 */
function _isVideoMutedByAuthority(
        stateful: Function | Object,
        videoMutismAuthority: number) {
    const { muted } = toState(stateful)['features/base/media'].video;

    // eslint-disable-next-line no-bitwise
    return Boolean(muted & videoMutismAuthority);
}

/**
 * Determines whether video is currently muted by the user authority.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean}
 */
export function isVideoMutedByUser(stateful: Function | Object) {
    return _isVideoMutedByAuthority(stateful, VIDEO_MUTISM_AUTHORITY.USER);
}

/**
 * Determines whether a specific videoTrack should be rendered.
 *
 * @param {Track} videoTrack - The video track which is to be rendered.
 * @param {boolean} waitForVideoStarted - True if the specified videoTrack
 * should be rendered only after its associated video has started;
 * otherwise, false.
 * @returns {boolean} True if the specified videoTrack should be renderd;
 * otherwise, false.
 */
export function shouldRenderVideoTrack(
        videoTrack: ?{ muted: boolean, videoStarted: boolean },
        waitForVideoStarted: boolean) {
    return (
        videoTrack
            && !videoTrack.muted
            && (!waitForVideoStarted || videoTrack.videoStarted));
}

/**
 * Verifying that the current local user has permissions for different functionality.
 *
 * @param {string} type - permission type: video/audio.
 * @returns {boolean}
 */
export function _verifyUserHasPermission(type: string): Boolean {
    const userId = APP.conference.getMyUserId();
    const state = APP.store.getState();
    const participant = getParticipantById(state, userId);

    if (!_.isUndefined(participant)) {
        return _checkPermissionByRole(participant.localRole, type);
    }

    return true;
}

/**
 * Verifying that the user has permissions for different functionality.
 *
 * @param {string} userId - user id
 * @param {string} type - permission type: video/audio.
 * @returns {boolean}
 */
export async function _verifyUserHasPermissionById(userId: string, type: string): Boolean {
    const state = APP.store.getState();
    const participant = getParticipantById(state, userId);

    if (!_.isUndefined(participant)) {
        if (participant && !participant.localRole) {
            const conferenceParticipant = APP.conference.getParticipantById(userId);
            const { jwt } = state['features/base/jwt'];

            const roles = await getRolesForParticipants(jwt);

            const participantRole = roles.find(
                part => Number(part.id) === Number(conferenceParticipant._identity.user.id)
            );

            if (participantRole) {
                console.log('======= roles', roles, conferenceParticipant._identity.user.id);
                console.log('======= setLocalRole', userId, participantRole.role);
                APP.store.dispatch(setLocalRole(userId, participantRole.role));

                return _checkPermissionByRole(participantRole.role, type);
            }
        }

        return _checkPermissionByRole(participant.localRole, type);
    }

    return true;
}

/**
 * Check participant access by role
 *
 * @param {string} role - user role
 * @param {string} type - permission type: video/audio.
 * @returns {boolean}
 */
export function _checkPermissionByRole(role: string, type: string): Boolean {
    const permission = interfaceConfig.ROLE_PERMISSIONS;

    if (!_.isUndefined(permission) && !_.isUndefined(permission[type])) {
        return permission[type].includes(role);
    }

    return true;
}
