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
const playerRef = ref(db, "players");
const newPlayerRef = push(playerRef);
const LeaderboardRef = push(ref(db, "leaderboards"));
const leaderboardQuery = query(playerRef, orderByChild('wanderCoin'));

const auth = getAuth();

var uid;

const products = [
    {id: 1, name: '$5 eCapitaVoucher', price: 20},
    {id: 2, name: '$10 eCapitaVoucher', price: 35},
    {id: 3, name: '$50 eCapitaVoucher', price: 50},
];
    
const btnSignup = document.getElementById("registerbtn");  
const loginBtn = document.getElementById("loginBtn");

var wanderCoinDisplay = document.getElementById("wanderCoins");
var username = document.getElementById("username");

const leaderboard = document.getElementById("leaderboard");

const tier1 = document.getElementById("20");
const tier2 = document.getElementById("35");
const tier3 = document.getElementById("170");

onAuthStateChanged(auth, (user) => {
    if(user){
        console.log(user);
        uid = user.uid;
        console.log("current logged in user " + uid)
    } else{
        console.log("Signed out");
    }
})

if(btnSignup){
    btnSignup.addEventListener("click", function(e){
        e.preventDefault();
        let email = document.getElementById("email").value;
        let password = document.getElementById("create_password").value;
        createUser(email, password);
        console.log("email" + email + "password" + password);
    }           
)}else{

}

if(loginBtn){
    loginBtn.addEventListener("click", function(e){
        e.preventDefault();
        let email = document.getElementById("login_email").value;
        let password = document.getElementById("login_password").value;
        signInUser(email, password);
        console.log("email" + email + "password" + password);
    }           
)}else{

}


if(window.location.pathname == "/webpages/giftshop.html"){
    tier1.addEventListener("click", function(e){
        e.preventDefault();
        buyItem(20);
    })
    tier2.addEventListener("click", function(e){
        e.preventDefault();
        buyItem(35);
    })
    tier3.addEventListener("click", function(e){
        e.preventDefault();
        buyItem(170);
    })
}


    
function createUser(email, password){
    console.log("creating the user");
    createUserWithEmailAndPassword(auth, email, password).then((userCredential)=>{
        const userId = userCredential.user.uid;

        let newPlayer = new PlayerData(email, document.getElementById("username").value, userId, 0);

        set(newPlayerRef, newPlayer).then(() => {
            console.log('Data set successfully');
            window.location.href = "/webpages/home.html";
          })
          .catch((error) => {
            console.error('Error setting data:', error);
          });

        console.log("created user..." + JSON.stringify(userCredential));
        console.log("User is now signed in");

    }).catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`)
    });
}

function signInUser(email, password){
    signInWithEmailAndPassword(auth, email, password).then((userCredential)=>{
        const user = userCredential.user;
        window.location.href = "/webpages/home.html";

    }).catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`)
    });
}

if(wanderCoinDisplay){
    retrieveWanderCoins()
}

if(username){
    retrieveUsername()
}


function retrieveWanderCoins(){
    get(playerRef).then((snapshot)=>{
        if(snapshot.exists()){
            try{
                var content = "";
                snapshot.forEach((childSnapshot)=>{
                    console.log("GetPlayerData: childKey " + childSnapshot.key);
                    console.log(childSnapshot.val().uuid);
                    if(childSnapshot.val().uuid == auth.currentUser.uid){
                        wanderCoinDisplay.innerHTML = String(childSnapshot.val().wanderCoin);
                    }
                });
            }catch(error){
                console.log("error getPlayerData" + error);
            }
        }
    });
}

function retrieveUsername(){
    get(playerRef).then((snapshot)=>{
        if(snapshot.exists()){
            try{
                var content = "";
                snapshot.forEach((childSnapshot)=>{
                    console.log("GetPlayerData: childKey " + childSnapshot.key);
                    console.log(childSnapshot.val().uuid);
                    if(childSnapshot.val().uuid == auth.currentUser.uid){
                        username.innerHTML = childSnapshot.val().username;
                    }
                });
            }catch(error){
                console.log("error getPlayerData" + error);
            }
        }
    });
}

onValue(playerRef, (snapshot) => {
    if(wanderCoinDisplay){
        retrieveWanderCoins()
    } else if(leaderboard){
        updateLeaderboard();
    } else {

    }
});

function buyItem(cost){
    get(playerRef).then((snapshot)=>{
        if(snapshot.exists()){
            try{
                var content = "";
                snapshot.forEach((childSnapshot)=>{
                    console.log("GetPlayerData: childKey " + childSnapshot.key);
                    console.log(childSnapshot.val().uuid);
                    if(childSnapshot.val().uuid == auth.currentUser.uid){
                        console.log('true');
                        const newWanderCoin = childSnapshot.val().wanderCoin - cost;
                        const updates = {};
                        updates['wanderCoin'] = newWanderCoin;

                        set(ref(db, `players/${childSnapshot.key}/wanderCoin`), newWanderCoin)
                    }
                });
            }catch(error){
                console.log("error getPlayerData" + error);
            }
        }
    });
}

function updateLeaderboardTable(snapshot){
    const leaderboardTableBody = document.getElementById('leaderboard');
    leaderboardTableBody.innerHTML = '';

    const data = [];
    snapshot.forEach((childSnapshot)=>{
        data.push(childSnapshot.val());
    });

    data.sort((a, b) => a.score - b.score);

    const reversedData = data.reverse();

    let rank = 1;
    reversedData.every((rowData) => {
        const row = `<tr><td id="winner">${rank}</td><td><p>${rowData.username}</p></td><td>${rowData.wanderCoin}</td></tr>`;
        leaderboardTableBody.innerHTML += row;
        rank++;
        if(rank >= 6){
            return false;
        }
        return true;
    })
}

if(leaderboard){
    updateLeaderboard();
}

function updateLeaderboard(){
    get(leaderboardQuery).then((snapshot) => {
        updateLeaderboardTable(snapshot);
     }).catch((error) => {
       console.error('Error fetching data:', error);
     });
}


function PlayerData(email, username, uuid, wanderCoins) {
    this.email = email;
    this.username = username;
    this.uuid = uuid;
    this.wanderCoin = wanderCoins;
}

// function Leaderboard(username){
//     this.username = username;
//     this.highscores = [0, 0, 0];
// }