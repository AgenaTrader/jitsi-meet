/* global interfaceConfig */

import React from 'react';

import { i18next, translate } from '../../base/i18n';
import { BackgroundImage } from '../../base/react';
import { connect } from '../../base/redux';
import { SettingsButton, SETTINGS_TABS } from '../../settings';
import { AbstractWelcomePage, _mapStateToProps } from './AbstractWelcomePage';

import { toggleDialog } from '../../base/dialog';
import AboutUsDialog from './AboutUsDialog.web';
import ImpressumDialog from './ImpressumDialog.web';
import LoginDialog from './LoginDialog';

declare var APP: Object;

/**
 * The pattern used to validate room name.
 * @type {string}
 */
export const ROOM_NAME_VALIDATE_PATTERN_STR = '^[^?&:\u0022\u0027%#]+$';

/**
 * Maximum number of pixels corresponding to a mobile layout.
 * @type {number}
 */
const WINDOW_WIDTH_THRESHOLD = 425;

/**
 * The Web container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePageChoopChat extends AbstractWelcomePage {
    /**
     * Default values for {@code WelcomePage} component's properties.
     *
     * @static
     */
    static defaultProps = {
        _room: ''
    };

    /**
     * Initializes a new WelcomePage instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            generateRoomnames:
                interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE,
            selectedTab: 0
        };

        /**
         * The HTML Element used as the container for additional content. Used
         * for directly appending the additional content template to the dom.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalContentRef = null;

        this._roomInputRef = null;

        /**
         * The HTML Element used as the container for additional toolbar content. Used
         * for directly appending the additional content template to the dom.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalToolbarContentRef = null;

        /**
         * The template to use as the main content for the welcome page. If
         * not found then only the welcome page head will display.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalContentTemplate = document.getElementById(
            'welcome-page-additional-content-template');

        /**
         * The template to use as the additional content for the welcome page header toolbar.
         * If not found then only the settings icon will be displayed.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalToolbarContentTemplate = document.getElementById(
            'settings-toolbar-additional-content-template'
        );

        // Bind event handlers so they are only bound once per instance.
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onRoomChange = this._onRoomChange.bind(this);
        this._setAdditionalContentRef
            = this._setAdditionalContentRef.bind(this);
        this._setRoomInputRef = this._setRoomInputRef.bind(this);
        this._setAdditionalToolbarContentRef
            = this._setAdditionalToolbarContentRef.bind(this);
        this._onTabSelected = this._onTabSelected.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();

        document.body.classList.add('welcome-page');
        document.title = interfaceConfig.APP_NAME;

        if (this.state.generateRoomnames) {
            this._updateRoomname();
        }

        if (this._shouldShowAdditionalContent()) {
            this._additionalContentRef.appendChild(
                this._additionalContentTemplate.content.cloneNode(true));
        }

        if (this._shouldShowAdditionalToolbarContent()) {
            this._additionalToolbarContentRef.appendChild(
                this._additionalToolbarContentTemplate.content.cloneNode(true)
            );
        }
    }

    _handleAboutUsClick(e) {
        e.preventDefault();

        // APP.store.dispatch(toggleDialog(AboutUsDialog));

    }

    _handleImpressumClick(e) {
        e.preventDefault();

        // APP.store.dispatch(toggleDialog(ImpressumDialog));

    }

    _handleLoginClick(e) {
        e.preventDefault();

        // APP.store.dispatch(toggleDialog(LoginDialog));
    }

    /**
     * Removes the classname used for custom styling of the welcome page.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        super.componentWillUnmount();

        document.body.classList.remove('welcome-page');
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render() {
        const { t } = this.props;
        const { APP_NAME } = interfaceConfig;
        const showAdditionalContent = this._shouldShowAdditionalContent();
        const showAdditionalToolbarContent = this._shouldShowAdditionalToolbarContent();

        return (
            <div
                className = { `${showAdditionalContent
                    ? 'with-content' : 'without-content'}` }
                id = 'welcome-choop-chat'>
                <BackgroundImage />
                <div className = 'header'>
                    <nav className = 'navigation'>
                        <ul className = 'menu'>
                            <li className = 'logo'>
                                { APP_NAME.toUpperCase() }
                            </li>

                            <li className = 'item button'>
                                <a onClick = { this._handleLoginClick } href="#">Log In</a>
                            </li>
                            <li className = 'item button secondary'>
                                <a href="#">Sign Up</a>
                            </li>
                            <li className = 'item button'>
                                <SettingsButton
                                    defaultTab = { SETTINGS_TABS.CALENDAR } />
                                { showAdditionalToolbarContent
                                    ? <div
                                        ref = { this._setAdditionalToolbarContentRef } />
                                    : null
                                }
                            </li>
                        </ul>
                    </nav>
                    <div className = 'header-image' />
                    <div className = 'header-text'>
                        <h1 className = 'header-text-title'>
                            { t('welcomepage.choopchat.title').toUpperCase() }
                        </h1>
                    </div>
                    <div id = 'enter_room'>
                        <form onSubmit = { this._onFormSubmit }>
                            <input
                                autoComplete = 'off'
                                autoFocus = { true }
                                className = 'enter-room-input'
                                id = 'enter_room_field'
                                onChange = { this._onRoomChange }
                                pattern = { ROOM_NAME_VALIDATE_PATTERN_STR }
                                placeholder = { t('welcomepage.choopchat.roomPlaceholder') }
                                ref = { this._setRoomInputRef }
                                title = { t('welcomepage.roomNameAllowedChars') }
                                type = 'text'
                                value = { this.state.room } />
                        </form>
                        <div className = 'connection-buttons'>
                            <div
                                className = 'welcome-page-button'
                                id = 'enter_room_button'
                                onClick = { this._onFormSubmit }>
                                {
                                    t('welcomepage.choopchat.roomButtonName')
                                }
                            </div>
                            <div className = 'addition-buttons'>
                                <a
                                    className = 'create-account'
                                    href = '#'
                                    onClick = { this._handleLoginClick }>
                                    { t('welcomepage.choopchat.createAccount') }
                                </a>
                                <a
                                    className = 'need-help'
                                    href = '#'>
                                    { t('welcomepage.choopchat.needHelp') }
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
                { showAdditionalContent
                    ? <div
                        className = 'welcome-page-content'
                        ref = { this._setAdditionalContentRef } />
                    : null }
                <footer className = 'footer'>
                    <div className = 'navigation'>
                        <ul className = 'menu'>
                            <li className = 'item'>
                                <a
                                    href="#"
                                    onClick = { this._handleAboutUsClick }>
                                    { t('welcomepage.choopchat.aboutUs') }
                                </a>
                            </li>
                            <li className = 'item'>
                                <a
                                    href="#"
                                    onClick = { this._handleImpressumClick }>
                                    { t('welcomepage.choopchat.impressum') }
                                </a>
                            </li>
                            <li className = 'item'>
                                <a href = "https://tradersyard.com/intl/terms-conditions">
                                    { t('welcomepage.choopchat.termsConditions') }
                                </a>
                            </li>
                        </ul>
                    </div>
                </footer>
            </div>
        );
    }

    /**
     * Prevents submission of the form and delegates join logic.
     *
     * @param {Event} event - The HTML Event which details the form submission.
     * @private
     * @returns {void}
     */
    _onFormSubmit(event) {
        event.preventDefault();

        if (!this._roomInputRef || this._roomInputRef.reportValidity()) {
            // this._onJoin();

            const room = this.state.room || this.state.generatedRoomname;

            window.open(room, '_blank');
        }
    }

    /**
     * Overrides the super to account for the differences in the argument types
     * provided by HTML and React Native text inputs.
     *
     * @inheritdoc
     * @override
     * @param {Event} event - The (HTML) Event which details the change such as
     * the EventTarget.
     * @protected
     */
    _onRoomChange(event) {
        super._onRoomChange(event.target.value);
    }

    /**
     * Callback invoked when the desired tab to display should be changed.
     *
     * @param {number} tabIndex - The index of the tab within the array of
     * displayed tabs.
     * @private
     * @returns {void}
     */
    _onTabSelected(tabIndex) {
        this.setState({ selectedTab: tabIndex });
    }

    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * welcome page content.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the welcome page content.
     * @private
     * @returns {void}
     */
    _setAdditionalContentRef(el) {
        this._additionalContentRef = el;
    }

    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * toolbar additional content.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the additional toolbar content.
     * @private
     * @returns {void}
     */
    _setAdditionalToolbarContentRef(el) {
        this._additionalToolbarContentRef = el;
    }

    /**
     * Sets the internal reference to the HTMLInputElement used to hold the
     * welcome page input room element.
     *
     * @param {HTMLInputElement} el - The HTMLElement for the input of the room name on the welcome page.
     * @private
     * @returns {void}
     */
    _setRoomInputRef(el) {
        this._roomInputRef = el;
    }

    /**
     * Returns whether or not additional content should be displayed below
     * the welcome page's header for entering a room name.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalContent() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_CONTENT
            && this._additionalContentTemplate
            && this._additionalContentTemplate.content
            && this._additionalContentTemplate.innerHTML.trim();
    }

    /**
     * Returns whether or not additional content should be displayed inside
     * the header toolbar.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalToolbarContent() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT
            && this._additionalToolbarContentTemplate
            && this._additionalToolbarContentTemplate.content
            && this._additionalToolbarContentTemplate.innerHTML.trim();
    }

    /**
     * Returns whether or not the screen has a size smaller than a custom margin
     * and therefore display different text in the go button.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowResponsiveText() {
        const { innerWidth } = window;

        return innerWidth <= WINDOW_WIDTH_THRESHOLD;
    }

}

export default translate(connect(_mapStateToProps)(WelcomePageChoopChat));