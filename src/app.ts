import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRouter } from "./app/Modules/User/User.route";
import { adminRouter } from "./app/Modules/Admin/Admin.route";
import globalErrorHandler from "./app/Error-Handler/globalErrorHandler";

const app: Application = express();
app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server..",
  });
});

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);



app.all("*", (req: Request, res: Response, next) => {
  const error = new Error(`Can't find ${req.url} on the server`);
  next(error);
});

// global error handle
app.use(globalErrorHandler);

export default app;


