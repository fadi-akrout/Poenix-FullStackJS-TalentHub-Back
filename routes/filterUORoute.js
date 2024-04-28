const express = require("express");

const filterUOCtrl = require ("../controllers/filterUOController");

const filterUORoute = express.Router();

filterUORoute.get('/api/FilterStat', filterUOCtrl);

module.exports = filterUORoute;