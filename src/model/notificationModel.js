const { Schema, model } = require("mongoose");

const notif = new Schema({
    emails: []
});

// INSTANCE METHODS

notif.methods.subscribe = function(email){
    this.emails.push(email)
}

module.exports = model("Newsletter", notif);