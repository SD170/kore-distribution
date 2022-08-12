import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import swaggerJsDocs from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDB from "./db/connection";
import errorHandler from './middlewares/error';


//load env vars
dotenv.config({ path: __dirname + '/../config.env' });


const PORT = process.env.PORT || 5000;

//Connect to database
connectDB();

//route files
import orderRoutes from "./routes/order.routes";



const app = express();


//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}



//mount routers
app.use('/api/v1/orders', orderRoutes);


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
            version:"1.0"
        }
    },
    apis: ["./src/controllers/*.ts", "./src/routes/*.ts", "./dist/controllers/*.js", "./dist/routes/*.js"]
}

const swaggerDocs = swaggerJsDocs(swaggerOptions);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//error middleware. create a response - should be at last
app.use(errorHandler);



const server = app.listen(PORT, () => {
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
});

//handle unhandled PromeseRejection
process.on('unhandledRejection', (err: any, promise) => {
    console.log(`Error: ${err.message}`);

    //Close Server & exit process
    server.close(() => process.exit(1));
})

