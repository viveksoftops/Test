import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';

export default class Detail extends React.Component{

    render(){
        return(
            <ScrollView style={{flex:1,padding:1,paddingBottom:30}} contentContainerStyle={{flexGrow:1}}>

                <Text>{JSON.stringify(this.props.route.params.item,null,2)}</Text>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1
    }
});