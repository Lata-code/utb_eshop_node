const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const productRouter = require('./src/routers/product')
const categoryRouter = require('./src/routers/category')
const userRouter = require('./src/routers/user')
const orderRouter = require('./src/routers/order')
const cors = require('cors');
const authjwt = require('./src/helpers/jwt')
const errorHandler = require('./src/helpers/errorHandler')


require('dotenv').config();

const port = process.env.PORT;
const api = process.env.API_URL

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors())
app.use(authjwt())
app.use(errorHandler)
app.options('*',cors())
app.use(`${api}`,productRouter);
app.use(`${api}`,categoryRouter);
app.use(`${api}`,userRouter);
app.use(`${api}`, orderRouter)



mongoose.connect(process.env.CONNECTION_STRING).then(()=>{ console.log("Database Connected") }).catch((err)=>{ console.log(err) })

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
    
})