import { Router } from "express";
import { createOrder, updateOrder, updateStatus, deleteOrder, checkCapacity, getOrders} from '../controllers/order.controller';


const router = Router();




router.route("/").get(getOrders);
router.route("/add").post(createOrder);
router.route("/update/:id").put(updateOrder);
router.route("/updateStatus/:id").put(updateStatus);
router.route("/delete/:id").delete(deleteOrder);
router.route("/checkCapacity/:date").get(checkCapacity);

export default router;
