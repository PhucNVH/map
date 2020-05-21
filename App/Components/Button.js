import React from 'react'
import {StyleSheet,Text,TouchableOpacity} from "react-native"
import colors from '../Themes/Colors'

interface Props{    
    label: String;
    onPress: () => void;
}

function Button(props) {
    
        const {label,onPress}=props;
        return (           
                <TouchableOpacity style={styles.container} onPress={onPress}>
                    <Text style={styles.text} >{label}</Text>
                </TouchableOpacity>  
        );
}

const styles=StyleSheet.create({
    container:{
        width:"100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.DODGER_BLUE,
        marginBottom:12,
        paddingVertical:12,
        borderRadius:4,
        borderWidth: StyleSheet.hairlindWidth,
        borderColor:colors.BLACK
    },
    text:{
        color:colors.text,
        textAlign:"center",
        height:20
    }
});
export default Button

