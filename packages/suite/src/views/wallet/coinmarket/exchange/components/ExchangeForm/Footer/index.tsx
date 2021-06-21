import React from 'react';
import { Button, variables } from '@trezor/components';
import { Translation } from '@suite-components';
import styled from 'styled-components';
import { useCoinmarketExchangeFormContext } from '@wallet-hooks/useCoinmarketExchangeForm';
import { CRYPTO_INPUT } from '@suite/types/wallet/coinmarketExchangeForm';
import { useLayoutSize } from '@suite-hooks';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding-top: 40px;
    @media screen and (max-width: ${variables.SCREEN_SIZE.XL}) {
        flex-direction: column;
    }
`;

const Center = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
`;

const StyledButton = styled(Button)`
    min-width: 200px;
    margin-left: 20px;
`;

const ClearFormButton = styled(Button)`
    align-self: center;
    height: 24px;
    margin-top: 18px;
`;

const Footer = () => {
    const {
        formState,
        watch,
        errors,
        isComposing,
        isDraft,
        handleClearFormButtonClick,
    } = useCoinmarketExchangeFormContext();
    const { isDirty } = formState;
    const hasValues = !!watch(CRYPTO_INPUT) && !!watch('receiveCryptoSelect')?.value;
    const formIsValid = Object.keys(errors).length === 0;
    const { layoutSize } = useLayoutSize();
    const isXLargeLayoutSize = layoutSize === 'XLARGE';
    return (
        <Wrapper>
            <Center>
                <StyledButton
                    isDisabled={!(formIsValid && hasValues) || formState.isSubmitting}
                    isLoading={formState.isSubmitting || isComposing}
                    type="submit"
                >
                    <Translation id="TR_EXCHANGE_SHOW_OFFERS" />
                </StyledButton>
            </Center>
            {!isXLargeLayoutSize && (isDirty || isDraft) && (
                <Center>
                    <ClearFormButton
                        type="button"
                        variant="tertiary"
                        onClick={handleClearFormButtonClick}
                    >
                        <Translation id="TR_CLEAR_ALL" />
                    </ClearFormButton>
                </Center>
            )}
        </Wrapper>
    );
};

export default Footer;
