import express from "express"
import fs from "fs"
import path from "path"

const app = express()
app.use(express.urlencoded({ extended: false }))


app.use(express.static(path.join('./public'),{index:false,extensions:['html']}));



app.listen(3000, () => {
    console.log("server is running on port 3000")
})


app.get('/all-characters', (req,res) => {
    console.log("2")
    const jsonData = fs.readFileSync(  './avatars.json', 'utf8');
    res.send(jsonData)

})

app.get('/', (req,res) => {
    res.sendFile(process.cwd() + "/public/index.html")
})

app.get('/avatar/:id', function(req , res){

    let id = req.params.id

    const jsonData = fs.readFileSync(  './avatars.json', 'utf8');


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


app.post('/create-avatar', (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const head = req.body.head;
    const hair = req.body.hair;
    const hair_color = req.body.hair_color;
    const t_clothes = req.body.t_clothing;
    const l_clothes = req.body.l_clothing;

    console.log(l_clothes)


    const newObject =  {
        "id" : Date.now(),
        "characterName" : name,
        "childAge" : age,
        "skinColor" : hair_color,
        "hairStyle" : hair,
        "headShape" : head,
        "upperClothing" : t_clothes,
        "lowerClothing" : l_clothes,
        "createdAt": new Date(Date.now()).toISOString()
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

    fs.writeFileSync('avatars.json', newJsonData);

    console.log('New object added to avatars.json');
    res.sendStatus(200)


})
