const {Schema, model} = require('mongoose');

const AdminSchema = new Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    rol:{
        type: String,
        default: "admin"
    }
},{
    timestamps: true
});

module.exports = model(
    "Admin",
    AdminSchema,
    "admin"
)