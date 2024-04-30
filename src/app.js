
import bcrypt from "bcrypt"

import express from "express"
import fs from "fs"
import path from "path"
import Joi from "joi";
import schema from "./avatarSchema.js"
import avatarSchema from "./avatarSchema.js";
import userSchema from "./userSchema.js";

export const app = express()
import {v4 as uuid} from "uuid"
import passport from "passport"
import {Strategy} from "passport-http-bearer"
import {BasicStrategy} from "passport-http";
import {isParent, isChild} from "./roles.js";
import {
    createValidator
} from 'express-joi-validation'

const validator = createValidator()




const user_file = "./users.json"


passport.use(new BasicStrategy(
    async function(userid, password, done) {
        try {
            const users = JSON.parse(fs.readFileSync(user_file, 'utf-8'))
            const user = users.find(user => user.username === userid);
            if (user) {
                const isCorrect = await bcrypt.compare(password, user.password)
                if(isCorrect){done(null, user)}
            } else {

                done(null, false)
            }
        } catch (err) {
            done(err)
        }
    }))

app.use(express.json());
app.use(express.static(path.join('./public'),{index:false,extensions:['html']}));





app.get('/api/avatars',
    (req,res) => {

    console.log("2")
    const jsonData = fs.readFileSync(  './avatars.json', 'utf8');
    res.send(jsonData)

})

app.get('/api/avatars/:id', (req,res) => {


    let id = req.params.id

    const jsonData = fs.readFileSync(  './avatars.json', 'utf8');

    let realjson = JSON.parse(jsonData)

    realjson.forEach((c)=>{
        if (c.id==id) {
            res.status(200).send(c)
        }

    })

    res.sendStatus(404)


})

app.delete('/api/avatars/:id', (req,res)=>{
    let id = parseFloat(req.params.id)

    fs.readFile('./avatars.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.sendStatus(500)
            return;
        }

        const characters = JSON.parse(data);

        const characterIndex = characters.findIndex(character => character.id === id);

        characters.splice(characterIndex, 1)

        fs.writeFile('./avatars.json', JSON.stringify(characters, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500)
                return;
            }
            res.sendStatus(200)
        });

    })


})
app.put('/api/avatars/:id', (req,res)=>{

    let id = req.params.id

    const name = req.body.characterName;
    const age = req.body.childAge;
    const head = req.body.headShape;
    const hair = req.body.hairStyle;
    const hair_color = req.body.skinColor;
    const t_clothes = req.body.upperClothing;
    const l_clothes = req.body.lowerClothing;



    const updatedCharacter =  {
        "characterName" : name,
        "childAge" : age,
        "skinColor" : hair_color,
        "hairStyle" : hair,
        "headShape" : head,
        "upperClothing" : t_clothes,
        "lowerClothing" : l_clothes,
    }

    const {error, value} = avatarSchema.validate(updatedCharacter)

    if (error){
        res.status(400).send(error)
        return
    }


    function updateAvatar(id, updatedCharacter) {
        fs.readFile('./avatars.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.sendStatus(500)
                return;
            }

            const characters = JSON.parse(data);

            const characterIndex = characters.findIndex(character => character.id === id);



            const updatedCharacter =  {
                "characterName" : name ? name : characters[characterIndex].characterName,
                "childAge" : age ? age : characters[characterIndex].childAge,
                "skinColor" : hair_color ? hair_color : characters[characterIndex].skinColor,
                "hairStyle" : hair ? hair : characters[characterIndex].hairStyle,
                "headShape" : head ? head : characters[characterIndex].headShape,
                "upperClothing" : t_clothes ? t_clothes : characters[characterIndex].upperClothing,
                "lowerClothing" : l_clothes ? l_clothes : characters[characterIndex].lowerClothing
            }



            if (characterIndex !== -1) {
                characters[characterIndex] = {
                    ...characters[characterIndex],
                    ...updatedCharacter
                };

                fs.writeFile('./avatars.json', JSON.stringify(characters, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.sendStatus(500)
                        return;
                    }
                    res.sendStatus(204)
                });
            } else {
                res.sendStatus(404)
            }
        });
    }

    updateAvatar( id, updatedCharacter);


})

app.get('/', (req,res) => {
    res.sendFile(process.cwd() + "/public/index.html")
})

app.get('/avatars/:id', function(req , res){

    let id = req.params.id

    const jsonData = fs.readFileSync(  '../avatars.json', 'utf8');


    let realjson = JSON.parse(jsonData)

    realjson.forEach((c)=>{
        if (c.id==id) {
            res.send('<table border="1">' +
                '<tr>' +
                '            <th>ID</th>\n' +
                '            <th>Character Name</th>\n' +
                '            <th>Child Age</th>\n' +
                '            <th>Skin Color</th>\n' +
                '            <th>Hair Style</th>\n' +
                '            <th>Head Shape</th>\n' +
                '            <th>Upper Clothing</th>\n' +
                '            <th>Lower Clothing</th>\n' +
                '            <th>Created At</th>\n' +
                '        </tr>' +
                '<tr>' +
                '            <th> ' + c.id + '</th>\n' +
                '            <th>' + c.characterName + '</th>\n' +
                '            <th>' + c.childAge + '</th>\n' +
                '            <th>' + c.skinColor + '</th>\n' +
                '            <th>' + c.hairStyle + '</th>\n' +
                '            <th>' + c.headShape + '</th>\n' +
                '            <th>' + c.upperClothing + '</th>\n' +
                '            <th>' + c.lowerClothing + '</th>\n' +
                '            <th>' + c.createdAt + '</th>\n' +
                '        </tr>' +
                '</table>')
        }

    })

    res.sendStatus(404)



});

app.post('/api/users',  (req,res) => {
    let data;

    try {
        const jsonData = fs.readFileSync('users.json', 'utf8');
        data = JSON.parse(jsonData);
    } catch (err) {
        console.error(err);
        data = [];
    }

    data.push(req.body);

    const newJsonData = JSON.stringify(data, null, 2);

    fs.writeFileSync('./users.json', newJsonData);

    console.log('New object added to users.json');

    res.status(201).send(req.body)
})



app.post('/api/avatars',isParent,  (req, res) => {

    console.log("### REQUEST BODY ###")
    console.log(req.body)
    console.log("### END REQUEST BODY ###")

    const name = req.body.characterName;
    const age = req.body.childAge;
    const head = req.body.headShape;
    const hair = req.body.hairStyle;
    const hair_color = req.body.skinColor;
    const t_clothes = req.body.upperClothing;
    const l_clothes = req.body.lowerClothing;

    let date_rn = new Date(Date.now()).toISOString()
    let time_rn = uuid()

    const userSent = {
        "characterName" : name ,
            "childAge" : age,
            "skinColor" : hair_color,
            "hairStyle" : hair,
            "headShape" : head,
            "upperClothing" : t_clothes,
            "lowerClothing" : l_clothes,
    }

    const newObject =  {
        "id" : time_rn,
        "characterName" : name ,
        "childAge" : age,
        "skinColor" : hair_color,
        "hairStyle" : hair,
        "headShape" : head,
        "upperClothing" : t_clothes,
        "lowerClothing" : l_clothes,
        "createdAt": date_rn
    }

    const {error, value} = avatarSchema.validate(req.body)

    if (error){
        res.status(400).send(error)
        return
    }

    console.log(newObject)

    let data;
    try {
        const jsonData = fs.readFileSync('avatars.json', 'utf8');
        data = JSON.parse(jsonData);
    } catch (err) {
        console.error(err);
        data = [];
    }

    data.push(newObject);

    const newJsonData = JSON.stringify(data, null, 2);

    fs.writeFileSync('./avatars.json', newJsonData);

    console.log('New object added to avatars.json');

    res.status(201).send(newObject)


})


export default app;