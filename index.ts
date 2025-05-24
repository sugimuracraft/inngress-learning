import express from "express";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest"

const app = express();
// Important: ensure you add JSON middleware to process incoming JSON POST payloads.
app.use(express.json());
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

// Create a new route
app.get("/api/hello", async function (req, res, next) {
  await inngest.send({
    name: "test/hello.world",
    data: {
      // email: "testUser@example.com",
      email: req.query.email,
    },
  }).catch(err => next(err));
  res.json({ message: 'Event sent!' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
