import { DataBaseError } from "../../database/error/database.exceptions";
import { TripError } from "../error/trip.exceptions";
import { Trip } from "../tripDTO";
import { TripService } from "../service/trip.db.service";
import { Request, Response } from "express";

export class TripController {
  static async getAllTrips(req: Request, res: Response) {
    const trips = await TripService.getAllTrips();
    const data = {
      pageTitle: "Trips",
      message: "Witaj na mojej stronie!",
      trips: trips,
      authenticated: req.oidc.isAuthenticated(),
    };
    res.render("trips", data);
  }
  static async createTrip(req: Request, res: Response) {
    const data: Trip = req.body;
    const userId = req.params.userId;
    data.authorTripId = userId;
    try {
      await TripService.addTripToDb(data);
      res.status(201).send("Trip created");
    } catch (error) {
      if (error instanceof TripError) {
        res.status(409).json({ name: error.name, message: error.message });
        return;
      }
      const typedError = error as DataBaseError;
      res.status(500).json({ message: typedError });
    }
  }
  static async deleteTripByTitle(req: Request, res: Response) {
    const title = req.params.title;
    try {
      await TripService.deleteTripFromDb(title);
    } catch (error) {
      if (error instanceof TripError) {
        res.status(409).json({ name: error.name, message: error.message });
        return;
      }
      const typedError = error as DataBaseError;
      res.status(500).json({ message: typedError });
    }
  }
  static async updateTripByTitle(req: Request, res: Response) {
    const data = req.body;
    const title = req.body.title;
    try {
      await TripService.updateTripByTitle(title, data);
    } catch (error) {
      if (error instanceof TripError) {
        res.status(409).json({ name: error.name, message: error.message });
        return;
      }
      const typedError = error as DataBaseError;
      res.status(500).json({ message: typedError });
    }
  }
  static async getTripByTitle(req: Request, res: Response) {
    try {
      const trip = await TripService.getTripByTitle(req.params.title);
      if (trip) {
        const data = {
          pageTitle: "Trips",
          message: "Witaj na mojej stronie!",
          trip: trip,
          authenticated: req.oidc.isAuthenticated(),
        };
        res.render("trip", data);
        return;
      }
    } catch (error) {
      res.status(404).send(`Error: ${error}`);
    }
  }
}