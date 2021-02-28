import cinetrics from '../cinetrics_header.png';
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import ApiUrl from "../config";
//import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
    container: {
        flex: "1",
    },
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 10,
        backgroundColor: "lightgrey",
    },
    center: {
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        margin: 10,
    },
    card: {
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        margin: 10,
        display: "inline-block",
    },
    upvote: {
        backgroundColor: "#22CC22",
        display: "inline-block",
        width: 150,
        margin: 5
    },
    downvote: {
        backgroundColor: "#CC2222",
        width: 150,
        display: "inline-block",
        margin: 5
    },
    title: {
        fontSize: 16,
        color: "darkblue",
    }
});

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            c_password: "",
            failed_reg: false,
        };
    }
    componentDidMount() {
    }
    register() {
        const body = "username="+this.state.username+"&password="+this.state.password;
        let signin = {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        }
        const request = ApiUrl()+"/register";
        console.log(signin);
        fetch(request, signin)
            .then((response) => response.json())
            .then((data) => {
                console.log("Create?", data)
                if (data.access_token) {
                    console.log("success")
                    this.props.navigation.navigate("Home", {
                        token_from_creation: data.access_token
                    })
                }
                else{
                    console.log("failed")
                    this.setState({failed_reg: true})
                }
            });
    }
    back() {
        this.props.navigation.navigate("Home", {
        })
    }
    render() {
        return (
            <div style={{height: "100vh", overflow: "auto"}}>
                <View style={styles.center}>
                    <img src={cinetrics} alt="Cinetrics" style={{maxWidth: "20%", margin: 25}}/>
                    <TextInput
                        mode="flat"
                        label="username"
                        value={this.state.username}
                        style={{margin: 2}}
                        onChangeText={(username) => this.setState({username})}
                    />
                    <TextInput
                        mode="flat"
                        label="password"
                        secureTextEntry
                        value={this.state.password}
                        style={{margin: 2}}
                        onChangeText={(password) => this.setState({password})}
                    />
                    <TextInput
                        mode="flat"
                        label="confirm password"
                        secureTextEntry
                        value={this.state.c_password}
                        style={{margin: 2}}
                        onChangeText={(c_password) => this.setState({c_password})}
                    />
                    { (this.state.password === this.state.c_password) ? 
                        <Button mode="contained" style={{margin: 10, marginTop: 30, width: 150, backgroundColor: "#DD4444"}} onPress={() => this.register()}>Register</Button> :
                        <Button disabled="true" mode="contained" style={{margin: 10, marginTop: 30, width: 150, backgroundColor: "#AAAAAA" }}>Register</Button>
                    }
                    <Button mode="contained" style={{margin: 10, width: 150, backgroundColor: "#2255AA"}} onPress={() => this.back()}>back</Button>
                    { this.state.failed_reg ? <View style={styles.center}>
                        <Text style={{color: "#882222"}}>Registration failed</Text>
                    </View> : <Text></Text>}
                </View>
            </div>
        );
    }
}
