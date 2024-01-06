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
const playerRef = push(ref(db, "players"));
const LeaderboardRef = push(ref(db, "leaderboards"));
              
var uid = auth.currentUser.uid;

var wanderCoin;
var username;

RetrieveSave();

function RetrieveSave(){
    get(playerRef).then((snapshot)=>{
        if(snapshot.exists()){
            try{
                var content = "";
                snapshot.forEach((childSnapshot)=>{
                    console.log("GetPlayerData: childKey " + childSnapshot.key);

                    if(childSnapshot.uuid == auth.currentUser.uid){
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