import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { Translation } from '@suite-components';
import { OnOffSwitcher } from '@wallet-components';
import { Button, Tooltip } from '@trezor/components';
import { useSendFormContext } from '@wallet-hooks';
import { isEnabled as isFeatureEnabled } from '@suite-utils/features';
import { useActions } from '@suite-hooks';
import * as guideActions from '@suite-actions/guideActions';
import { Node } from '@trezor/suite-data/src/guide/parser';

import Locktime from './components/Locktime';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const Row = styled.div`
    display: flex;
    flex-flow: row wrap;
    flex: 1;
    justify-content: space-between;
`;

const Left = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-start;
    flex-wrap: wrap;
`;

const AddRecipientButton = styled(Button)`
    align-self: center;
`;

const Right = styled.div`
    display: flex;
`;

const StyledButton = styled(Button)`
    margin: 4px 8px 4px 0px;
`;

const OpenGuideLink = styled.a`
    margin-left: 3px;
    color: ${props => props.theme.TYPE_GREEN};
    transition: ${props =>
        `background ${props.theme.HOVER_TRANSITION_TIME} ${props.theme.HOVER_TRANSITION_EFFECT}`};

    &:hover {
        color: ${props => darken(props.theme.HOVER_DARKEN_FILTER, props.theme.TYPE_GREEN)};
    }
`;

const BitcoinOptions = () => {
    const {
        network,
        addOutput,
        getDefaultValue,
        toggleOption,
        composeTransaction,
        resetDefaultValue,
    } = useSendFormContext();

    const options = getDefaultValue('options', []);
    const locktimeEnabled = options.includes('bitcoinLockTime');
    const rbfEnabled = options.includes('bitcoinRBF');
    const broadcastEnabled = options.includes('broadcast');

    const { openNode, openGuide } = useActions({
        openGuide: guideActions.open,
        openNode: guideActions.openNode,
    });

    const tooltipOpensGuide = (id: string) => {
        const node: Node = {
            type: 'page',
            id: '',
            locales: [''],
            title: {
                '': 'string',
            },
        };
        openGuide();
        node.id = id;
        openNode(node);
    };

    return (
        <Wrapper>
            {locktimeEnabled && (
                <Locktime
                    close={() => {
                        resetDefaultValue('bitcoinLockTime');
                        // close additional form
                        if (!rbfEnabled) toggleOption('bitcoinRBF');
                        if (!broadcastEnabled) toggleOption('broadcast');
                        toggleOption('bitcoinLockTime');
                        composeTransaction();
                    }}
                />
            )}

            <Row>
                <Left>
                    {!locktimeEnabled && (
                        <Tooltip
                            content={
                                <>
                                    <Translation id="LOCKTIME_ADD_TOOLTIP" />
                                    <OpenGuideLink
                                        onClick={() =>
                                            tooltipOpensGuide('/suite-basics/send/locktime.md')
                                        }
                                    >
                                        <Translation id="TR_LEARN_MORE" />
                                    </OpenGuideLink>
                                </>
                            }
                            cursor="pointer"
                        >
                            <StyledButton
                                variant="tertiary"
                                icon="CALENDAR"
                                onClick={() => {
                                    // open additional form
                                    toggleOption('bitcoinLockTime');
                                    composeTransaction();
                                }}
                            >
                                <Translation id="LOCKTIME_ADD" />
                            </StyledButton>
                        </Tooltip>
                    )}
                    {isFeatureEnabled('RBF') &&
                        network.features?.includes('rbf') &&
                        !locktimeEnabled && (
                            <Tooltip
                                content={
                                    <>
                                        <Translation id="RBF_TOOLTIP" />
                                        <OpenGuideLink
                                            onClick={() =>
                                                tooltipOpensGuide(
                                                    '/suite-basics/send/rbf-replace-by-fee.md',
                                                )
                                            }
                                        >
                                            <Translation id="TR_LEARN_MORE" />
                                        </OpenGuideLink>
                                    </>
                                }
                                cursor="pointer"
                            >
                                <StyledButton
                                    variant="tertiary"
                                    icon="RBF"
                                    onClick={() => {
                                        toggleOption('bitcoinRBF');
                                        composeTransaction();
                                    }}
                                >
                                    <Translation id="RBF" />
                                    <OnOffSwitcher isOn={rbfEnabled} />
                                </StyledButton>
                            </Tooltip>
                        )}
                    <Tooltip content={<Translation id="BROADCAST_TOOLTIP" />} cursor="pointer">
                        <StyledButton
                            variant="tertiary"
                            icon="BROADCAST"
                            onClick={() => {
                                toggleOption('broadcast');
                                composeTransaction();
                            }}
                        >
                            <Translation id="BROADCAST" />
                            <OnOffSwitcher isOn={broadcastEnabled} />
                        </StyledButton>
                    </Tooltip>
                </Left>
                <Right>
                    <AddRecipientButton
                        variant="tertiary"
                        icon="PLUS"
                        data-test="add-output"
                        onClick={addOutput}
                    >
                        <Translation id="RECIPIENT_ADD" />
                    </AddRecipientButton>
                </Right>
            </Row>
        </Wrapper>
    );
};

export default BitcoinOptions;
