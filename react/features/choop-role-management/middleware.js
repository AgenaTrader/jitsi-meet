// @flow

import {MiddlewareRegistry, StateListenerRegistry} from "../base/redux";
import {
    getLocalParticipant,
    getParticipantById,
    PARTICIPANT_JOINED,
    PARTICIPANT_UPDATED,
    setLocalRole
} from "../base/participants";
import {CHOOP_SET_REMOTE_PARTICIPANT_LOCAL_ROLE} from "./actionTypes";
import type {Store} from "redux";
// noinspection ES6PreferShortImport
import {SET_JWT} from "../base/jwt/actionTypes";
import {loadParticipantsRoles} from "../base/participants-roles";
import {getParticipantLocalRoleFromConference} from "./functions";

const CHOOP_COMMANDS = {
    CHANGE_ROLE_OF: 'choop_changeRoleOf'
}

type ChangeRoleOfCommand = {
    // This is a new role name
    value: string;
    attributes: {
        // What participant should have his local role changed.
        participantId: string;
    }
}

/**
 * Listen for changes of the `conference` property.
 */
StateListenerRegistry.register(
    state => state['features/base/conference'].conference,
    _conferenceStateListener
)

MiddlewareRegistry.register(store => next => action => {

    const {dispatch} = store;

    switch (action.type) {
        case CHOOP_SET_REMOTE_PARTICIPANT_LOCAL_ROLE: {
            _sendRoleChangeCommand(store, action);
            break;
        }

        // called only for REMOTE participants joining
        case PARTICIPANT_JOINED: {
            _announceYourLocalRole(store, action);
            break;
        }

        case SET_JWT: {
            // FIXME: we need to get away from dependence on TradersYard.
            //  this triggers loading of roles by API call to TradersYard via Token Issuer
            action.jwt && dispatch(loadParticipantsRoles(action.jwt));
            break;
        }
    }

    const result = next(action);

    switch (action.type) {
        case PARTICIPANT_UPDATED: {
            _setParticipantLocalRoleFromRemoteData(store, action);
            break;
        }
    }

    return result;
});


/**
 * FIXME: It depends on remotely loaded list of roles from TradersYard.
 *  We need to decouple ourself from TradersYards/EduPortle.
 *  We need to figure out how to announce our role when we join the server.
 * @param store
 * @param action
 * @private
 */
function _setParticipantLocalRoleFromRemoteData(store, action) {
    const {dispatch, getState} = store;
    const {participant} = action;

    // We lookup the participant again, because we run this function in middleware
    // after we all the other middlewares executed
    const participantById = getParticipantById(store.getState(), participant.id)

    if (participantById && !participantById.localRole) {
        const userRole = getParticipantLocalRoleFromConference(getState(), participantById.id);
        dispatch(setLocalRole(participantById.id, userRole ?? 'none'));
    }
}

/**
 *  * Announce your local role to the server.
 * This uses {@see JitsiConference.setLocalParticipantProperty} method to announce the status as presence stanza.
 *
 * The local role should come from the JWT token in the first place. This will be set when user joins the server.
 * After JWT is set, a {@see PARTICIPANT_UPDATED} is dispatched with `localRole` being set based on JWT user context.
 * **HOWEVER**, conference is NOT yet available at this point, so we won't be able to announce our role!
 *
 * @link https://xyards.atlassian.net/wiki/spaces/CHOOP/pages/24805380/Controlling+User+Roles
 * @private
 */

/**
 * Announce local role of the local participant.
 * Works in tandem with a property change listener PARTICIPANT_PROPERTY_CHANGED.
 *
 * When new user joins the conference, we need to tell them what is our current local role.
 * For now, this needs to be announced, because it only lives on the client side.
 * Local role can be changed without affecting what is visible by the XMPP server.
 *
 * @param store
 * @param action
 * @private
 */
function _announceYourLocalRole(store, action) {
    const {getState} = store;
    const {conference} = getState()['features/base/conference'];

    const localParticipant = getLocalParticipant(getState())

    if (conference && localParticipant) {
        console.log("[choop] Announce your local role in presence stanza", localParticipant.localRole);
        conference.setLocalParticipantProperty('localRole', localParticipant.localRole);
    }
}

/**
 * Send a custom command to all conference participants as a `presence` stanza of the local participant.
 * IMPORTANT! This is not checked on server side in any way right now.
 *
 * It will be received on the other end by StateListenerRegistry.
 *
 * @see _conferenceStateListener
 *
 * @param {Store} store
 * @param {Object} action
 * @private
 */
function _sendRoleChangeCommand(store, action) {
    const conference = _getConferenceFromStore(store);
    const {role, participantId} = action;

    console.log("[choop] Sending role change command. Setting role %s for participant %s",
        role, participantId
    );

    conference.sendCommand(CHOOP_COMMANDS.CHANGE_ROLE_OF, {
        value: role,
        attributes: {participantId}
    })
}


/**
 * @param {JitsiConference} conference
 * @param {Store} store
 * @private
 */
function _conferenceStateListener(conference, store) {

    const {dispatch, getState} = store;

    if (!conference) return; // we need a conference object

    conference.addCommandListener(CHOOP_COMMANDS.CHANGE_ROLE_OF, changeRoleOf);

    /**
     * Updates local state of the participant who's role is being changed by the command.
     * This can be run for every participant, so everyone is notified of the role change,
     * even the person issuing the command.
     *
     * @param {ChangeRoleOfCommand} data
     * @param {string} from
     */
    function changeRoleOf(data, from) {

        console.log('[choop] Received role change command', from, data);

        const {value: newRole, attributes} = data;
        const participant = getParticipantById(getState(), attributes.participantId);

        if (!participant) {
            console.log("[choop] Could not get participant");
            return;
        }

        console.log('[choop] Applying role change to participant', newRole, participant);

        dispatch(setLocalRole(participant.id, newRole));
    }
}

/**
 * @param {Store} store
 * @returns {JitsiConference|null}
 * @private
 */
function _getConferenceFromStore(store) {
    const state = store.getState();
    return state['features/base/conference'].conference ?? null;
}
