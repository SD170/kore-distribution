"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const connection_1 = __importDefault(require("./db/connection"));
const error_1 = __importDefault(require("./middlewares/error"));
//load env vars
dotenv_1.default.config({ path: __dirname + '/../config.env' });
const PORT = process.env.PORT || 5000;
//Connect to database
(0, connection_1.default)();
//route files
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const app = (0, express_1.default)();
//body parser
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
//mount routers
app.use('/api/v1/orders', order_routes_1.default);
// swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Kore MilkDistro API",
            description: "Milk distribution API info",
            contact: {
                name: "SD17"
            },
            servers: [`http://localhost:${PORT}`],
            version: "1.0"
        }
    },
    apis: ["./src/controllers/*.ts", "./src/routes/*.ts", "./dist/controllers/*.js", "./dist/routes/*.js"]
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
//error middleware. create a response - should be at last
app.use(error_1.default);
const server = app.listen(PORT, () => {
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`);
});
//handle unhandled PromeseRejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close Server & exit process
    server.close(() => process.exit(1));
});
