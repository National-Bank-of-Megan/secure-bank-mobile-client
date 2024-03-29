import {ProgressBar, Text} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import Colors from "../constants/colors";
import {useEffect, useState} from "react";
import {KLIK_PAYMENT_TIME} from "../constants/constants";
import {useFocusEffect} from "@react-navigation/native";

import {UseStateType} from "../model/UseStateType";
import {KLIK_CODE_TIME} from "../constants/constants";

const KlikProgressBar: React.FC<{
    timeLeft: number,
    duration: number,
    marginTop?: number
}> = (props) => {

    return (
        <View style={{...styles.container, marginTop: props.marginTop}}>
            <Text style={styles.validText}>Valid for the next: {props.timeLeft}s</Text>
            <ProgressBar progress={props.timeLeft / props.duration} style={styles.progressBar}/>
        </View>
    );
}

export default KlikProgressBar;

const styles = StyleSheet.create({
    container: {},
    validText: {
        fontSize: 16,
        color: Colors.SECONDARY
    },
    progressBar: {
        marginTop: 10
    }
});