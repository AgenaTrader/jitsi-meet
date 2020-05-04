// @flow

import {
    AbstractButton,
    type AbstractButtonProps
} from '../../base/toolbox';

declare var APP: Object;
declare var config: Object;

export type Props = AbstractButtonProps & {

    _jwt: string,
    _ownerUserId: string,
    _participantUserId: string,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,

    /**
     * The ID of the participant object that this button is supposed to
     * mute/unmute.
     */
    participantID: string,

    /**
     * The function to be used to translate i18n labels.
     */
    t: Function
};

/**
 * An abstract remote video menu button which mutes the remote participant.
 */
export default class AbstractMakeCallButton extends AbstractButton<Props, *> {

    /**
     * Handles clicking / pressing the button, and mutes the participant.
     *
     * @param {MouseEvent} event - The click event to intercept.
     * @private
     * @returns {void}
     */
    _handleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const { _jwt, _ownerUserId, _participantUserId } = this.props;

        let makeCallRequest = config.makeCall;

        makeCallRequest = makeCallRequest.replace('{jwt}', _jwt);
        makeCallRequest = makeCallRequest.replace('{userId}', _participantUserId);

        window.open(makeCallRequest, `Window-${_ownerUserId}-${_participantUserId}`, "width=800,height=600");
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {{
 *      _audioTrackMuted: boolean
 *  }}
 */
export function _mapStateToProps(state: Object, ownProps: Props) {
    const { jwt, user } = state['features/base/jwt'];

    const ownerUserId = user.id;
    let secondUserId = undefined;

    const participant = APP.conference.getParticipantById(ownProps.participantID);

    if (participant) {
        secondUserId = participant._identity.user.id;
    }

    return {
        _jwt: jwt,
        _ownerUserId: ownerUserId,
        _participantUserId: secondUserId
    };
}
