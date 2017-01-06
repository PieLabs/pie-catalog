"use strict";
var express_1 = require("express");
var r = express_1.Router();
r.get('/', function (req, res) {
    res.send('api here...');
});
exports.__esModule = true;
exports["default"] = r;
