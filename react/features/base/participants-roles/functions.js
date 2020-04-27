import { doGetJSON } from '../util';
import { PARTICIPANT_ROLES_STORE_NAME } from './reducer';

declare var APP: Object;

/**
 * Get roles for participants.
 *
 * @param {string} jwt - auth token
 * @returns {Promise<Object>}
 */
export function getRolesForParticipants(jwt: string): Promise<Object> {
    return new Promise((resolve, reject) => {
        doGetJSON(`/getParticipants?jwt=${jwt}`, true)
            .then(response => {
                const { data } = response;

                resolve(data.map(i => {
                    return {
                        id: i.Item1,
                        role: i.Item2
                    };
                }) || []);
            })
            .catch(() => reject([]));
    });
}

/**
 * Get participant role by user id. Can use local user id or from _identity.
 *
 * @param {string} userId - auth token
 * @returns {string | undefined}
 */
export function getParticipantLocalRoleById(userId: string) {
    const state = APP.store.getState();
    let currentUserId = userId;
    const roles = state[PARTICIPANT_ROLES_STORE_NAME].roles;

    const conferenceParticipant = APP.conference.getParticipantById(userId);

    if (conferenceParticipant) {
        currentUserId = Number(conferenceParticipant._identity.user.id);
    }

    const userRole = roles.find(role => Number(role.id) === currentUserId);

    if (userRole) {
        return userRole.role;
    }

    return undefined;
}
