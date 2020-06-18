import React from "react";
import {StyleSheet, Text, View} from "react-native";

export default class Boxs extends React.Component {
    render()
    {
        return(
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.inner}>
                        <Text>Sub Layout 1 </Text>
                    </View>
                </View>

                <View style={styles.box}>
                    <View style={styles.inner}>
                        <Text>Sub Layout 2 </Text>
                    </View>
                </View>

                <View style={styles.box}>
                    <View style={styles.inner}>
                        <Text>Sub Layout 3 </Text>
                    </View>
                </View>

                <View style={styles.box}>
                    <View style={styles.inner}>
                        <Text>Sub Layout 4 </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        container: {
            width: '100%',
            height: '85%',
            padding: 5,

            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        box: {
            width: '50%',
            height: '50%',
            padding: 5,


        },
        inner: {
            flex: 1,
            backgroundColor: 'gray',
            justifyContent: 'center'
        }
    }
)