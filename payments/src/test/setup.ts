import {MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
declare global {
    namespace NodeJS{
        interface Global {
            signin(id?: string): string []
        }
    }
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51I4HwcKFInHsz397I6etuQS05WwUXrk3V1EtYpt2c4twaFI1JzXGChIVg55VDC0HwIErPACMei6BErWSRQJFhyVx00KiJ2w5to';

let mongo: any;
beforeAll(async () =>{
    process.env.JWT_KEY = 'asdf';
     mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

});

beforeEach (async () =>{
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections){
        await collection.deleteMany({});
    }

})

afterAll( async () =>{
    await mongo.stop();
    await mongoose.connection.close();

})

global.signin =  (id?: string) => {

    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "temporary@test.com"
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!)
    const session = {jwt: token};

    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`express:sess=${base64}`];
}