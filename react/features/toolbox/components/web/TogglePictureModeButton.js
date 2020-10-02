/* @flow */

import type { Dispatch } from 'redux';

import {
    createToolbarEvent,
    sendAnalytics
} from '../../../analytics';
import { translate } from '../../../base/i18n';
import { IconPictureInPictureOpen, IconPictureInPictureClose } from '../../../base/icons';
import { SET_PICTURE_IN_PICTURE_MODE } from '../../../base/media';
import { connect } from '../../../base/redux';
import {
    AbstractButton,
    type AbstractButtonProps
} from '../../../base/toolbox';
import { getPictureInPictureStatus } from '../../../base/tracks';

/**
 * The type of the React {@code Component} props of {@link TileViewButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether or not tile view layout has been enabled as the user preference.
     */
    _pictureEnable: boolean,

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
class TogglePictureModeButton<P: Props> extends AbstractButton<P, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.togglePicture';
    icon = IconPictureInPictureClose;
    toggledIcon = IconPictureInPictureOpen;
    label = 'toolbar.disablePictureMode';
    toggledLabel = 'toolbar.enablePictureMode';
    tooltip = 'toolbar.togglePictureMode';

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { _pictureEnable, dispatch } = this.props;

        sendAnalytics(createToolbarEvent(
            'togglepicture.button',
            {
                'is_enabled': _pictureEnable
            }));

        dispatch({
            type: SET_PICTURE_IN_PICTURE_MODE
        });
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._pictureEnable;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code TogglePictureModeButton} component.
 *
 * @returns {{
 *     _pictureEnable: boolean
 * }}
 */
function _mapStateToProps() {
    return {
        _pictureEnable: getPictureInPictureStatus()
    };
}

export default translate(connect(_mapStateToProps)(TogglePictureModeButton));
