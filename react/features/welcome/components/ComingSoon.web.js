/* global interfaceConfig */

import React from 'react';

import { translate } from '../../base/i18n';
import { Watermarks } from '../../base/react';
import { AbstractWelcomePage } from './AbstractWelcomePage';

/**
 * The Web container rendering the coming soon page.
 */
class ComingSoon extends AbstractWelcomePage {

    /**
     * Initializes a new WelcomePage instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
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
        document.title = interfaceConfig.APP_NAME;
    }

    /**
     * Removes the classname used for custom styling of the welcome page.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        super.componentWillUnmount();
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

        return (
            <div
                className = 'welcome-coming-soon'
                id = 'coming_soon'>
                <div className = 'welcome-watermark'>
                    <Watermarks />
                </div>
                <div className = 'text-content'>
                    <h1 className = 'text-title'>
                        { APP_NAME }
                    </h1>
                    <h2 className = 'text-coming-soon'>
                        - { t('comingsoon.title')} -
                    </h2>
                </div>
            </div>
        );
    }
}

export default translate(ComingSoon);
