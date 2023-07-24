import { StyleSheet, Text, View, PixelRatio, ScrollView, Pressable } from 'react-native'
import React from 'react'
import allColor from '../Resources/Colors/Color'
import icons from '../Resources/Icons/icons';


const TableComponent = ({ data }) => {
    // const data = [
    //     { code: 2, name: 'Jane', edit: {icon:icons.userEdit(),action:"data"},delete:{icon:icons.deleteIcon(),action:"data"} },
    //     { code: 3, name: 'Bob', edit: {icon:icons.userEdit(),action:"data"},delete:{icon:icons.deleteIcon(),action:"data"} },
    //     { code: 4, name: 'Alice', edit: {icon:icons.userEdit(),action:"data"},delete:{icon:icons.deleteIcon(),action:"data"} },
    // ];


    return (
        <View>
            <ScrollView>
                <View style={styles.container}>
                    <View style={[styles.row, styles.header]}>
                        {Object.keys(data[0]).map((props, key) => (
                            <Text key={key} style={[styles.headerText, styles.cell]}>{props}</Text>
                        ))}

                    </View>
                    {data.map((item, index) => (
                        <View  style={styles.row} key={item.id}>

                            {Object.values(data[index]).map((props, key) => (

                                props?.icon ? <Pressable key={key} style={[styles.headerText, styles.cell]} onPress={props.action} >
                                    {props?.icon}
                                </Pressable> :
                                    <Text key={key} style={[styles.headerText, styles.cell]}>{props}</Text>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

export default TableComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: PixelRatio.roundToNearestPixel(10),
        backgroundColor: allColor['blue-lite'],
    },
    header: {
        backgroundColor: "#0b2e5e",
        borderTopRightRadius: PixelRatio.roundToNearestPixel(10),
        borderTopLeftRadius: PixelRatio.roundToNearestPixel(10),

    },
    headerText: {
        fontWeight: 'bold',
        color: allColor.white,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 5,
        paddingHorizontal: PixelRatio.roundToNearestPixel(10),
        alignItems: "center"
    },
    cell: {
        color: allColor.white
    },
})