import { View, StyleSheet, ScrollView, Alert } from "react-native";
import TotalBalance from "../components/transfer/TotalBalance";
import { Headline, HelperText, Provider, withTheme, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDown from "react-native-paper-dropdown";
import React, { useCallback, useEffect, useState } from "react";
import SelectSubAccount from "../components/transfer/SelectSubaccount";
import BalanceOperations from "../components/transfer/BalanceOperations";
import RecentActivity from "../components/transfer/RecentActivity";
import Decimal from "decimal.js";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import AlertSnackBar, { AlertState } from "../components/alert/AlertSnackBar";
import useFetch, { RequestConfig } from "../hook/use-fetch";
import { REST_PATH_ACCOUNT, REST_PATH_TRANSFER } from "../constants/constants";
import { subaccountBalanceActions } from "../store/slice/subaccountBalanceSlice";
import { useAppDispatch } from "../hook/redux-hooks";
import MoneyBalanceOperation from "../model/moneyBalanceOperation";
import TransactionSummary from "../model/transactionSummary";
import CurrencyExchangeHistory from "../model/currencyExchangeHistory";
import CurrencyExchangeHistoryResponse from "../model/currencyExchangeHistoryResponse";

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

        <TotalBalance />
        <SelectSubAccount subAccountBalanceList={loadedSubAccountBalanceList} setSubAccountBalanceList={setLoadedSubAccountBalanceList} />
        <BalanceOperations subAccountBalanceList={loadedSubAccountBalanceList} setSubAccountBalanceList={setLoadedSubAccountBalanceList} />
        <RecentActivity />
      </ScrollView>
      <AlertSnackBar alertState={{ "state": alertSnackBarState, "setState": setAlertSnackBarState }} />
    </>
  );
}

export default TransfersScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
    marginTop: 20,
  }
});