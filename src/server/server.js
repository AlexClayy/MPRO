import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import dotenv from 'dotenv';
import authenticationRouter from './routers/authentication.js'
import balanceRouter from './routers/balance.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorHandler.js'


import { createServer } from "http";
import { Server } from "socket.io";
import { Timer } from "easytimer.js";

/** Server Handling */
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

var NUMBER=0
var NUMBERS_1_12=1
var NUMBERS_2_12=2
var NUMBERS_3_12=3
var NUMBERS_1_18=4
var NUMBERS_19_36=5
var EVEN=6
var ODD=7
var RED=8
var BLACK=9
var DOUBLE_SPLIT=10
var QUAD_SPLIT=11
var TRIPLE_SPLIT=12
var EMPTY=13

var PLACE_BET=0
var NO_MORE_BETS=1
var WINNERS=2
var NONE=3
var timer = new Timer();
var users = new Map();
var gameData = {};
var usersData = {};
var wins = [];
timer.addEventListener('secondsUpdated', async function (e) {
    var currentSeconds = timer.getTimeValues().seconds;
    gameData.time_remaining = currentSeconds;
    if (currentSeconds == 1) {
        // console.log("Place bet");
        usersData = new Map();
        gameData.stage = PLACE_BET;
        wins = [];
        sendStageEvent(gameData);
    }
    else if (currentSeconds == 25) {
        gameData.stage = NO_MORE_BETS;
        gameData.value = getRandomNumberInt(0, 36);
        // console.log("No More Bets")
        sendStageEvent(gameData);
        for (var _i = 0, _a = Array.from(usersData.keys()); _i < _a.length; _i++) {
            var key = _a[_i];
            var username = users.get(key);
            console.log(username)
            if (username != undefined) {
                var chipsPlaced = usersData.get(key);
                var sumWon = calculateWinnings(gameData.value, chipsPlaced);
                wins.push({
                    username: username,
                    sum: sumWon
                });
            }
        }
    }
    else if (currentSeconds == 50) {
        // console.log("Winners")
        gameData.stage = WINNERS;
        // sort winners desc
        if (gameData.history == undefined) {
            gameData.history = [];
        }
        gameData.history.push(gameData.value);
        if (gameData.history.length > 10) {
            gameData.history.shift();
        }
        gameData.wins = wins.sort(function (a, b) { return b.sum - a.sum; });
        sendStageEvent(gameData);

    /////////////////////////////////////////////////////
        for (var _i = 0, _a = Array.from(usersData.keys()); _i < _a.length; _i++) {
            var key = _a[_i];
            var username = users.get(key);
            if (username != undefined) {
                var chipsPlaced = usersData.get(key);
                var sumWon = calculateWinnings(gameData.value, chipsPlaced);
                // await updateBalance(sumWon)
            }
        }
    }
    // console.log(gameData.stage)
});
io.on("connection", function (socket) {
    socket.on('enter', function (data) {
        users.set(socket.id, data);
        sendStageEvent(gameData);
    });
    socket.on('place-bet', function (data) {
        var gameData = JSON.parse(data);
        usersData.set(socket.id, gameData);
    });
    socket.on("disconnect", function (reason) {
        users["delete"](socket.id);
        usersData["delete"](socket.id);
    });
});
httpServer.listen(8000, function () {
    console.log("Server is running on port 8000");
    timer.start({ precision: 'seconds' });
});
function getRandomNumberInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sendStageEvent(gameData) {
    var json = JSON.stringify(gameData);
    // console.log(json)
    io.emit('stage-change', json);
}
var blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35];
var redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
function calculateWinnings(winningNumber, placedChips) {
    var win = 0;
    var arrayLength = placedChips.length;
    for (var i = 0; i < arrayLength; i++) {
        var placedChip = placedChips[i];
        var placedChipType = placedChip.item.type;
        var placedChipValue = placedChip.item.value;
        var placedChipSum = placedChip.sum;
        if (placedChipType === NUMBER && placedChipValue === winningNumber) {
            win += placedChipSum * 36;
        }
        else if (placedChipType === BLACK && blackNumbers.includes(winningNumber)) { // if bet on black and win
            win += placedChipSum * 2;
        }
        else if (placedChipType === RED && redNumbers.includes(winningNumber)) { // if bet on red and win
            win += placedChipSum * 2;
        }
        else if (placedChipType === NUMBERS_1_18 && (winningNumber >= 1 && winningNumber <= 18)) { // if number is 1 to 18
            win += placedChipSum * 2;
        }
        else if (placedChipType === NUMBERS_19_36 && (winningNumber >= 19 && winningNumber <= 36)) { // if number is 19 to 36
            win += placedChipSum * 2;
        }
        else if (placedChipType === NUMBERS_1_12 && (winningNumber >= 1 && winningNumber <= 12)) { // if number is within range of row1
            win += placedChipSum * 3;
        }
        else if (placedChipType === NUMBERS_2_12 && (winningNumber >= 13 && winningNumber <= 24)) { // if number is within range of row2
            win += placedChipSum * 3;
        }
        else if (placedChipType === NUMBERS_3_12 && (winningNumber >= 25 && winningNumber <= 36)) { // if number is within range of row3
            win += placedChipSum * 3;
        }
        else if (placedChipType === EVEN || placedChipType === ODD) {
            if (winningNumber % 2 == 0) {
                // if number even
                win += placedChipSum * 2;
            }
            else {
                // if number is odd
                win += placedChipSum * 2;
            }
        }
    }
    return win;
}

dotenv.config();
const app = express();
const port = process.env.PORT || "5000";
const password = process.env.PASSWORD;
const connection_url = `mongodb://Gambit:1Sampai8@ac-ekau97n-shard-00-00.njdfpnu.mongodb.net:27017,ac-ekau97n-shard-00-01.njdfpnu.mongodb.net:27017,ac-ekau97n-shard-00-02.njdfpnu.mongodb.net:27017/Gambit?ssl=true&replicaSet=atlas-3zup1o-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Middlewares
app.use(Cors());
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authenticationRouter);
app.use('/balance', balanceRouter);
app.use(errorHandler);

// DB Config
mongoose.connect(connection_url,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    () => console.log("Connected to MongoDB Database."));

// API Endpoints
app.get('/', (req, res) => res.status(200).send('Connection verified.'));

// Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`))