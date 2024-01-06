// Import the functions you need from the SDKs you need
    
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    
import {getDatabase, push, ref, child, get, set, onValue, orderByChild, orderByValue, query, equalTo, startAt, startAfter, endAt, endBefore, limitToFirst, limitToLast} from "https:///www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
        
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updateEmail, updatePassword} from "https:///www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
            
// TODO: Add SDKs for Firebase products that you want to use
            
// https://firebase.google.com/docs/web/setup#available-libraries
            
            
// Your web app's Firebase configuration
            
const firebaseConfig = {
            
    apiKey: "AIzaSyCrg8tuisf9okPgrRygx-0HQE5Y1um_Jew",
            
    authDomain: "wandering-the-little-red-dot.firebaseapp.com",
              
    databaseURL: "https://wandering-the-little-red-dot-default-rtdb.asia-southeast1.firebasedatabase.app",
              
    projectId: "wandering-the-little-red-dot",
              
    storageBucket: "wandering-the-little-red-dot.appspot.com",
              
    messagingSenderId: "1054078941548",
              
    appId: "1:1054078941548:web:a3bc69e25b01216eeedb49"
              
};
            
            
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();
const playerRef = ref(db, "players");
const newPlayerRef = push(playerRef);
const LeaderboardRef = push(ref(db, "leaderboards"));
              
var uid;

var wanderCoin;
    
let loginBtn = document.getElementById("loginBtn");
    
onAuthStateChanged(auth, (user) => {
    if(user){
        console.log(user);
        uid = user.uid;
    } else{
        console.log("Signed out");
    }
})
    
function signInUser(email, password){
    signInWithEmailAndPassword(auth, email, password).then((userCredential)=>{
        const user = userCredential.user;
        RetrieveSave();

                        
        window.location.replace("/index.html");
    }).catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`)
    });
}

function RetrieveSave(){
    get(playerRef).then((snapshot)=>{
        if(snapshot.exists()){
            try{
                var content = "";
                snapshot.forEach((childSnapshot)=>{
                    console.log("GetPlayerData: childKey " + childSnapshot.key);

                    if(childSnapshot.uuid == uid){
                        wanderCoin = childSnapshot.wanderCoin;
                        username = childSnapshot.username;
                    }
                });
            }catch(error){
                console.log("error getPlayerData" + error);
            }
        }
    });
}

function PlayerData(email, username, uuid, wanderCoins) {
    this.email = email;
    this.username = username;
    this.uuid = uuid;
    this.wanderCoin = wanderCoins;
}

function Leaderboard(username){
    this.username = username;
    this.highscores = [0, 0, 0];
}