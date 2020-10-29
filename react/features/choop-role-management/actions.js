import {CHOOP_SET_REMOTE_PARTICIPANT_LOCAL_ROLE} from "./actionTypes";


export const ROLE_PRESENTER_TEMP = 'temp_presenter';
export const ROLE_LISTENER = 'listener';

export function setRemoteParticipantLocalRoleToPresenter(participantId) {
    return {
        type: CHOOP_SET_REMOTE_PARTICIPANT_LOCAL_ROLE,
        role: ROLE_PRESENTER_TEMP,
        participantId
    };
}

export function setRemoteParticipantLocalRoleToListener(participantId) {
    return {
        type: CHOOP_SET_REMOTE_PARTICIPANT_LOCAL_ROLE,
        role: ROLE_LISTENER,
        participantId
    };
}
