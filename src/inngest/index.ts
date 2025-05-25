import { Inngest } from "inngest";
import {createTunnel, ForwardOptions, ServerOptions, SshOptions, TunnelOptions} from "tunnel-ssh";
import mysql from "mysql2/promise";

export const inngest = new Inngest({ id: "my-app" });

// Function "test/hello.world"
const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// Function "test/select.from.db"
// Create SSH tunnel configuration
const tunnelOptions: TunnelOptions = {
  autoClose: true,
  reconnectOnError: true,
};
// Create Server configuration
const serverOptions: ServerOptions = {
  port: process.env.LOCAL_PORT ? parseInt(process.env.LOCAL_PORT) : 13306,
};
// Create SSH configuration
const sshOptions: SshOptions = {
  host: process.env.SSH_HOST || "",
  port: process.env.SSH_PORT ? parseInt(process.env.SSH_PORT) : 22,
  username: process.env.SSH_USERNAME || "",
  privateKey: process.env.SSH_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
};
// Create SSH Port Forwarding configuration
const forwardOptions: ForwardOptions = {
  srcAddr: process.env.LOCAL_HOST || "",
  srcPort: process.env.LOCAL_PORT ? parseInt(process.env.LOCAL_PORT) : 13306,
  dstAddr: process.env.DB_HOST || "",
  dstPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
};

const selectFromDb = inngest.createFunction(
  { id: "select-from-db" },
  { event: "test/select.from.db" },
  async ({ event, step }) => {
    const [server, client] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
    try {
      const connection = await mysql.createConnection({
        host: forwardOptions.srcAddr,
        port: forwardOptions.srcPort,
        user: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
      });

      const [rows] = await connection.query("SELECT * FROM sample_data LIMIT 10");

      await connection.end();
      server.close();

      return { data: rows };
    } catch (err) {
      server.close();
      throw err;
    }
  },
);

// Add the function to the exported array:
export const functions = [
  helloWorld,
  selectFromDb,
];
