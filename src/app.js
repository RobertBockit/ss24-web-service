

import express from "express"
import fs from "fs"
import path from "path"

export const app = express()
app.use(express.json())

app.use(express.static(path.join('./public'),{index:false,extensions:['html']}));



app.get('/api/avatars', (req,res) => {
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

    let id = parseFloat(req.params.id)

    const name = req.body.name;
    const age = req.body.age;
    const head = req.body.head;
    const hair = req.body.hair;
    const hair_color = req.body.hair_color;
    const t_clothes = req.body.t_clothing;
    const l_clothes = req.body.l_clothing;


    const updatedCharacter =  {
        "characterName" : name,
        "childAge" : age,
        "skinColor" : hair_color,
        "hairStyle" : hair,
        "headShape" : head,
        "upperClothing" : t_clothes,
        "lowerClothing" : l_clothes,
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


app.post('/api/avatars', (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const head = req.body.head;
    const hair = req.body.hair;
    const hair_color = req.body.hair_color;
    const t_clothes = req.body.t_clothing;
    const l_clothes = req.body.l_clothing;

    let date_rn = new Date(Date.now()).toISOString()
    let time_rn = Date.now()
    const newObject =  {
        "id" : time_rn,
        "characterName" : name,
        "childAge" : age,
        "skinColor" : hair_color,
        "hairStyle" : hair,
        "headShape" : head,
        "upperClothing" : t_clothes,
        "lowerClothing" : l_clothes,
        "createdAt": date_rn
    }

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

    res.set('Location', '/api/avatars/'+time_rn)
    res.status(201).send(newObject)


})


export default app;