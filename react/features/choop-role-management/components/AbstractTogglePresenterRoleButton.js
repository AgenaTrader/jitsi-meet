// @flow

import type {AbstractButtonProps} from '../../base/toolbox';
import {AbstractButton} from '../../base/toolbox';
import {getParticipantById, isLocalParticipantModerator, isParticipantModerator} from "../../base/participants";
import {ROLE_LISTENER, setRemoteParticipantLocalRoleToListener, setRemoteParticipantLocalRoleToPresenter} from "../actions";
import {IconCamera} from "../../base/icons";

export type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,

    /**
     * The ID of the participant for whom to grant moderator status.
     */
    participantID: string,

    participantLocalRole: string,

    /**
     * The function to be used to translate i18n labels.
     */
    t: Function
};


export default class AbstractTogglePresenterRoleButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'choop.toolbar.accessibilityLabel.toggleLocalRole';
    icon = IconCamera;
    label = 'choop.videothumbnail.togglePresenter';

    _handleClick() {
        const {dispatch, participantID, participantLocalRole} = this.props;

        // chose best action based on role
        const action = participantLocalRole === ROLE_LISTENER
            ? setRemoteParticipantLocalRoleToPresenter(participantID)
            : setRemoteParticipantLocalRoleToListener(participantID)

        dispatch(action);
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {{
 *     visible: boolean
 * }}
 */
export function _mapStateToProps(state: Object, ownProps: Props) {
    const {participantID} = ownProps;

    const participant = getParticipantById(state, participantID)

    return {
        participantLocalRole: participant.localRole ?? null,
        visible: isLocalParticipantModerator(state) && !isParticipantModerator(participant)
    };
}
