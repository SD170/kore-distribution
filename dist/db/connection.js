"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongouser = process.env.MONGOUSER;
        const mongopassword = process.env.MONGOPASSWORD;
        const mongohost = process.env.MONGOHOST;
        const mongoport = process.env.MONGOPORT;
        const databasename = process.env.DATABASENAME;
        if (mongohost == "localhost") {
            let mongoString = "mongodb://" + mongohost + ":" + mongoport + "/" + databasename;
            const conn = yield mongoose_1.default.connect(mongoString);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
        else {
            let mongoString = "mongodb+srv://" +
                mongouser +
                ":" +
                encodeURIComponent(mongopassword) +
                "@" +
                mongohost +
                "/" +
                databasename +
                "?retryWrites=true&w=majority";
            const conn = yield mongoose_1.default.connect(mongoString);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    }
    catch (err) {
        console.error(err, "Error");
    }
});
exports.default = connectDB;
