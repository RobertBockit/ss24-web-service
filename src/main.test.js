import {jest, test, describe, expect} from "@jest/globals";
import request from "supertest";
import app from './app.js'


describe('avatar api', () => {


    let sample = {
        "characterName" : "David",
        "childAge" : "12",
        "skinColor" : "#53165F",
        "hairStyle" : "short",
        "headShape" : "oval",
        "upperClothing" : "dress"
    }


    test ('create avatar', async () => {
        const response = await request(app)
            .post('/api/avatars')
            .auth("email@gmail.com", "123")
            .send(sample)
            .set('Accept', 'application/json')
            .expect(201)
        expect(response.body.createdAt).toBeDefined()
        expect(response.body).toMatchObject(sample)



    });

    test ('find specific avatar', async () => {
        const response = await request(app)
            .post('/api/avatars')
            .send(sample)
            .set('Accept', 'application/json')
            .expect(201)

        const findresponse = await request(app)
            .get('/api/avatars/' + response.body.id)
            .set('Accept', 'application/json')
            .expect(200)





    });

    test ('get all avatars', async () => {
        const getAll = await request(app)
            .get('/api/avatars')
            .set('Accept', 'application/json')
            .expect(200)

        const response = await request(app)
            .post('/api/avatars')
            .send(sample)
            .expect(201)

        const getAll2 = await request(app)
            .get('/api/avatars')
            .set('Accept', 'application/json')
            .expect(200)

        expect(getAll.body.length === (getAll2.body.length - 1))
    });


    test ('test dress working', async () => {


        let test_data = {
            "characterName": "David",
            "childAge": "12",
            "skinColor": "#53165F",
            "hairStyle": "short",
            "headShape": "oval",
            "upperClothing": "dress",
            "lowerClothing": "jeans"
        }


        const dressWithJeans = await request(app)
            .post('/api/avatars')
            .send(test_data)
            .expect(400)

        let test_data2 = {
            "characterName": "David",
            "childAge": "12",
            "skinColor": "#53165F",
            "hairStyle": "short",
            "headShape": "oval",
            "upperClothing": "dress",
        }


        const dressWithoutJeans= await request(app)
            .post('/api/avatars')
            .send(test_data2)
            .expect(201)



    });





    test ( 'delete avatar', async() => {

        const startData = await request(app)
            .get('/api/avatars')
            .set('Accept', 'application/json')
            .expect(200)


        const response = await request(app)
            .post('/api/avatars')
            .send(sample)
            .expect(201)

        const del_response = await request(app)
            .delete('/api/avatars/'+response.body.id)
            .expect(200)

        const endData = await request(app)
            .get('/api/avatars')
            .set('Accept', 'application/json')
            .expect(200)


        expect(startData.body).toEqual(endData.body)


    })



    test ( 'update avatar', async() => {




        let change = {
            "characterName": "David",
            "childAge": "12",
            "skinColor": "#53165F",
            "hairStyle": "short",
            "headShape": "oval",
            "upperClothing": "t-shirt",
            "lowerClothing": "jeans"
        }

        let expectedResult = {
            ...sample, ...change
        }

        const response = await request(app)
            .post('/api/avatars')
            .send(sample)
            .expect(201)

        const updateResponse = await request(app)
            .put('/api/avatars/' + response.body.id)
            .send(change)
            .expect(204)

        const repeatedCheck = await request(app)
            .get('/api/avatars/' + response.body.id)
            .set('Accept', 'application/json')
            .expect(200)

        expect(repeatedCheck.body).toMatchObject(expectedResult)



    })







    })