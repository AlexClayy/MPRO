import React, { useState,useEffect } from 'react'
import Wheel from "./Wheel";
import Board from "./Board";
import { Button, Modal } from "antd";
// import { Button } from "@mantine/core";
import { GameStages } from "./Global";
import ProgressBarRound from "./ProgressBar";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import io from "socket.io-client"

// import { toast, ToastContainer } from "react-toastify";
var classNames = require("classnames");

function RouletteWrapper(props) {
  const rouletteWheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];

  const numberRef = React.createRef();
  
  var PLACE_BET=0
  var NO_MORE_BETS=1
  var WINNERS=2
  var NONE=3
  // const [rouletteData, setRouletteData] = useState(0)
  // const [chipsData, setChipsData] = useState(null)
  // const [number, setNumber] = useState(null)
  const [winners, setWinners] = useState([])
  const [history, setHistory] = useState([])
  const [stage, setStage] = useState(NONE)
  const [username, setUsername] = useState('')
  const [endTime, setEndTime] = useState(0)
  const [balance, setBalance] = useState(0)
  const [progressCountdown, setProgressCountdown] = useState(0)
  const [time_remaining, setTimeRemaining] = useState(0)

  const [rouletteData, setRouletteData] = useState({numbers: rouletteWheelNumbers})

  const [chipsData, setChipsData] = useState({selectedChip: null,placedChips: new Map()})
  const blackNumbers = [
    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35,
  ];
  const [number, setNumber] = useState({next: null,})
  const socketServer = io('http://localhost:8000');

    useEffect(() => {
    socketServer.open();
    socketServer.on("stage-change", (data) => {
      var gameData = JSON.parse(data);
      console.log(data)
      setGameData(gameData);
    });
    socketServer.on("connect", (socket) => {
      socketServer.emit("enter", props.username);
      });
      return () => {
        socketServer.close();
      };
    }, [props]);

  
  function setGameData(gameData) {
    if (gameData.stage === NO_MORE_BETS) {
      // PLACE BET from 25 to 35
      var endTime = 50;
      var nextNumber = gameData.value;
      // console.log(nextNumber)
      setEndTime(endTime)
      setProgressCountdown(endTime - gameData.time_remaining)
      setNumber({ next: nextNumber })
      setStage(gameData.stage)
      setTimeRemaining(gameData.time_remaining)
    } else if (gameData.stage === WINNERS) {
      // PLACE BET from 35 to 59
      var endTime = 75;
      if (gameData.wins.length > 0) {
      setEndTime(endTime)
      setProgressCountdown(endTime - gameData.time_remaining)
      setHistory(gameData.history)
      setWinners(gameData.wins)
      setStage(gameData.stage)
      setTimeRemaining(gameData.time_remaining)
      } else {
        setEndTime(endTime)
        setProgressCountdown(endTime - gameData.time_remaining)
        setHistory(gameData.history)
        setStage(gameData.stage)
        setTimeRemaining(gameData.time_remaining)
      }
    } else {
      // PLACE BET from 0 to 25
      var endTime = 25;
      setEndTime(endTime)
      setProgressCountdown(endTime - gameData.time_remaining)
      setStage(gameData.stage)
      setTimeRemaining(gameData.time_remaining)
    }
  }

  const onCellClick = item => {
    //// console.log("----");
    // console.log(this.state.winners)
    var currentChips = chipsData.placedChips;

    var chipValue = chipsData.selectedChip;
    if (chipValue === 0 || chipValue === null) {
      return;
    }
    const currentChip = {};
    currentChip.item = item;
    currentChip.sum = chipValue;
    if (currentChips.get(item) !== undefined) {
      currentChip.sum += currentChips.get(item).sum;
    }
    currentChips.set(item, currentChip);
    setChipsData({...chipsData, placedChips: currentChips})

    // if (currentChip.sum > balance) {
    // //   toast.error("Balance Insuficcient!!", {
    // //     position: toast.POSITION.TOP_CENTER,
    // //   });
    // } else {
    //   setBalance(balance -= currentChip.sum)

      
    // }

    // console.log(currentChips[]);
  }

  function onChipClick(chip) {
    if (chip != null) {
      setChipsData({...chipsData, selectedChip: chip})
    }
  }

  function getChipClasses(chip) {
    var cellClass = classNames({
      chip_selected: chip === chipsData.selectedChip,
      "chip-100": chip === 100,
      "chip-20": chip === 20,
      "chip-10": chip === 10,
      "chip-5": chip === 5,
    });
    return cellClass
  }
  function onSpinClick() {
    var nextNumber = numberRef.current.value;
    if (nextNumber != null) {
      setNumber({ next: nextNumber });
    }
  }
  function placeBet() {
    var placedChipsMap = chipsData.placedChips;
    var chips = new Array();
    for (let key of Array.from(placedChipsMap.keys())) {
      var chipsPlaced = placedChipsMap.get(key);
      // console.log(chipsPlaced);
      // console.log(chipsPlaced.sum);
      chips.push(chipsPlaced);
    }
    socketServer.emit("place-bet", JSON.stringify(chips));
  }
 function check() {
  // console.log(chipsData)
  // console.log({selectedChip: 0, placedChips: new Map()})
  //   var placedChipsMap = chipsData.placedChips;
  //   var chips = new Array();
  //   for (let key of Array.from(placedChipsMap.keys())) {
  //     var chipsPlaced = placedChipsMap.get(key);
  //     // console.log(chipsPlaced);
  //     // const test = [chipsPlaced.sum]
  //     // const tes2 = test.filter(function (a) {

  //     // })
  //     // console.log(test);
  //     // chips.push(chipsPlaced);
  //   }
  //  socketServer.emit("place-bet", JSON.stringify(chips));
  }

  async function clearBet() {
    setChipsData({...chipsData,placedChips: new Map()})
    // placeBet();
    // await axios.get("http://localhost:5000/balance/current", {data: { username: this.state.username },}).then((res) => 
    // {
    //   const blnc = res.data.user.balance;
    //   setBalance(blnc)
    //   });
  }

  return (
    <div>
      <div>
        <table className={"rouletteWheelWrapper"}>
          <tr>
            <td className={"winnersBoard"}>
              <div className={"winnerItemHeader hideElementsTest"}>
                WINNERS
              </div>
              {/* <ToastContainer /> */}
              {winners.map((entry, index) => {
                return (
                  <div className="winnerItem">
                    {index + 1}. {entry.username} won {entry.sum}${" "}
                  </div>
                );
              })}
            </td>
            <td>
              <Wheel
                rouletteData={rouletteData}
                number={number}
              />
            </td>
            <td>
              <div className={"winnerHistory hideElementsTest"}>
                {history.map((entry, index) => {
                  if (entry === 0) {
                    return <div className="green">{entry}</div>;
                  } else if (blackNumbers.includes(entry)) {
                    return <div className="black">{entry}</div>;
                  } else {
                    return <div className="red">{entry}</div>;
                  }
                })}
              </div>
            </td>
          </tr>
        </table>
        <Board
          onCellClick={onCellClick}
          chipsData={chipsData}
          rouletteData={rouletteData}
        />
      </div>
      <div className={"progressBar hideElementsTest"}>
        <ProgressBarRound
          stage={stage}
          maxDuration={endTime}
          currentDuration={time_remaining}
        />
      </div>
      {/* <div>
      <h2>Updated: {this.state.number.next}</h2>
        <input className={"number"} ref={this.numberRef} />
        <button className={"spin"} onClick={this.onSpinClick}>
          Spin
        </button>
      </div> */}
      <div className="roulette-actions hideElementsTest">
        <ul className="Chipss">
          <li>
            <Button
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
              size="xl"
              onClick={() => clearBet()}
            >
              Clear Bet
            </Button>
          </li>
          <li className={"board-chip"}>
            <div
              key={"chip_100"}
              className={getChipClasses(100)}
              onClick={() => onChipClick(100)}
            >
              100
            </div>
          </li>
          <li className={"board-chip"}>
            <span key={"chip_20"}>
              <div
                className={getChipClasses(20)}
                onClick={() => onChipClick(20)}
              >
                20
              </div>
            </span>
          </li>
          <li className={"board-chip"}>
            <span key={"chip_10"}>
              <div
                className={getChipClasses(10)}
                onClick={() => onChipClick(10)}
              >
                10
              </div>
            </span>
          </li>
          <li className={"board-chip"}>
            <span key={"chip_5"}>
              <div
                className={getChipClasses(5)}
                onClick={() => onChipClick(5)}
              >
                5
              </div>
            </span>
          </li>
          <li>
            <Button
              disabled={
                stage === PLACE_BET ? false : true
              }
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              size="xl"
              onClick={() => placeBet()}
            >
              Place Bet
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              size="xl"
              onClick={() => check()}
            >
              Check
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default RouletteWrapper;
