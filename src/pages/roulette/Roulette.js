import React, { useState } from 'react'
import Wheel from "./Wheel";
import Board from "./Board";
import { Button, Modal } from "antd";
import { GameStages } from "./Global";
import { Timer } from "easytimer.js";
import { io } from "socket.io-client";
import ProgressBarRound from "./ProgressBar";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import updateBalance from '../../helpers/updateBalance.js'
import { useUser } from '../contexts/user-context'
var classNames = require("classnames");

// var singleRotation = 0

// var r1 = singleRotation * 0 // 0
// var r2 = singleRotation * 2 // 19.45..

class RouletteWrapper extends React.Component {
  rouletteWheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];

  timer = new Timer();
  numberRef = React.createRef();
  state = {
    rouletteData: {
      numbers: this.rouletteWheelNumbers,
    },
    chipsData: {
      selectedChip: null,
      placedChips: new Map(),
    },
    number: {
      next: null,
    },
    winners: [],
    history: [],
    stage: GameStages.NONE,
    clearBet: false,
    username: "",
    balance: 0, //state
    endTime: 0,
    progressCountdown: 0,
    time_remaining: 0,
    winnigs: 0,
    betAmount: 0
  };
  blackNumbers = [
    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35,
  ];
  constructor(props) {
    super(props);
    // this.state.balance = this.props.balance;
    this.onSpinClick = this.onSpinClick.bind(this);
    this.onChipClick = this.onChipClick.bind(this);
    this.getChipClasses = this.getChipClasses.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.placeBet = this.placeBet.bind(this);
    this.clearBet = this.clearBet.bind(this);

    this.socketServer = io("http://localhost:8000");
  }

  componentDidMount() {
    this.socketServer.open();
    this.socketServer.on("stage-change", (data) => {
      var gameData = JSON.parse(data);
      // console.log(data)
      this.setGameData(gameData);
    });
    this.socketServer.on("connect", (socket) => {
      // console.log("hereee2");
      this.setState({ username: this.props.username, balance: this.props.balance }, () => {
        this.socketServer.emit("enter", this.props.username);
      });
    });
  }
  componentWillUnmount() {
    this.socketServer.close();
  }
  async setGameData(gameData) {
    if (gameData.stage === GameStages.NO_MORE_BETS) {
      // PLACE BET from 25 to 35
      var endTime = 50;
      var nextNumber = gameData.value;
      // console.log(nextNumber)
      this.setState({
        endTime: endTime,
        progressCountdown: endTime - gameData.time_remaining,
        number: { next: nextNumber },
        stage: gameData.stage,
        time_remaining: gameData.time_remaining,
        clearBet: true
      });
    } else if (gameData.stage === GameStages.WINNERS) {
      // PLACE BET from 35 to 59
      var endTime = 75;
      if (gameData.wins.length > 0) {
        this.setState({
          endTime: endTime,
          progressCountdown: endTime - gameData.time_remaining,
          winners: gameData.wins,
          stage: gameData.stage,
          time_remaining: gameData.time_remaining,
          history: gameData.history,
        });

        // {this.state.winners.map(async (entry, index) => {
        //   if (entry.sum > 0) {
        //     await updateBalance(entry.sum)
        //     this.setState({
        //       balance: this.state.balance + entry.sum
        //     })
        //     entry.sum = 0
        //   } else {
        //     this.setState({
        //       chipsData: {
        //         placedChips: new Map()
        //       }
        //     })
        //   }
        // })}
      } else {
        this.setState({
          endTime: endTime,
          progressCountdown: endTime - gameData.time_remaining,
          stage: gameData.stage,
          time_remaining: gameData.time_remaining,
          history: gameData.history,
        });
      }
    } else {
      // PLACE BET from 0 to 25
      var endTime = 25;
      this.setState({
        endTime: endTime,
        progressCountdown: endTime - gameData.time_remaining,
        stage: gameData.stage,
        time_remaining: gameData.time_remaining,
        clearBet: false,
        chipsData: {
          placedChips: new Map()
        },
        balance: this.props.balance
      });
    }
  }
  async totalBet(value){
    this.setState((prevState) => ({
      betAmount: prevState.betAmount += value
    }));
  }
  onCellClick(item) {
    //// console.log("----");
    var currentChips = this.state.chipsData.placedChips;

    var chipValue = this.state.chipsData.selectedChip;
    if (chipValue === 0 || chipValue === null) {
      return;
    }
    let currentChip = {};
    currentChip.item = item;
    currentChip.sum = chipValue;
    this.totalBet(chipValue)
    console.log(this.state.betAmount)


    if (currentChip.sum > this.state.balance) {
    } else {
      this.setState({ balance: (this.state.balance -= currentChip.sum) });

      if (currentChips.get(item) !== undefined) {
        currentChip.sum += currentChips.get(item).sum;
      }
      currentChips.set(item, currentChip);
      this.setState({
        chipsData: {
          selectedChip: this.state.chipsData.selectedChip,
          placedChips: currentChips,
        },
      });
    }
  }
  
  onChipClick(chip) {
    console.log(chip)
    if (chip != null) {
      this.setState({
        chipsData: {
          selectedChip: chip,
          placedChips: this.state.chipsData.placedChips,
        },
      });
    }
  }

  getChipClasses(chip) {
    var cellClass = classNames({
      chip_selected: chip === this.state.chipsData.selectedChip,
      "chip-100": chip === 100,
      "chip-20": chip === 20,
      "chip-10": chip === 10,
      "chip-5": chip === 5,
    });

    return cellClass;
  }
  onSpinClick() {
    var nextNumber = this.numberRef.current.value;
    if (nextNumber != null) {
      this.setState({ number: { next: nextNumber } });
    }
  }
  async placeBet() {
    this.setState({
      clearBet: true
    })
    var placedChipsMap = this.state.chipsData.placedChips;
    var chips = new Array();
    for (let key of Array.from(placedChipsMap.keys())) {
      var chipsPlaced = placedChipsMap.get(key);
      chips.push(chipsPlaced);
    }
    this.socketServer.emit("place-bet", JSON.stringify(chips));
    let currentTotal = this.props.balance - this.state.balance
  }

  async clearBet() {
    this.setState({
      chipsData: {
        placedChips: new Map(),
      },
      balance: this.props.balance
    });

    var cpis = new Array();
    cpis.push({"item":{"type":9},"sum":10})
    this.socketServer.emit("place-bet", JSON.stringify(cpis));
  }

  render() {
    return (
      <div>
        <div>
          <table className={"rouletteWheelWrapper"}>
            <tr>
              <td className={"winnersBoard"}>
                <div className={"winnerItemHeader hideElementsTest"}>
                  BALANCE: {this.state.balance}
                </div>
                <div className={"winnerItemHeader hideElementsTest"}>
                  WINNERS
                </div>
                {this.state.winners.map((entry, index) => {
                  return (
                    <div className="winnerItem">
                      <marquee>{index + 1}. {entry.username.slice(0, 6) + '...' + entry.username.slice(-4)} won {entry.sum}$</marquee>
                    </div>
                  );
                })}
              </td>
              <td>
                <Wheel
                  rouletteData={this.state.rouletteData}
                  number={this.state.number}
                />
              </td>
              <td>
                <div className={"winnerHistory hideElementsTest"}>
                  {this.state.history.map((entry, index) => {
                    if (entry === 0) {
                      return <div className="green">{entry}</div>;
                    } else if (this.blackNumbers.includes(entry)) {
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
            onCellClick={this.onCellClick}
            chipsData={this.state.chipsData}
            rouletteData={this.state.rouletteData}
          />
        </div>
        <div className={"progressBar hideElementsTest"}>
          <ProgressBarRound
            stage={this.state.stage}
            maxDuration={this.state.endTime}
            currentDuration={this.state.time_remaining}
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
              <Button disabled={this.state.clearBet}
                variant="gradient"
                gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
                size="xl"
                onClick={() => this.clearBet()}
              >
                Clear Bet
              </Button>
            </li>
            <li className={"board-chip"}>
              <div
                key={"chip_100"}
                className={this.getChipClasses(100)}
                onClick={() => this.onChipClick(100)}
              >
                100
              </div>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_20"}>
                <div
                  className={this.getChipClasses(20)}
                  onClick={() => this.onChipClick(20)}
                >
                  20
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_10"}>
                <div
                  className={this.getChipClasses(10)}
                  onClick={() => this.onChipClick(10)}
                >
                  10
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_5"}>
                <div
                  className={this.getChipClasses(5)}
                  onClick={() => this.onChipClick(5)}
                >
                  5
                </div>
              </span>
            </li>
            <li>
              <Button
                disabled={this.state.clearBet}
                variant="gradient"
                gradient={{ from: "orange", to: "red" }}
                size="xl"
                onClick={() => this.placeBet()}
              >
                Place Bet
              </Button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default RouletteWrapper;
