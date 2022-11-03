const User = {
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: Boolean, default: false},
}

module.exports = User;


