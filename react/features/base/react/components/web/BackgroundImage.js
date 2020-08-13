/* @flow */

import React, { Component } from 'react';

import { translate } from '../../../i18n';

/**
 * The CSS style of the element with CSS class {@code rightwatermark}.
 *
 * @private
 */
const DEFAULT_BACKGROUND_IMAGE = {
    backgroundImage: 'url(images/backgrounds/default-background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
};

/**
 * The type of the React {@code Component} props of {@link Watermarks}.
 */
type Props = {
    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};


/**
 * A Web Component which renders watermarks such as Jits, brand, powered by,
 * etc.
 */
class BackgroundImage extends Component<Props> {


    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const date = new Date();
        let day = date.getDay();

        if (day > 24) {
            day = day - 10;
        }

        const styles = Object.assign({}, DEFAULT_BACKGROUND_IMAGE, {
            backgroundImage: `url(images/backgrounds/default-background${day}.jpg)`
        });

        return (
            <div
                className = 'background-page'
                style = { styles }
            />
        );
    }
}

export default translate(BackgroundImage);
