// @flow

import type { Dispatch } from 'redux';

import {
    createToolbarEvent,
    sendAnalytics
} from '../../../analytics';
import { translate } from '../../../base/i18n';
import { IconVolume } from '../../../base/icons';
import { connect } from '../../../base/redux';
import {
    AbstractButton,
    type AbstractButtonProps
} from '../../../base/toolbox';
import {
    updateAllParticipantAudioVolume,
    updateSettings
} from '../../../base/settings';

/**
 * The type of the React {@code Component} props of {@link TileViewButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether or not tile view layout has been enabled as the user preference.
     */
    _audioEnabled: boolean,

    /**
     * Used to dispatch actions from the buttons.
     */
    dispatch: Dispatch<any>
};

/**
 * Component that renders a toolbar button for toggling the tile layout view.
 *
 * @extends AbstractButton
 */
class ToggleAudioButton<P: Props> extends AbstractButton<P, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.toggleAudio';
    icon = IconVolume;
    label = 'toolbar.disableAudioMode';
    toggledLabel = 'toolbar.enableAudioMode';
    tooltip = 'toolbar.toggleAudio';

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { _audioEnabled, dispatch } = this.props;

        sendAnalytics(createToolbarEvent(
            'toggleaudio.button',
            {
                'is_enabled': _audioEnabled
            }));
        const value = !_audioEnabled;

        dispatch(updateSettings({
            enabledAudioVolume: value
        }));

        updateAllParticipantAudioVolume(value ? 1 : 0);
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._audioEnabled;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ToggleAudioButton} component.
 *
 * @param {Object} state - The Redux state.
 * @returns {{
 *     _audioEnabled: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
        _audioEnabled: state['features/base/settings'].enabledAudioVolume
    };
}

export default translate(connect(_mapStateToProps)(ToggleAudioButton));
