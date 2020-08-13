// @flow

import { PersistenceRegistry, ReducerRegistry } from '../redux';

import { ADD_PARTICIPANTS_ROLES, CHANGE_LOADING_STATUS } from './actionTypes';
import { APP_WILL_MOUNT } from '../app';

/**
 * The default list of participant-roles
 */
export const DEFAULT_STATE = {
    loading: 0,
    roles: []
};

export const PARTICIPANT_ROLES_STORE_NAME = 'features/base/participants-roles';

PersistenceRegistry.register(PARTICIPANT_ROLES_STORE_NAME);

ReducerRegistry.register(PARTICIPANT_ROLES_STORE_NAME, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case APP_WILL_MOUNT:
        return DEFAULT_STATE;

    case ADD_PARTICIPANTS_ROLES:
        return {
            ...state,
            roles: action.roles
        };
    case CHANGE_LOADING_STATUS:
        return {
            ...state,
            loading: action.status
        };

    default:
        return state;
    }
});
