import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

console.log(process.env.MONGO_URI);
const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;
mongoClient.connect().then(() => {
    db = mongoClient.db("drivencracy");
});

server.post("/poll", (req, res) => {
    const { title, expireAt } = req.body;

    if (!title) {
        res.sendStatus(422);
    }

    /*
    if(!expireAt) {
        expireAt = 
    }
*/
    db.collection("poll")
        .insertOne({ title, expireAt })
        .then(() => {
            res.status(201).send(
                `Sua enquete "${title}" foi criada com sucesso!`
            );
        });
});

server.get("/poll", (req, res) => {
    db.collection("poll")
        .find()
        .toArray()
        .then((data) => {
            res.send(data);
        });
});

server.post("/choice", (req, res) => {
    const { title } = req.body;
    const { pollId } = db.collection("poll");

    if (!title) {
        res.sendStatus(422);
    }

    if (title === title) {
        res.sendStatus(409);
    }

    db.collection("choice")
        .insertOne({ title, pollId })
        .then(() => {
            res.status(201).send(
                `Opção de voto "${title}", foi criada com sucesso!`
            );
        });
});

server.get("/poll/:id/choice", (req, res) => {
    const { id } = req.params;

    db.collection("poll")
        .findOne({ _id: ObjectId(id) })
        .then((poll) => {
            res.send(poll);
            console.log(id);
        });
});

server.post("/choice/:id/vote", (req, res) => {
    const { id } = req.params;
    let vote;

    vote++;
    db.collection("vote").insertOne({
        vote,
    });

    res.status(201);
});

server.get("/poll/:id/result", (req, res) => {
    const votes = {
        result: {
            title,
            votes,
        },
    };

    res.send();
});

server.listen(5000, () => {
    console.log("Listening ON! Port: 5000.");
});
