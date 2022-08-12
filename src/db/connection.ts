import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongouser = process.env.MONGOUSER;
        const mongopassword = process.env.MONGOPASSWORD;
        const mongohost = process.env.MONGOHOST;
        const mongoport = process.env.MONGOPORT;
        const databasename = process.env.DATABASENAME;

        if (mongohost == "localhost") {
            let mongoString =
                "mongodb://" + mongohost + ":" + mongoport + "/" + databasename;
            const conn = await mongoose.connect(mongoString);
            console.log(
                `MongoDB Connected: ${conn.connection.host}`
            );
        } else {
            let mongoString =
                "mongodb+srv://" +
                mongouser +
                ":" +
                encodeURIComponent(mongopassword!) +
                "@" +
                mongohost +
                "/" +
                databasename +
                "?retryWrites=true&w=majority";

            const conn = await mongoose.connect(mongoString);

            console.log(
                `MongoDB Connected: ${conn.connection.host}`
            );
        }
    } catch (err) {
        console.error(err, "Error");
    }
};

export default connectDB;