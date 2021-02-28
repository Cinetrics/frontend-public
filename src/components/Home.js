import cinetrics from '../cinetrics_header.png';
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import ApiUrl from "../config";
import { Slider, Grid } from '@material-ui/core';
//import { TouchableOpacity } from "react-native-gesture-handler";

const TmdbUrl = "https://api.themoviedb.org/3/movie/";
const TmdbKey = "?api_key=nope";
const TmdbImageUrl = "https://image.tmdb.org/t/p/w500/";

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
    sliderValue: {
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: "larger"
    },
    critic: {
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        marginTop: 25,
        marginBottom: 25,
        fontSize: 32,
        fontWeight: 900,
    },
    score: {
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        fontSize: "larger"
    },
    averageValue: {
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        fontSize: "large"
    },
    review: {
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    card: {
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        margin: 10,
        display: "inline-block",
        textAlign: "center",
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
        fontSize: 24,
        flex: 1, justifyContent: 'Center', alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 100,
    }
});

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            data: "",
            movie_id: "",
            avg_score: "",
            token: "",
            sliderValue: 100,
            failed_login: false,
            calibrated: false,
            critic: "",
            matches: [],
        };
    }
    componentDidMount() {
    }
    signIn() {
        const body = "username="+this.state.username+"&password="+this.state.password;
        let signin = {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        }
        const request = ApiUrl()+"/login";
        console.log(signin);
        fetch(request, signin)
            .then((response) => response.json())
            .then((data) => {
                console.log("Logged?", data)
                if (data.access_token) {
                    console.log("success")
                    this.setState({token: data.access_token})
                    this.isCalibrated();
                }
                else{
                    console.log("failed")
                    this.setState({failed_login: true})
                }
            })
            .catch(error => console.log('Error:', error));
    }
    signOut() {
        this.setState({username: ""})
        this.setState({password: ""})
        this.setState({failed_login: false})
        this.setState({calibrated: false})
        // Ugly hack to prevent rereading token from account creation
        // and becoming unable to sign out
        if (this.props.route.params && this.props.route.params.token_from_creation)
            this.props.route.params.token_from_creation = "";
        this.setState({token: ""})
    }
    isCalibrated() {
        let request_body = {
            method: 'GET',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
        }
        const request = ApiUrl()+"/calibrated";
        console.log(request_body);
        fetch(request, request_body)
            .then((response) => response.json())
            .then((data) => {
                console.log("Logged?", data)
                if (data) {
                    console.log("success")
                    this.setState({calibrated: data.calibrated})
                    if (!data.calibrated) {
                        this.getNextMovie();
                    }
                    else {
                        this.getCritic();
                    }
                }
                else{
                    console.log("failed")
                }
            })
            .catch(error => console.log('Error:', error));
    }
    getNextMovie() {
        let next = {
            method: 'GET',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
        }
        const request = ApiUrl()+"/rec/next";
        console.log(next);
        fetch(request, next)
            .then((response) => response.json())
            .then((data) => {
                console.log("Logged?", data)
                if (data.movie_id) {
                    console.log("success")
                    this.setState({sliderValue: data.avg_rating})
                    this.setState({avg_score: data.avg_rating})
                    this.setState({movie_id: data.movie_id})
                    this.getTmdbData();
                }
                else{
                    console.log("failed")
                }
            })
            .catch(error => console.log('Error:', error));
    }
    getCritic() {
        let request_body = {
            method: 'GET',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
        }
        const request = ApiUrl()+"/rec/critic";
        console.log(request);
        console.log(request_body);
        fetch(request, request_body)
            .then((response) => response.json())
            .then((data) => {
                console.log("Logged?", data)
                if (data) {
                    console.log("success")
                    this.setState({critic: data.critic_id})
                    this.setState({matches: data.matches})
                    this.fillMatchesData();
                }
                else{
                    console.log("failed")
                }
            })
            .catch(error => console.log('Error:', error));
    }
    fillMatchesData() {
        console.log("called fill review data");
        this.state.matches.forEach((element) => {
            const request = TmdbUrl+element.movie_id+TmdbKey;
            console.log(request);
            fetch(request)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    element.data = data;
                    this.forceUpdate();
                    console.log("FILLING DATA HERE", element);
                })
                .catch(error => console.log('Error:', error));
        });
    }
    getTmdbData() {
        console.log("getting tmdb data");
        const request = TmdbUrl+this.state.movie_id+TmdbKey;
        console.log(request);
        fetch(request)
            .then(response => response.json())
            .then(data => {
                this.setState({data: data})
                console.log(data)
            })
            .catch(error => console.log('Error:', error));
    }
    rate() {
        let rate = {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
        }
        const request = ApiUrl()+"/rating/?movie_id="+this.state.movie_id+"&rating="+this.state.sliderValue;
        console.log(request);
        console.log(rate);
        fetch(request, rate)
            .then((response) => response.json())
            .then((data) => {
                console.log("Logged?", data)
                if (data) {
                    console.log("success")
                    this.isCalibrated();
                }
                else{
                    console.log("failed")
                }
            })
            .catch(error => console.log('Error:', error));
    }
    skip() {
        console.log("Skipped...");
        let rate = {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
        }
        const request = ApiUrl()+"/rating/?movie_id="+this.state.movie_id+"&rating=-1";
        console.log(request);
        console.log(rate);
        fetch(request, rate)
            .then((response) => response.json())
            .then((data) => {
                console.log("Logged?", data)
                if (data) {
                    console.log("success")
                    this.isCalibrated();
                }
                else{
                    console.log("failed")
                }
            })
            .catch(error => console.log('Error:', error));
    }
    deleteRatings() {
        let request_body = {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
        }
        const request = ApiUrl()+"/clear_ratings/"
        console.log(request);
        console.log(request_body);
        fetch(request, request_body)
            .then((response) => response.json())
            .then((data) => {
                console.log("Logged?", data)
                if (data) {
                    console.log("success")
                    this.isCalibrated();
                }
                else{
                    console.log("failed")
                }
            })
            .catch(error => console.log('Error:', error));
    }
    register() {
        this.props.navigation.navigate("Register", {})
    }
    logged_in() {
        console.log("logged in?", (this.state.token && this.state.token !== ""));
        return (this.state.token && this.state.token !== "");
    }
    componentDidUpdate() {
        if (this.logged_in())
            return;
        if ((!this.state.token) && this.props.route.params && this.props.route.params.token_from_creation) {
            this.setState({token: this.props.route.params.token_from_creation});
            this.isCalibrated();
        }
    }
    handleChange(event, newValue) {
        this.setState({sliderValue: newValue});
    }
    render() {
        return (
            <div style={{height: "100vh", overflow: "auto"}}>
            { this.logged_in() ? 
            <View style={styles.center}>
                <img src={cinetrics} alt="Cinetrics" style={{maxWidth: "20%", margin: 25}}/>
                { console.log(this.state.matches) }
                { this.state.calibrated ?
                    // User has been calibrated
                    <div style={{textAlign: "center", maxWidth: "50%"}}>
                        <Text style={styles.sliderValue}>
                            Your critic match is:
                        </Text> <br /><br />
                        <Text style={styles.critic}>
                            {this.state.critic}
                        </Text> <br /><br />
                        <Text style={styles.sliderValue}>
                            You had similar ratings on the following movies
                        </Text>
                        <br />
                        <hr />
                        <div> { 
                            this.state.matches.map(element => (
                                <View>
                                    <View style={styles.card}>
                                        <View style={styles.center}>
                                        { element.data !== undefined ?
                                            <div>
                                                <img src={TmdbImageUrl+element.data.poster_path} alt="movie poster" style={{maxWidth: "50%", height: "auto", margin: 5, marginBottom: 25}} />
                                                <br />
                                                <Text style={styles.title}>
                                                    { element.data.title }
                                                </Text>
                                            <br />
                                            <br />
                                            </div>
                                            : <div></div> }
                                        <Text style={styles.score}>
                                            Reviewer Score: { element.critic_rating }
                                        </Text>
                                        <Text style={styles.score}>
                                            Your Score: { element.user_rating }
                                        </Text>
                                        </View>
                                        <br />
                                        <hr />
                                    </View>
                                </View>))
                        } </div>

                        <Button mode="contained" style={styles.downvote} onPress={() => this.deleteRatings()}>Clear Ratings</Button>
                    </div>
                :
                    // User has not finished calibrating
                    <div>
                        <View style={styles.card}>
                            <View style={styles.center}>
                        { this.state.data.poster_path ?
                            <img src={TmdbImageUrl+this.state.data.poster_path} alt="movie poster" style={{maxWidth: "90%", height: "auto", marginTop: 25, marginBottom: 25}} />
                            :
                            <img />
                        }
                                <Text style={styles.sliderValue}>
                                    Your Score: { this.state.sliderValue }
                                </Text>
                                <Text style={styles.averageValue}>
                                    Average Audience Score: { this.state.avg_score }
                                </Text>
                                <Grid container spacing={2}>
                                    <Grid item style={{ fontSize: "larger", width: 50, textAlign: "center"}}>
                                        0
                                    </Grid>
                                    <Grid item xs>
                                        <Slider value={this.state.sliderValue} onChange={(e, val) => this.handleChange(e, val)} step={1} aria-labelledby="continuous-slider" />
                                    </Grid>
                                    <Grid item style={{ fontSize: "larger", width: 50, textAlign: "center"}}>
                                        100
                                    </Grid>
                                </Grid>
                            </View>
                            <View style={{display: "-webkit-inline-box", alignItems: "center" }}>
                                <Button mode="contained" style={styles.downvote} onPress={() => this.skip()}>Skip</Button>
                                <Button mode="contained" style={styles.upvote} onPress={() => this.rate()}>Rate</Button>
                            </View>
                        </View>
                    </div>
                }
                <Button mode="contained" style={{margin: 10, width: 150, backgroundColor: "#2255AA"}} onPress={() => this.signOut()}>Sign out</Button>
            </View>
                :
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
                <Button mode="contained" style={{marginTop: 30, backgroundColor: "#FFBB00", margin: 10, width: 150}} onPress={() => this.signIn()}>Sign in</Button>
                <Button mode="contained" style={{margin: 10, width: 150, backgroundColor: "#6644EE"}} onPress={() => this.register()}>Register</Button>
                { this.state.failed_login ? <View style={styles.center}>
                    <Text style={{color: "#882222"}}>Authentication failed</Text>
                </View> : <Text></Text>}
            </View>
            }
            </div>
        );
    }
}
