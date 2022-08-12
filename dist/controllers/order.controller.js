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
exports.checkCapacity = exports.deleteOrder = exports.updateStatus = exports.updateOrder = exports.createOrder = void 0;
const Order_model_1 = __importDefault(require("../models/Order.model"));
const async_1 = __importDefault(require("../middlewares/async"));
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
;
/**
 * @swagger
 * /api/v1/orders/add:
 *  post:
 *   description: create an order
 *   parameters:
 *       - name: milkQuantity
 *         description: Quantity of milk in litre.
 *         in: formData
 *         required: true
 *         type: number
 *       - name: orderLocation
 *         description: Location of delivery.
 *         in: formData
 *         required: false
 *         type: string
 *   responses:
 *     200:
 *       description: Order creation successful
 *
 *
 */
//  @desc       create an order
//  @route      POST /api/v1/orders/add
//  @access     Public
exports.createOrder = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // creating a new order 
    const order = new Order_model_1.default(Object.assign({}, req.body));
    // saving the created user
    const savedOrder = yield order.save();
    res.status(200)
        .json({
        success: true,
        message: `Order placed`,
        data: savedOrder,
    });
}));
/**
 * @swagger
 * /api/v1/orders/update/{id}:
 *  put:
 *   description: create an order
 *   parameters:
 *       - name: id
 *         description: id of the order
 *         in: 'path'
 *         required: true
 *         type: string
 *       - name: milkQuantity
 *         description: Quantity of milk in litre.
 *         in: formData
 *         required: true
 *         type: number
 *       - name: orderLocation
 *         description: Location of delivery.
 *         in: formData
 *         required: false
 *         type: string
 *       - name: status
 *         description: Status of order.
 *         in: formData
 *         required: false
 *         type: string
 *         enum: ["placed", "packed", "dispatched", "delivered"]
 *   responses:
 *     200:
 *       description: Order creation successful
 *
 *
 */
//  @desc       update an order
//  @route      PUT /api/v1/orders/update:id
//  @access     Public
exports.updateOrder = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        next(new ErrorResponse_1.default("Please provide orderId in path params", 400));
    }
    // updating a order 
    const updatedOrder = yield Order_model_1.default.findOneAndUpdate({ _id: req.params.id }, Object.assign({}, req.body), {
        new: true,
        runValidators: true,
    });
    if (!updatedOrder) {
        return next(new ErrorResponse_1.default(`Order not found with id of ${req.params.id}`, 404));
    }
    res.status(200)
        .json({
        success: true,
        message: `Order updated`,
        data: updatedOrder,
    });
}));
/**
 * @swagger
 * /api/v1/orders/updateStatus/{id}:
 *  put:
 *   description: create an order
 *   parameters:
 *       - name: id
 *         description: id of the order
 *         in: 'path'
 *         required: true
 *         type: string
 *       - name: status
 *         description: Status of order.
 *         in: formData
 *         required: false
 *         type: string
 *         enum: ["placed", "packed", "dispatched", "delivered"]
 *   responses:
 *     200:
 *       description: Order creation successful
 *
 *
 */
//  @desc       update an order's status
//  @route      PUT /api/v1/orders/updateStatus:id
//  @access     Public
exports.updateStatus = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id || !req.body.status) {
        next(new ErrorResponse_1.default("Please provide orderId in path params and status in body", 400));
    }
    // updating a order 
    const updatedOrder = yield Order_model_1.default.findOneAndUpdate({ _id: req.params.id }, { status: req.body.status }, {
        new: true,
        runValidators: true,
    });
    if (!updatedOrder) {
        return next(new ErrorResponse_1.default(`Order not found with id of ${req.params.id}`, 404));
    }
    res.status(200)
        .json({
        success: true,
        message: `Order status updated`,
        data: updatedOrder,
    });
}));
/**
 * @swagger
 * /api/v1/orders/delete/{id}:
 *  delete:
 *   description: delete an order
 *   parameters:
 *       - name: id
 *         description: id of the order
 *         in: 'path'
 *         required: true
 *         type: string
 *   responses:
 *     200:
 *       description: Order deletion successful
 *
 *
 */
//  @desc       delete an order
//  @route      DELETE /api/v1/orders/delete:id
//  @access     Public
exports.deleteOrder = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        next(new ErrorResponse_1.default("Please provide orderId in path params", 400));
    }
    // delete a order 
    const deletedOrder = yield Order_model_1.default.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
        return next(new ErrorResponse_1.default(`Order not found with id of ${req.params.id}`, 404));
    }
    res.status(200)
        .json({
        success: true,
        message: `Order deleted`,
        data: deletedOrder,
    });
}));
/**
 * @swagger
 * /api/v1/orders/checkCapacity/{date}:
 *  get:
 *   description: check milk amount left for the day
 *   parameters:
 *       - name: date
 *         description: date to check capacity [format-> YYYY-MM-DD]
 *         in: 'path'
 *         required: true
 *         type: string
 *         example: "2022-12-31"
 *   responses:
 *     200:
 *       description: capacity check successful
 *
 *
 */
//  @desc       check capacity for a day
//  @route      GET /api/v1/orders/checkCapacity:date
//  @access     Public
exports.checkCapacity = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const dailyLimit = parseInt(process.env.MAX_ORDER_PER_DAY) || 100; // in litre
    if (!req.params.date) {
        next(new ErrorResponse_1.default("Please provide orderId in path params", 400));
    }
    const qDate = new Date(req.params.date);
    const nextDate = new Date();
    nextDate.setDate(qDate.getDate() + 1);
    // console.log(req.params.date);
    // delete a order 
    // @ts-ignore
    const remCap = yield Order_model_1.default.aggregate([
        {
            '$group': {
                '_id': {
                    '$dayOfYear': '$placedAtLocal'
                },
                'totalQuantityOrdered': {
                    '$sum': '$milkQuantity'
                },
                'date': {
                    '$first': '$placedAtLocal'
                }
            }
        }, {
            '$match': {
                'date': {
                    '$gte': qDate,
                    '$lte': nextDate
                }
            }
        }
    ]);
    let result;
    if (remCap.length === 0) {
        result = dailyLimit;
    }
    else {
        result = dailyLimit - remCap[0].totalQuantityOrdered;
    }
    res.status(200)
        .json({
        success: true,
        message: `Capacity fetched successfully`,
        data: result,
    });
}));
