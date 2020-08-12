// @flow

import InlineDialog from '@atlaskit/inline-dialog';
import React, { Component } from 'react';
import type { Dispatch } from 'redux';

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { openDialog } from '../../base/dialog';
import { translate } from '../../base/i18n';
import {
    IconVideoQualityAudioOnly,
    IconVideoQualityHD, IconVideoQualityLD, IconVideoQualitySD
} from '../../base/icons';
import { connect } from '../../base/redux';
import { ToolbarButton } from '../../toolbox';

import VideoQualityDialog from './VideoQualityDialog';
import VideoQualitySlider from './VideoQualitySlider';
import { VIDEO_QUALITY_LEVELS } from '../../base/conference';

/**
 * A map of of selectable receive resolutions to corresponding icons.
 *
 * @private
 * @type {Object}
 */
const VIDEO_QUALITY_TO_ICON = {
    [VIDEO_QUALITY_LEVELS.HIGH]: IconVideoQualityHD,
    [VIDEO_QUALITY_LEVELS.STANDARD]: IconVideoQualitySD,
    [VIDEO_QUALITY_LEVELS.LOW]: IconVideoQualityLD
};

/**
 * The type of the React {@code Component} props of {@link VideoQualityDialogButton}.
 */
type Props = {

    /**
     * Whether or not audio only mode is currently enabled.
     */
    _audioOnly: boolean,

    /**
     * The currently configured maximum quality resolution to be received from
     * and sent to remote participants.
     */
    _videoQuality: number,

    /**
     * Whether or not the {@code VideoQualityDialog} should display automatically when
     * in a lonely call.
     */
    _disableAutoShow: boolean,

    /**
     * Whether or not the toolbox, in which this component exists, is visible.
     */
    _toolboxVisible: boolean,

    /**
     * Callback invoked when the dialog should be closed.
     */
    onClose: Function,

    /**
     * Callback invoked when a mouse-related event has been detected.
     */
    onMouseOver: Function,

    /**
     * Invoked to toggle display of the info dialog.
     */
    dispatch: Dispatch<any>,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * The type of the React {@code Component} state of {@link VideoQualityDialogButton}.
 */
type State = {

    /**
     * Whether or not {@code VideoQualityDialog} should be visible.
     */
    showDialog: boolean
};

/**
 * A React Component for displaying a button which opens a dialog with
 * information about the conference and with ways to invite people.
 *
 * @extends Component
 */
class VideoQualityDialogButton extends Component<Props, State> {
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props, state) {
        return {
            showDialog: props._toolboxVisible && state.showDialog
        };
    }

    /**
     * Initializes new {@code VideoQualityDialogButton} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            showDialog: false
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onDialogClose = this._onDialogClose.bind(this);
        this._onDialogToggle = this._onDialogToggle.bind(this);
        this._onClickOverflowMenuButton
            = this._onClickOverflowMenuButton.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { showDialog } = this.state;
        const { _audioOnly, _videoQuality, t } = this.props;
        const icon = _audioOnly || !_videoQuality
            ? IconVideoQualityAudioOnly
            : VIDEO_QUALITY_TO_ICON[_videoQuality];

        return (
            <div className = 'toolbox-button-wth-dialog'>
                <InlineDialog
                    content = {
                        <VideoQualitySlider
                            onClose = { this._onDialogClose } /> }
                    isOpen = { showDialog }
                    onClose = { this._onDialogClose }
                    position = { 'top right' }>
                    <ToolbarButton
                        accessibilityLabel = { t('toolbar.accessibilityLabel.callQuality') }
                        icon = { icon }
                        onClick = { this._onDialogToggle }
                        tooltip = { t('toolbar.callQuality') } />
                </InlineDialog>
            </div>
        );
    }

    _onDialogClose: () => void;

    /**
     * Hides {@code VideoQualityDialog}.
     *
     * @private
     * @returns {void}
     */
    _onDialogClose() {
        this.setState({ showDialog: false });
    }

    _onClickOverflowMenuButton: () => void;

    /**
     * Opens the Info dialog.
     *
     * @returns {void}
     */
    _onClickOverflowMenuButton() {
        this.props.dispatch(openDialog(VideoQualityDialog, {
            isInlineDialog: false
        }));
    }

    _onDialogToggle: () => void;

    /**
     * Toggles the display of {@code VideoQualityDialog}.
     *
     * @private
     * @returns {void}
     */
    _onDialogToggle() {
        sendAnalytics(createToolbarEvent('videoquality'));

        this.setState({ showDialog: !this.state.showDialog });
    }
}

/**
 * Maps (parts of) the Redux state to the associated {@code VideoQualityDialogButton}
 * component's props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _toolboxVisible: boolean
 * }}
 */
function _mapStateToProps(state) {

    return {
        _toolboxVisible: state['features/toolbox'].visible,
        _audioOnly: state['features/base/audio-only'].enabled,
        _videoQuality: state['features/base/conference'].preferredVideoQuality
    };
}

export default translate(connect(_mapStateToProps)(VideoQualityDialogButton));
