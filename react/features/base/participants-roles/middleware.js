// @flow

import { MiddlewareRegistry } from '../redux';

import {
    addParticipantsRoles,
    changeLoadingParticipantsRolesStatus
} from './actions';
import {
    getRolesForParticipants,
    ADD_PARTICIPANTS_ROLES,
    LOAD_PARTICIPANTS_ROLES
} from '../participants-roles';
import { PARTICIPANT_ROLES_STORE_NAME } from './reducer';

MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case LOAD_PARTICIPANTS_ROLES:
        return _loadParticipantRoles(store, action.jwt, next, action);
    }

    return next(action);
});

/**
 * Get user roles with related with group or webinar.
 * to the feature base/participants-roles.
 *
 * @param {Store} store - The redux store.
 * @param {string} jwt - The jwt authorization token.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _loadParticipantRoles({ dispatch, getState }, jwt: string) {
    const state = getState();
    const participantRoles = state[PARTICIPANT_ROLES_STORE_NAME];

    if (!participantRoles.roles.length) {
        if (!participantRoles.loading) {
            dispatch(changeLoadingParticipantsRolesStatus(1));

            getRolesForParticipants(jwt)
                .then(roles => {
                    dispatch(addParticipantsRoles(roles));
                    dispatch(changeLoadingParticipantsRolesStatus(0));
                });
        }
    }
}
