import app from "./app"
// read .env
import dotenv from "dotenv"
dotenv.config()

const port = process.env.PORT || 5500

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})