import React, { useState, useEffect } from "react";
import Wheel from "./Wheel";
import Board from "./Board";
import { Button, Modal } from "antd";
// import { GameStages } from "./Global";
import { Timer } from "easytimer.js";
import { io } from "socket.io-client";
import ProgressBarRound from "./ProgressBar";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
import updateBalance from "../../helpers/updateBalance.js";
import { useUser } from "../contexts/user-context";
import validUser from '../../helpers/validUser';

var classNames = require("classnames");

// const singleRotation = 0;

// const r1 = singleRotation * 0 // 0
// const r2 = singleRotation * 2 // 19.45..

function RouletteWrapper(props) {
  const { user, setUser } = useUser();
  const PLACE_BET=0
  const NO_MORE_BETS=1
  const WINNERS=2
  const NONE=3
  const [winners, setWinners] = useState([]);
  const [history, setHistory] = useState([]);
  const [stage, setStage] = useState(NONE);
  let [betAmount, setBetAmount] = useState(0);
  //   const [clearBet, setClearBet] = useState(false);
  const [endTime, setEndTime] = useState(0);
  const [progressCountdown, setProgressCountdown] = useState(0);
  const [time_remaining, setTime_remaining] = useState(0);
  const [winnings, setWinnings] = useState(0);
  const timer = new Timer();
  const [rouletteData, setRouletteData] = useState({
    numbers: [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
      24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
    ],
  });
  const [chipsData, setChipsData] = useState({
    selectedChip: null,
    placedChips: new Map(),
  });
  const [number, setNumber] = useState({
    next: null,
  });
  const blackNumbers = [
    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35,
  ];
  const numberRef = React.createRef();
  const socketServer = io("http://localhost:8000");
  // const username = user.username
  // let balance = user.balance
  
  useEffect(() => {
    socketServer.open();
    socketServer.on("stage-change", (data) => {
      var gameData = JSON.parse(data);
      setGameData(gameData);
    });
    socketServer.on("connect", (socket) => {
    socketServer.emit("enter", props.username);
    });
    return () => {
      socketServer.close();
    };
  }, [props]);

  async function setGameData(gameData) {
    if (gameData.stage === NO_MORE_BETS) {
      // PLACE BET from 25 to 35
      var endTime = 50;
      var nextNumber = gameData.value;
      setEndTime(endTime);
      setProgressCountdown(endTime - gameData.time_remaining);
      setNumber({ next: nextNumber });
      setStage(gameData.stage);
      setTime_remaining(gameData.time_remaining);
      // clearBet(true);
    } else if (gameData.stage === WINNERS) {
      // PLACE BET from 35 to 59
      var endTime = 75;
      if (gameData.wins.length > 0) {
        setEndTime(endTime);
        setProgressCountdown(endTime - gameData.time_remaining);
        setWinners(gameData.wins);
        setStage(gameData.stage);
        setTime_remaining(gameData.time_remaining);
        setHistory(gameData.history);


      } else {
        setEndTime(endTime);
        setProgressCountdown(endTime - gameData.time_remaining);
        setStage(gameData.stage);
        setTime_remaining(gameData.time_remaining);
        setHistory(gameData.history);
      }
    } else {
      // PLACE BET from 0 to 25
      var endTime = 25;
      setEndTime(endTime);
      setProgressCountdown(endTime - gameData.time_remaining);
      setStage(gameData.stage);
      setTime_remaining(gameData.time_remaining);
      // clearBet(false);
      // setChipsData({
      //   selectedChip: chipsData.selectedChip,
      //   placedChips: new Map(),
      // });
    }
  }

  const onCellClick = (item) => {
    var currentChips = chipsData.placedChips;
    var chipValue = chipsData.selectedChip;
    if (chipValue === 0 || chipValue === null) {
      return;
    }
    let currentChip = {};
    currentChip.item = item;
    currentChip.sum = chipValue;

    // if (betAmount > balance) {
    //   console.log('Error balance kurang')
    // } else {
      setBetAmount(prevBalance => prevBalance += chipValue)
      if (currentChips.get(item) !== undefined) {
        currentChip.sum += currentChips.get(item).sum;
      }
      currentChips.set(item, currentChip);
      setChipsData({
        selectedChip: chipsData.selectedChip,
        placedChips: currentChips,
      })
    // }
  };

  const check = async () => {
    console.log('This is betAmount:',betAmount)
    console.log(props.username)
    // console.log('This is balance:',balance)
  }
  
  const onChipClick = (chip) => {
    if (chip != null) {
      setChipsData({
        selectedChip: chip,
        placedChips: chipsData.placedChips,
      });
    }
  };

  const getChipClasses = (chip) => {
    var cellClass = classNames({
      chip_selected: chip === chipsData.selectedChip,
      "chip-100": chip === 100,
      "chip-20": chip === 20,
      "chip-10": chip === 10,
      "chip-5": chip === 5,
    });
    return cellClass;
  };

  const onSpinClick = () => {
    var nextNumber = number.next;
    if (nextNumber != null) {
      setNumber({ next: nextNumber });
    }
  };

  const placeBet = async () => {
    // clearBet(true);
    var placedChipsMap = chipsData.placedChips;
    var chips = new Array();
    for (let key of Array.from(placedChipsMap.keys())) {
      var chipsPlaced = placedChipsMap.get(key);
      chips.push(chipsPlaced);
    }
    socketServer.emit("place-bet", JSON.stringify(chips));
    // let currentTotal = props.balance - balance;
    // await updateBalance(-currentTotal);
  };
  const clearBet = async () => {
    setChipsData({
      placedChips: new Map(),
    });
    setBetAmount(0)
    var cpis = new Array();
    cpis.push({ item: { type: 9 }, sum: 0 });
    socketServer.emit("place-bet", JSON.stringify(cpis));
  };
  return (
    <div>
      <div>
        <table className={"rouletteWheelWrapper"}>
          <tr>
            <td className={"winnersBoard"}>
              <div className={"winnerItemHeader hideElementsTest"}>
                BALANCE: {props.balance}
              </div>
              <div className={"winnerItemHeader hideElementsTest"}>WINNERS</div>
              {winners.map((entry, index) => {
                return (
                  <div className="winnerItem">
                    <marquee>
                      {index + 1}.{" "}
                      {entry.username.slice(0, 6) +
                        "..." +
                        entry.username.slice(-4)}{" "}
                      won {entry.sum}$
                    </marquee>
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
      <h2>Updated: {state.number.next}</h2>
        <input className={"number"} ref={numberRef} />
        <button className={"spin"} onClick={onSpinClick}>
          Spin
        </button>
      </div> */}
      <div className="roulette-actions hideElementsTest">
        <ul className="Chipss">
          <li>
            <Button
            //   disabled={clearBet}
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
              size="xl"
              onClick={() => clearBet()}
            >
              Clear Bet
            </Button>
            <Button
            //   disabled={clearBet}
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
              size="xl"
              onClick={() => check()}
            >
              Check
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
            //   disabled={this.state.clearBet}
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              size="xl"
              onClick={() => placeBet()}
            >
              Place Bet
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RouletteWrapper