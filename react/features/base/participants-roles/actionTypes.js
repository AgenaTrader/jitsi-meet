// @flow

/**
 * The type of (redux) action to add participants roles for each participant
 * to the feature base/participants-roles.
 *
 * {
 *     type: ADD_PARTICIPANTS_ROLES,
 *     roles: Array<string>
 * }
 */
export const ADD_PARTICIPANTS_ROLES = 'ADD_PARTICIPANTS_ROLES';

/**
 * Change loading roles status.
 *
 * {
 *     type: CHANGE_LOADING_STATUS,
 *     roles: <string>
 * }
 */
export const CHANGE_LOADING_STATUS = 'CHANGE_LOADING_STATUS';

/**
 * The type of (redux) action to load participants roles for each participant
 * to the feature base/participants-roles.
 *
 * {
 *     type: LOAD_PARTICIPANTS_ROLES
 * }
 */
export const LOAD_PARTICIPANTS_ROLES = 'LOAD_PARTICIPANTS_ROLES';
