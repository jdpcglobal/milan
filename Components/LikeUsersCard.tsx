import React from "react";
import { LikeUsers } from "../Utils/Types";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('screen');
const averageMobileWidth = 360;
const maxWidth = Math.min(width, averageMobileWidth * 2);
const cardWidth = width > averageMobileWidth ? averageMobileWidth : maxWidth;

type cardProps = {
    data: LikeUsers;
};

const LikeUsersCard = (props: cardProps) => {
    const { name, surname, age, imageUrl, religion } = props.data;

    return (
        <View style={[styles.card, { width: 'auto', height: 105, justifyContent:'center' }]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image}  />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{name}, {age}</Text>
                {/* <Text style={styles.infoText}>Age: {age}</Text> */}
                {/* <Text style={styles.infoText}>Religion: {religion}</Text> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        elevation: 2, // for shadow on Android
        shadowColor: '#000', // for shadow on iOS
        shadowOffset: { width: 0, height: 2 }, // for shadow on iOS
        shadowOpacity: 0.25, // for shadow on iOS
        shadowRadius: 3.84, // for shadow on iOS
        borderColor:'#D6D4D2',
        borderWidth:1
    },
    imageContainer: {
        marginRight: 10,
    },
    image: {
        width: 70,
        height: 90,
        borderRadius: 10,
    },
    infoContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 18,
        color: '#4A4744',
        fontWeight: 'bold',
        fontFamily:'georgia',
    },
    infoText: {
        color: 'black',
        fontFamily:'georgia',
        fontWeight:'600'
    },
});

export default LikeUsersCard;
