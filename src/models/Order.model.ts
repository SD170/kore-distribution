import mongoose from "mongoose";
import ErrorResponse from '../utils/ErrorResponse';

const OrderSchema = new mongoose.Schema({
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
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.timeOffset;
            delete ret.__v;
        },
    },
});


// Static method to get milk quanity left for the day
OrderSchema.statics.getRemainingQuantity = async function () {


    const dailyLimit = parseInt(process.env.MAX_ORDER_PER_DAY!) || 100 // in litre

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
        const remainingQuantity = await remainingQuantityQ;
        console.log(remainingQuantity);
        if (remainingQuantity.length === 0) {
            return dailyLimit;
        }
        return remainingQuantity[0].quantityLeft;

    } catch (err) {
        console.error(err);
        throw new ErrorResponse("Error finding remainingQuantity", 404);
    }
};




OrderSchema.pre("save", async function (next) {
    // @ts-ignore
    const remainingQuantity = await this.constructor.getRemainingQuantity();

    if (remainingQuantity >= this.milkQuantity) {
        next();
    } else {
        throw new ErrorResponse(`Not enough milk left, remaining ${remainingQuantity} litre`, 400);
    }

});


OrderSchema.pre("findOneAndUpdate", async function (next) {
    // @ts-ignore
    console.log((this._update));
    // @ts-ignore
    if (this._update.milkQuantity) {
        // @ts-ignore
        const getRemainingQuantityB = this.schema.statics.getRemainingQuantity.bind(this.model);
        const remainingQuantity = await getRemainingQuantityB();
        // @ts-ignore
        if (remainingQuantity >= this._update.milkQuantity) {
            next();
        } else {
            throw new ErrorResponse(`Not enough milk left, remaining ${remainingQuantity} litre`, 400);
        }
    }

});


// ref
// https://www.mongodb.com/docs/v3.2/tutorial/model-time-data/
OrderSchema.pre("save", function (next) {
    this.timeOffset = this.placedAt.getTimezoneOffset();
    this.placedAtLocal = new Date(this.placedAt.getTime() - this.timeOffset * 60000);
    next();
});

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
