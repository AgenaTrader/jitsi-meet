import {PARTICIPANT_ROLES_STORE_NAME} from "../base/participants-roles/reducer";
import {ROLE_EXECUTIVE, ROLE_OWNER, ROLE_PRESENTER} from "./actions";
import {getLocalParticipant} from "../base/participants";

/**
 * Get Participant's local role by inspecting identity data extracted from JWT.
 * The participant need to be taken from the conference data.
 *
 * @param state
 * @param participantId
 * @returns {undefined|string}
 */
export function getParticipantLocalRoleFromConference(state, participantId: string) {
    // The roles are loaded from the TradersYard backend when joining
    const {roles} = state[PARTICIPANT_ROLES_STORE_NAME];
    const {conference} = state['features/base/conference'];

    if (!conference) {
        return undefined;
    }

    // It's essential that we take the participant from the Conference object.
    // Participant stored in redux store does not have all the necessary data.
    const participant = conference.getParticipantById(participantId);

    // we can proceed only if we have _identity data extracted from JWT token.
    if (participant && participant._identity) {
        participantId = Number(participant._identity.user.id);

        const userRole = roles.find(role => Number(role.id) === participantId);
        return userRole?.role ?? undefined;
    }

    return undefined;
}


export function isEduMode(state) {
    const { choop: choopConfig } = state['features/base/config'];
    return !!(choopConfig?.eduMode ?? false);
}


/**
 * Function used with Edu Mode to figure out whether or not someone might be a Teacher.
 *
 * @todo This is not a best place for this function. Move it somewhere else. Some module responsible for modes.
 * @param state
 * @returns {boolean}
 */
export function isLocalParticipantTeacher(state) {
    const localParticipant = getLocalParticipant(state)
    return isEduMode(state) && [ROLE_PRESENTER, ROLE_OWNER, ROLE_EXECUTIVE].includes(localParticipant.localRole)
}
