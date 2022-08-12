import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';
import OrderModel from "../models/Order.model";
import asyncHandler from "../middlewares/async";
import ErrorResponse from '../utils/ErrorResponse';;


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
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // creating a new order 
    const order = new OrderModel({
        ...req.body
    });

    // saving the created user
    const savedOrder = await order.save();

    res.status(200)
        .json({
            success: true,
            message: `Order placed`,
            data: savedOrder,
        });

});


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
export const updateOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    if (!req.params.id) {
        next(new ErrorResponse("Please provide orderId in path params", 400))
    }

    // updating a order 
    const updatedOrder = await OrderModel.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, {
        new: true,
        runValidators: true,
    });

    if (!updatedOrder) {
        return next(
            new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200)
        .json({
            success: true,
            message: `Order updated`,
            data: updatedOrder,
        });

});




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
export const updateStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    if (!req.params.id || !req.body.status) {
        next(new ErrorResponse("Please provide orderId in path params and status in body", 400))
    }

    // updating a order 
    const updatedOrder = await OrderModel.findOneAndUpdate({ _id: req.params.id }, { status: req.body.status }, {
        new: true,
        runValidators: true,
    });

    if (!updatedOrder) {
        return next(
            new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200)
        .json({
            success: true,
            message: `Order status updated`,
            data: updatedOrder,
        });

});


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
export const deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    if (!req.params.id) {
        next(new ErrorResponse("Please provide orderId in path params", 400))
    }

    // delete a order 
    const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
        return next(
            new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200)
        .json({
            success: true,
            message: `Order deleted`,
            data: deletedOrder,
        });

});



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
export const checkCapacity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const dailyLimit = parseInt(process.env.MAX_ORDER_PER_DAY!) || 100 // in litre

    if (!req.params.date) {
        next(new ErrorResponse("Please provide orderId in path params", 400))
    }
    const qDate = new Date(req.params.date);
    const nextDate = new Date();
    nextDate.setDate(qDate.getDate() + 1);
    // console.log(req.params.date);



    // delete a order 
    // @ts-ignore
    const remCap = await OrderModel.aggregate([
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
    } else {
        result = dailyLimit - remCap[0].totalQuantityOrdered;
    }


    res.status(200)
        .json({
            success: true,
            message: `Capacity fetched successfully`,
            data: { quantityLeft: result },
        });

});