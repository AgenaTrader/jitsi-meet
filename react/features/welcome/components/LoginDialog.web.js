import React, { Component } from 'react';

import { Dialog } from '../../base/dialog';

/**
 * Implements a React {@link Component} which displays the component
 * {@code VideoQualitySlider} in a dialog.
 *
 * @extends Component
 */
export default class LoginDialog extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const facebookIcon = {
            backgroundImage: 'url(images/fb.png)'
        };
        const twitterIcon = {
            backgroundImage: 'url(images/tw.png)'
        };

        return (
            <Dialog
                hideCancelButton = { true }
                submitDisabled = { true }
                width = 'small'>
                <div className="login-form">
                    <div className="main">
                        <div className="social-icons">
                            <a href="#">
                                <ul className='facebook'>
                                    <i
                                        className="fb"
                                        style = { facebookIcon }
                                    ></i>
                                    <div className='clear'></div>
                                </ul>
                            </a>
                            <a href="#">
                                <ul className='twitter'>
                                    <i
                                        className="tw"
                                        style = { twitterIcon }
                                    > </i>
                                    <div className='clear'></div>
                                </ul>
                            </a>
                        </div>
                        <form>

                            <div className="lable-2">
                                <input
                                    type="text" className="text" placeholder="Full Name"
                                    onFocus="this.value = '';"
                                    onBlur="if (this.value == '') {this.value = 'First Name';}"
                                    />
                                <input type="text" className="text"
                                       placeholder="your@email.com "
                                       onFocus="this.value = '';"
                                       onBlur="if (this.value == '') {this.value = 'your@email.com ';}"/>
                                    <input type="password" className="text"
                                           placeholder="Password "
                                           onFocus="this.value = '';"
                                           onBlur="if (this.value == '') {this.value = 'Password ';}"/>
                            </div>
                            <div className="submit">
                                <input type="submit" onClick="myFunction()"
                                       value="Create account"/>
                            </div>
                            <div className="clear"></div>
                        </form>

                    </div>
                </div>
            </Dialog>
        );
    }
}
