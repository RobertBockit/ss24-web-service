import {jest, test, describe, expect} from "@jest/globals";
import request from "supertest";
import app from './app.js'


describe('avatar api', () => {


    let sample = {
        "characterName" : "name",
        "childAge" : "12",
        "skinColor" : "hair_color",
        "hairStyle" : "hair",
        "headShape" : "head",
        "upperClothing" : "t_clothes",
        "lowerClothing" : "l_clothes"
    }


    test ('create avatar', async () => {
        const response = await request(app)
            .post('/api/avatars')
            .send(sample)
            .set('Accept', 'application/json')
            .expect(201)

        expect(response.body).toMatchObject(sample)
    });

})