import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { moment } from "https://deno.land/x/moment/moment.ts";

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = `Hello world! ${moment().format("YYYY-MM-DD")}`;
  })
  .get("/shrt/:urlid", (context) => {
    const urls = JSON.parse(Deno.readTextFileSync("./urls.json"));

    if (context.params && context.params.urlid && urls[context.params.urlid]) {
      if (
        urls[context.params.urlid].expiryDate > moment().format("YYYY-MM-DD")
      ) {
        context.response.redirect(urls[context.params.urlid].dest);
      } else {
        context.response.body = "Link Expired";
      }
    } else {
      context.response.body = "404";
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("> Listening on http://localhost:8000");

await app.listen({ port: 8000 });

console.log("REEEEEE")