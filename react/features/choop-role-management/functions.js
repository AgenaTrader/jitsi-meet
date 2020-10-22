import {PARTICIPANT_ROLES_STORE_NAME} from "../base/participants-roles/reducer";

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
