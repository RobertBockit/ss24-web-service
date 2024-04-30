import app from './app.js'
import express from "express";

export const port = 3000
app.set('json spaces', 40);

app.listen(port, () => {
    console.log("server is running on port 3000")
})
app.use(express.json())
