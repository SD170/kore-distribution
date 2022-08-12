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
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
const OrderSchema = new mongoose_1.default.Schema({
    milkQuantity: {
        type: Number,
        required: [true, "Please add 'milkQuantity' in litre"],
    },
    status: {
        type: String,
        enum: ["placed", "packed", "dispatched", "delivered"],
        default: "placed"
    },
    orderLocation: {
        type: String,
    },
    // placedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: [true, "A user needs to place the order"],
    // },
    placedAt: {
        type: Date,
        default: Date.now,
    },
    placedAtLocal: {
        type: Date,
        default: Date.now,
    },
    timeOffset: {
        type: Number,
        select: false
    },
});
// Static method to get milk quanity left for the day
OrderSchema.statics.getRemainingQuantity = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const dailyLimit = parseInt(process.env.MAX_ORDER_PER_DAY) || 100; // in litre
        //this -> the model itself
        console.log(this);
        const remainingQuantityQ = this.aggregate([
            {
                $group: {
                    _id: {
                        $dayOfYear: '$placedAtLocal'
                    },
                    totalQuantityOrdered: {
                        $sum: '$milkQuantity'
                    }
                }
            }, {
                $project: {
                    quantityLeft: {
                        $subtract: [
                            dailyLimit, '$totalQuantityOrdered'
                        ]
                    }
                }
            }
        ]);
        try {
            const remainingQuantity = yield remainingQuantityQ;
            console.log(remainingQuantity);
            if (remainingQuantity.length === 0) {
                return dailyLimit;
            }
            return remainingQuantity[0].quantityLeft;
        }
        catch (err) {
            console.error(err);
            throw new ErrorResponse_1.default("Error finding remainingQuantity", 404);
        }
    });
};
OrderSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const remainingQuantity = yield this.constructor.getRemainingQuantity();
        if (remainingQuantity >= this.milkQuantity) {
            next();
        }
        else {
            throw new ErrorResponse_1.default(`Not enough milk left, remaining ${remainingQuantity} litre`, 400);
        }
    });
});
OrderSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        console.log((this._update));
        // @ts-ignore
        if (this._update.milkQuantity) {
            // @ts-ignore
            const getRemainingQuantityB = this.schema.statics.getRemainingQuantity.bind(this.model);
            const remainingQuantity = yield getRemainingQuantityB();
            // @ts-ignore
            if (remainingQuantity >= this._update.milkQuantity) {
                next();
            }
            else {
                throw new ErrorResponse_1.default(`Not enough milk left, remaining ${remainingQuantity} litre`, 400);
            }
        }
    });
});
// ref
// https://www.mongodb.com/docs/v3.2/tutorial/model-time-data/
OrderSchema.pre("save", function (next) {
    this.timeOffset = this.placedAt.getTimezoneOffset();
    this.placedAtLocal = new Date(this.placedAt.getTime() - this.timeOffset * 60000);
    next();
});
const OrderModel = mongoose_1.default.model("Order", OrderSchema);
exports.default = OrderModel;
