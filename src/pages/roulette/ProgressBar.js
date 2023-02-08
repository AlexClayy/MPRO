import anime from "animejs"
import React from "react"
import { useEffect } from "react"
// import { GameStages } from "./Global"

const ProgressBarRound = props => {
  var PLACE_BET=0
  var NO_MORE_BETS=1
  var WINNERS=2
  var NONE=3
  useEffect(() => {
    //console.log("stage : " + props.stage)
    //console.log("maxDuration : " + props.maxDuration)
    //console.log("currentDuration : " + props.currentDuration)
    var duration = (props.maxDuration - props.currentDuration) * 1000
    //console.log(duration);
    anime({
      targets: "progress",
      value: [0, 100],
      easing: "linear",
      autoplay: true,
      duration: duration
    })
  }, [props.stage, props.maxDuration, props.currentDuration])
  return (
    <div>
      <div className="progressRoundTitle">
        {props.stage === PLACE_BET
          ? "PLACE BET"
          : props.stage === WINNERS
          ? " WINNERS"
          : "NO MORE BETS"}
      </div>
      <progress className={"linearProgressRounds"} value="0" max="100" />
    </div>
  )
}

export default ProgressBarRound
