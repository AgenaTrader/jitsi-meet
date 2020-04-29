/* @flow */

import React from 'react';

import { translate } from '../../../base/i18n';
import { IconPhone } from '../../../base/icons';
import { connect } from '../../../base/redux';

import AbstractMakeCallButton, {
    _mapStateToProps,
    type Props
} from '../AbstractMakeCallButton';

import RemoteVideoMenuButton from './RemoteVideoMenuButton';

/**
 * Implements a React {@link Component} which displays a button for audio muting
 * a participant in the conference.
 *
 * NOTE: At the time of writing this is a button that doesn't use the
 * {@code AbstractButton} base component, but is inherited from the same
 * super class ({@code AbstractMuteButton} that extends {@code AbstractButton})
 * for the sake of code sharing between web and mobile. Once web uses the
 * {@code AbstractButton} base component, this can be fully removed.
 */
class MakeCallButton extends AbstractMakeCallButton {
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { participantID, t } = this.props;
        const muteConfig = {
            translationKey: 'toolbar.accessibilityLabel.makeCall',
            muteClassName: 'makecall'
        };

        return (
            <RemoteVideoMenuButton
                buttonText = { t(muteConfig.translationKey) }
                displayClass = { muteConfig.muteClassName }
                icon = { IconPhone }
                id = { `makecall_${participantID}` }
                // eslint-disable-next-line react/jsx-handler-names
                onClick = { this._handleClick } />
        );
    }

    _handleClick: () => void
}

export default translate(connect(_mapStateToProps)(MakeCallButton));
