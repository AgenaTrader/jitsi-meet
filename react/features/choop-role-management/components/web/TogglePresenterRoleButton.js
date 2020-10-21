/* @flow */

import React from 'react';

import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import {IconCameraDisabled, IconCamera} from '../../../base/icons';
import AbstractTogglePresenterRoleButton, {
    _mapStateToProps
} from '../AbstractTogglePresenterRoleButton';

import RemoteVideoMenuButton from "../../../remote-video-menu/components/web/RemoteVideoMenuButton";
import {ROLE_LISTENER} from "../../actions";


class TogglePresenterRoleButton extends AbstractTogglePresenterRoleButton {

    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this);
    }

    render() {
        const { participantID, t, visible, participantLocalRole } = this.props;

        if (!visible) {
            return null;
        }

        const buttonConfig = participantLocalRole === ROLE_LISTENER ? {
            buttonText: 'choop.videothumbnail.toggleLocalRoleSetPresenter',
            displayClass: 'grantmoderatorlink',
            icon: IconCamera
        } : {
            buttonText: 'choop.videothumbnail.toggleLocalRoleSetListener',
            displayClass: 'grantmoderatorlink',
            icon: IconCameraDisabled
        };

        return (
            <RemoteVideoMenuButton
                buttonText = { t(buttonConfig.buttonText) }
                displayClass = { buttonConfig.displayClass }
                icon = { buttonConfig.icon }
                id = { `choop_toggle_presenter_${participantID}` }
                // eslint-disable-next-line react/jsx-handler-names
                onClick = { this._handleClick } />
        );
    }

    _handleClick: () => void
}

export default translate(connect(_mapStateToProps)(TogglePresenterRoleButton));
