import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	console.log("Client connected");

	// Receive control command
	socket.on("toggleValve", (valveId, state) => {
		console.log(`Valve ${valveId} set to:`, state ? "OPEN" : "CLOSED");
		// Broadcast updated state to all clients
		io.emit("valveStateUpdate", { valveId, state });
	});

	// Periodically send tank levels
	setInterval(() => {
		io.emit("tankData", { tankId: "Tank1", level: Math.random() * 100 });
	}, 2000);
});

server.listen(4000, () => console.log("Server listening on 4000"));
