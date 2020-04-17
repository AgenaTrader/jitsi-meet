// @flow

import { ADD_PARTICIPANTS_ROLES, LOAD_PARTICIPANTS_ROLES, CHANGE_LOADING_STATUS } from './actionTypes';

/**
 * Creates as (redux) action to add participants roles for each participant
 * to the feature base/participants-roles.
 *
 * @param {Array<string>} roles - The roles for participant received
 * from token issuer.
 * @returns {{
 *     type: ADD_PARTICIPANTS_ROLES,
 *     roles: Array<string>
 * }}
 */
export function addParticipantsRoles(roles: Array<string>) {
    return {
        type: ADD_PARTICIPANTS_ROLES,
        roles
    };
}

/**
 * Creates as (redux) action to change loading participants roles status.
 *
 * @param {boolean} status - The loading participants roles status.
 * @returns {{
 *     type: CHANGE_LOADING_STATUS,
 *     status: boolean
 * }}
 */
export function changeLoadingParticipantsRolesStatus(status: boolean) {
    return {
        type: CHANGE_LOADING_STATUS,
        status: status
    };
}

/**
 * Creates as (redux) action to load participants roles for each participant
 * to the feature base/participants-roles.
 *
 * @param {string} jwt - The jwt auth token for get participants roles.
 * @returns {{
 *     type: LOAD_PARTICIPANTS_ROLES
 * }}
 */
export function loadParticipantsRoles(jwt: string) {
    return {
        type: LOAD_PARTICIPANTS_ROLES,
        jwt: jwt
    };
}
