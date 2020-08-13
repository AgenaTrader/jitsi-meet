// @flow

import { FlagGroup } from '@atlaskit/flag';
import React from 'react';

import { connect } from '../../../base/redux';
import AbstractNotificationsContainer, {
    _abstractMapStateToProps,
    type Props as AbstractProps
} from '../AbstractNotificationsContainer';

import Notification from './Notification';

type Props = AbstractProps & {

    /**
     * Whther we are a SIP gateway or not.
     */
     _iAmSipGateway: boolean
};

/**
 * Implements a React {@link Component} which displays notifications and handles
 * automatic dismissmal after a notification is shown for a defined timeout
 * period.
 *
 * @extends {Component}
 */
class NotificationsContainer extends AbstractNotificationsContainer<Props> {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        if (this.props._iAmSipGateway) {
            return null;
        }

        return (
            <FlagGroup onDismissed = { this._onDismissed }>
                { this._renderFlags() }
            </FlagGroup>
        );
    }

    _onDismissed: number => void;

    /**
     * Autohide all notifications items after 5sec.
     *
     * @returns { void }
     */
    hideAllNotifications() {
        const self = this;

        setTimeout(() => {
            const elements = document.getElementsByClassName('gpUwQx');

            if (elements.length) {
                for (let i = 0; i < elements.length; i++) {
                    elements[i].classList.add('gpUwQx-hide');
                    elements[i].addEventListener('mouseenter', self.showAllNotifications, false);
                }
            }
        }, 5000);
    }

    /**
     * Show all notifications items.
     *
     * @returns { void }
     */
    showAllNotifications() {
        const self = this;
        const elements = document.getElementsByClassName('gpUwQx');

        if (elements.length) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove('gpUwQx-hide');
                elements[i].addEventListener('mouseover', self.hideAllNotifications, false);
            }
        }
    }

    /**
     * Renders notifications to display as ReactElements. An empty array will
     * be returned if notifications are disabled.
     *
     * @private
     * @returns {ReactElement[]}
     */
    _renderFlags() {
        const { _notifications } = this.props;

        this.hideAllNotifications();

        return _notifications.reverse().map(notification => {
            const { props, uid } = notification;

            // The id attribute is necessary as {@code FlagGroup} looks for
            // either id or key to set a key on notifications, but accessing
            // props.key will cause React to print an error.
            return (
                <Notification
                    { ...props }
                    id = { uid }
                    key = { uid }
                    uid = { uid } />

            );
        });
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const { iAmSipGateway } = state['features/base/config'];

    return {
        ..._abstractMapStateToProps(state),
        _iAmSipGateway: Boolean(iAmSipGateway)
    };
}


export default connect(_mapStateToProps)(NotificationsContainer);
