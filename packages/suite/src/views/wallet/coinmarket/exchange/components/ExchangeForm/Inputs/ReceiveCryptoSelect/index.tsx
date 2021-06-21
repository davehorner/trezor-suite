import { variables, Select, Button } from '@trezor/components';
import { ExchangeInfo } from '@wallet-actions/coinmarketExchangeActions';
import React from 'react';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';
import { ExchangeCoinInfo } from 'invity-api';
import { useCoinmarketExchangeFormContext } from '@wallet-hooks/useCoinmarketExchangeForm';
import { Translation } from '@suite-components';
import { Account } from '@wallet-types';
import invityAPI from '@suite-services/invityAPI';
import { CRYPTO_TOKEN } from '@wallet-types/coinmarketExchangeForm';
import { symbolToInvityApiSymbol } from '@suite/utils/wallet/coinmarket/coinmarketUtils';
import { useLayoutSize } from '@suite-hooks';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    min-width: 230px;

    @media screen and (max-width: ${variables.SCREEN_SIZE.LG}) {
        flex-direction: column;
    }
`;

const CoinLogo = styled.img`
    display: flex;
    align-items: center;
    padding-right: 6px;
    height: 16px;
`;

const Option = styled.div`
    display: flex;
    align-items: center;
`;

const OptionName = styled.div`
    display: flex;
    color: ${props => props.theme.TYPE_LIGHT_GREY};
`;

const OptionLabel = styled.div`
    min-width: 70px;
`;

const ClearFormButton = styled(Button)`
    height: 24px;
`;

const buildOptions = (
    account: Account,
    exchangeCoinInfo?: ExchangeCoinInfo[],
    exchangeInfo?: ExchangeInfo,
    token?: string,
) => {
    if (!exchangeInfo || !exchangeCoinInfo) return null;

    interface Options {
        label: React.ReactElement;
        options: { label: string; value: string; name: string }[];
    }

    const popular: Options = {
        label: <Translation id="TR_EXCHANGE_POPULAR_COINS" />,
        options: [],
    };

    const stable: Options = {
        label: <Translation id="TR_EXCHANGE_STABLE_COINS" />,
        options: [],
    };

    const all: Options = {
        label: <Translation id="TR_EXCHANGE_OTHER_COINS" />,
        options: [],
    };

    const symbolToFilter = symbolToInvityApiSymbol(token || account.symbol);

    const filteredExchangeCoins = exchangeCoinInfo.filter(
        coin => coin.ticker.toLowerCase() !== symbolToFilter,
    );

    filteredExchangeCoins.forEach(info => {
        if (!exchangeInfo.buySymbols.has(info.ticker.toLowerCase())) return false;

        if (info.category === 'Popular currencies') {
            popular.options.push({
                label: info.ticker.toUpperCase(),
                value: info.ticker.toUpperCase(),
                name: info.name,
            });
        }

        if (info.category === 'Stablecoins') {
            stable.options.push({
                label: `${info.ticker.toUpperCase()}`,
                value: info.ticker.toUpperCase(),
                name: info.name,
            });
        }

        if (info.category === 'All currencies') {
            all.options.push({
                label: `${info.ticker.toUpperCase()}`,
                value: info.ticker.toUpperCase(),
                name: info.name,
            });
        }
    });

    return [popular, stable, all];
};

const ReceiveCryptoSelect = () => {
    const {
        control,
        setAmountLimits,
        exchangeInfo,
        exchangeCoinInfo,
        account,
        getValues,
        formState,
        isDraft,
        handleClearFormButtonClick,
    } = useCoinmarketExchangeFormContext();
    const { isDirty } = formState;
    const customSearch = (
        option: { data: { label: string; value: string; name: string } },
        searchText: string,
    ) => {
        if (
            option.data.label.toLowerCase().includes(searchText.toLowerCase()) ||
            option.data.name.toLowerCase().includes(searchText.toLowerCase())
        ) {
            return true;
        }
        return false;
    };

    const tokenAddress = getValues(CRYPTO_TOKEN);
    const tokenData = account.tokens?.find(t => t.address === tokenAddress);
    const { layoutSize } = useLayoutSize();
    const isXLargeLayoutSize = layoutSize === 'XLARGE';

    return (
        <Wrapper>
            <Controller
                control={control}
                name="receiveCryptoSelect"
                render={({ onChange, value }) => (
                    <Select
                        labelAddon={
                            isXLargeLayoutSize && (isDirty || isDraft) ? (
                                <ClearFormButton
                                    type="button"
                                    variant="tertiary"
                                    onClick={handleClearFormButtonClick}
                                >
                                    <Translation id="TR_CLEAR_ALL" />
                                </ClearFormButton>
                            ) : undefined
                        }
                        onChange={(selected: any) => {
                            onChange(selected);
                            setAmountLimits(undefined);
                        }}
                        value={value}
                        isClearable={false}
                        filterOption={customSearch}
                        options={buildOptions(
                            account,
                            exchangeCoinInfo,
                            exchangeInfo,
                            tokenData?.symbol,
                        )}
                        minWidth="70px"
                        noTopLabel={!isXLargeLayoutSize}
                        formatOptionLabel={(option: any) => (
                            <Option>
                                <CoinLogo
                                    src={`${
                                        invityAPI.server
                                    }/images/coins/suite/${option.value.toUpperCase()}.svg`}
                                />
                                <OptionLabel>{option.label}</OptionLabel>
                                <OptionName>{option.name}</OptionName>
                            </Option>
                        )}
                        placeholder={<Translation id="TR_TRADE_SELECT_COIN" />}
                        isSearchable
                    />
                )}
            />
        </Wrapper>
    );
};

export default ReceiveCryptoSelect;
