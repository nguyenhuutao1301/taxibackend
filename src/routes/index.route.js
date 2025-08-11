import postRoute from "./post.route.js";
import userRoute from "./user.route.js";
import imageRoute from "./image.route.js";
import commentRoute from "./comment.route.js";
import ortherRoute from "./orther.route.js";
import bookingRoute from "./order.route.js";
import traffic from "./traffic.route.js";
import indexGoogle from "./google.route.js";
import openAi from "./openAi.route.js";

function route(app) {
  app.use("/api", postRoute);
  app.use("/api", userRoute);
  app.use("/api", imageRoute);
  app.use("/api", userRoute);
  app.use("/api", commentRoute);
  app.use("/api", ortherRoute);
  app.use("/api", bookingRoute);
  app.use("/api", traffic);
  app.use("/api", indexGoogle);
  app.use("/api", openAi);
}
export default route;
