import {ScrollView, StyleSheet} from "react-native";
import TotalBalance from "../components/transfer/TotalBalance";
import {Modal, Text} from "react-native-paper";
import React, {useCallback, useEffect, useState} from "react";
import SelectSubAccount from "../components/transfer/SelectSubaccount";
import BalanceOperations from "../components/transfer/BalanceOperations";
import RecentActivity from "../components/transfer/RecentActivity";
import Decimal from "decimal.js";
import {RouteProp, useFocusEffect, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../App";
import AlertSnackBar, {AlertState} from "../components/alert/AlertSnackBar";
import useFetch, {RequestConfig} from "../hook/use-fetch";
import {REST_PATH_ACCOUNT} from "../constants/constants";
import {subaccountBalanceActions} from "../store/slice/subaccountBalanceSlice";
import {useAppDispatch} from "../hook/redux-hooks";

export const availableCurrencies = {
    'EUR': "€",
    'USD': "$",
    'PLN': "zł",
    'CHF': "Fr",
    'GBP': "£"
};

export type AccountCurrencyBalanceResponse = {
    currency: string;
    balance: Decimal;
};

export type SubAccountCurrencyBalance = {
    currency: string;
    symbol: string;
    balance: Decimal;
};

const TransfersScreen = () => {
    const dispatch = useAppDispatch()
    const [loadedSubAccountBalanceList, setLoadedSubAccountBalanceList] = useState<SubAccountCurrencyBalance[]>([]);
    const [alertSnackBarState, setAlertSnackBarState] = useState<AlertState>({
        color: "",
        isOpen: false,
        message: ""
    });

    const {
        isLoading: isSubAccountsLoading,
        error: subAccountsError,
        sendRequest: sendSubAccountsRequest
    } = useFetch();

    const route = useRoute<RouteProp<RootStackParamList, 'Transfers'>>();

    useEffect(() => {
        if (route.params?.alertState) {
            setAlertSnackBarState(route.params.alertState);
        }
    }, [route.params?.alertState])

    useFocusEffect(useCallback(() => {

        //  get subaccounts
        const transformSubAccounts = (currenciesBalanceObj: AccountCurrencyBalanceResponse[]) => {
            const loadedCurrencyBalances: SubAccountCurrencyBalance[] = [];
            for (const key in currenciesBalanceObj) {
                loadedCurrencyBalances.push({
                    currency: currenciesBalanceObj[key].currency,
                    symbol: availableCurrencies[currenciesBalanceObj[key].currency as keyof typeof availableCurrencies],
                    balance: currenciesBalanceObj[key].balance
                });
            }
            setLoadedSubAccountBalanceList(loadedCurrencyBalances);
            dispatch(subaccountBalanceActions.setSubaccountsBalance(loadedCurrencyBalances))
        }
        const fetchSubAccountsRequest: RequestConfig = {
            url: REST_PATH_ACCOUNT + '/currency/all'
        };

        sendSubAccountsRequest(fetchSubAccountsRequest, transformSubAccounts);
    }, [sendSubAccountsRequest]))

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>

                <TotalBalance/>
                <SelectSubAccount subAccountBalanceList={loadedSubAccountBalanceList}
                                  setSubAccountBalanceList={setLoadedSubAccountBalanceList}/>
                <BalanceOperations subAccountBalanceList={loadedSubAccountBalanceList}
                                   setSubAccountBalanceList={setLoadedSubAccountBalanceList}/>
                <RecentActivity/>
            </ScrollView>
            <AlertSnackBar alertState={{"state": alertSnackBarState, "setState": setAlertSnackBarState}}/>

            <Modal visible={subAccountsError !== null} contentContainerStyle={styles.modalContainer}>
                <Text>Application unavailable</Text>
            </Modal>

        </>
    );
}

export default TransfersScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 8,
        marginTop: 20,
    },
    modalContainer: {
        backgroundColor: 'black',
        alignItems: 'center',
        height: 2000
    }
});