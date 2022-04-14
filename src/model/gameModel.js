const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
};

const GameSchema = new Schema({
    game: reqStr,
    instruction: reqStr
});

const Game = model("Game ", GameSchema);

module.exports = Game;
