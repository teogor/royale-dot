const express = require('express')
const {engine} = require('express-handlebars')
const path = require("path");
const app = express()
const port = 3000

class HomePage {

    constructor() {

    }

    initialize() {
        app.listen(port, () => {

        })
        app.engine(
            "handlebars",
            engine({
                defaultLayout: false,
            })
        )
        app.set("view engine", "handlebars");
        app.set('views', './src/res/views');
        app.get('/', (req, res) => {
            let pkg;
            try {
                pkg = require(path.join(process.cwd(), "package.json"));
            } catch (e) {
                pkg = {};
            }
            res.render("home.handlebars", pkg)
        })
    }

}

module.exports = {
    homePage: new HomePage()
}