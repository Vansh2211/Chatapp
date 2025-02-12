import ensureAuthenticated from "./authEnsure";
import { Request, Response } from "express";
// import Requests from "/Users/juntrax/Desktop/Chatapp/backend/src/models/requests";
import express from "express";
import Requests,{IDBRequest} from "/Users/juntrax/Desktop/Chatapp/backend/src/models/requests"

const router = express.Router();

router.post("/send", ensureAuthenticated, (req: Request, res: Response) => {
    const { sender, receiver, status } = req.user as IDBRequest;
    const request = new Requests({ sender, receiver, status });
    request
        .save()
        .then((result) => {
        res.status(201).json({ message: "Request sent", request: result });
        })
        .catch((error) => {
        res.status(500).json({ message: "Error sending request", error });
        });
});

router.post("/accept", ensureAuthenticated, (req: Request, res: Response) => {
    const { sender, receiver } = req.user as IDBRequest;
    Requests.findOneAndUpdate(
        { sender, receiver },
        { status: "accepted" },
        { new: true }
    )
        .then((result) => {
        res.status(200).json({ message: "Request accepted", request: result });
        })
        .catch((error) => {
        res.status(500).json({ message: "Error accepting request", error });
        });
})

router.post("/reject", ensureAuthenticated, (req: Request, res: Response) => {
    const { sender, receiver } = req.user as IDBRequest;
    Requests.findOneAndDelete({ sender, receiver })
        .then((result) => {
        res.status(200).json({ message: "Request rejected", request: result });
        })
        .catch((error) => {
        res.status(500).json({ message: "Error rejecting request", error });
        });
});

router.post("/decline", ensureAuthenticated, (req: Request, res: Response) => {
    const { sender, receiver } = req.user as IDBRequest;
    Requests.findOneAndDelete({ sender, receiver })
        .then((result) => {
        res.status(200).json({ message: "Request declined", request: result });
        })
        .catch((error) => {
        res.status(500).json({ message: "Error declining request", error });
        });
});

router.get("/pending", ensureAuthenticated, (req: Request, res: Response) => {
    const { id } = req.body;
    Requests.find({ receiver: id, status: "pending" })
        .then((result) => {
        res.status(200).json({ requests: result });
        })
        .catch((error) => {
        res.status(500).json({ message: "Error fetching requests", error });
        });
})

export default router;