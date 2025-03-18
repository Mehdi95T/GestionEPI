"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControleStatus = exports.EPIType = void 0;
var EPIType;
(function (EPIType) {
    EPIType["CORDE"] = "CORDE";
    EPIType["SANGLE"] = "SANGLE";
    EPIType["LONGE"] = "LONGE";
    EPIType["BAUDRIER"] = "BAUDRIER";
    EPIType["CASQUE"] = "CASQUE";
    EPIType["MOUSQUETON"] = "MOUSQUETON";
})(EPIType || (exports.EPIType = EPIType = {}));
var ControleStatus;
(function (ControleStatus) {
    ControleStatus["OPERATIONNEL"] = "OPERATIONNEL";
    ControleStatus["A_REPARER"] = "A_REPARER";
    ControleStatus["MIS_AU_REBUT"] = "MIS_AU_REBUT";
})(ControleStatus || (exports.ControleStatus = ControleStatus = {}));
