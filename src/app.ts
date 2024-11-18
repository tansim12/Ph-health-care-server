import express, { Application, Request, Response } from "express";
import { userRouter } from "./app/Modules/User/User.route";
import { adminRouter } from "./app/Modules/Admin/Admin.route";
import globalErrorHandler from "./app/Error-Handler/globalErrorHandler";
import normalMiddleware from "./app/middleware/normalMiddleware";
import { AuthRoutes } from "./app/Modules/Auth/Auth.route";
import { specialtiesRouter } from "./app/Modules/Specialities/Specialities.route";

const app: Application = express();
normalMiddleware(app);

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server..",
  });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/specialties", specialtiesRouter);

app.all("*", (req: Request, res: Response, next) => {
  const error = new Error(`Can't find ${req.url} on the server`);
  next(error);
});

// global error handle
app.use(globalErrorHandler);

export default app;
