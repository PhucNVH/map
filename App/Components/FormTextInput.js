import React from 'react'
import {StyleSheet,TextInput,View} from 'react-native'
import colors from '../Themes/Colors'
function FormTextInput(props) {
    const {style,...otherProps}=props
    return (
        <TextInput
        selectionColor={colors.DODGER_BLUE}
        style={[styles.textInput,otherProps]}
        />
    )
}
const styles=StyleSheet.create({
    textInput:{
        height:40,
        borderColor: colors.SILVER,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom:20
    }

});
export default FormTextInput
