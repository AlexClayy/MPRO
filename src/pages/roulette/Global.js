export let ValueType

(function(ValueType) {
  ValueType[(ValueType["NUMBER"] = 0)] = "NUMBER"
  ValueType[(ValueType["NUMBERS_1_12"] = 1)] = "NUMBERS_1_12"
  ValueType[(ValueType["NUMBERS_2_12"] = 2)] = "NUMBERS_2_12"
  ValueType[(ValueType["NUMBERS_3_12"] = 3)] = "NUMBERS_3_12"
  ValueType[(ValueType["NUMBERS_1_18"] = 4)] = "NUMBERS_1_18"
  ValueType[(ValueType["NUMBERS_19_36"] = 5)] = "NUMBERS_19_36"
  ValueType[(ValueType["EVEN"] = 6)] = "EVEN"
  ValueType[(ValueType["ODD"] = 7)] = "ODD"
  ValueType[(ValueType["RED"] = 8)] = "RED"
  ValueType[(ValueType["BLACK"] = 9)] = "BLACK"
  ValueType[(ValueType["DOUBLE_SPLIT"] = 10)] = "DOUBLE_SPLIT"
  ValueType[(ValueType["QUAD_SPLIT"] = 11)] = "QUAD_SPLIT"
  ValueType[(ValueType["TRIPLE_SPLIT"] = 12)] = "TRIPLE_SPLIT"
  ValueType[(ValueType["EMPTY"] = 13)] = "EMPTY"
})(ValueType || (ValueType = {}))

export let GameStages

(function(GameStages) {
  GameStages[(GameStages["PLACE_BET"] = 0)] = "PLACE_BET"
  GameStages[(GameStages["NO_MORE_BETS"] = 1)] = "NO_MORE_BETS"
  GameStages[(GameStages["WINNERS"] = 2)] = "WINNERS"
  GameStages[(GameStages["NONE"] = 3)] = "NONE"
})(GameStages || (GameStages = {}))
