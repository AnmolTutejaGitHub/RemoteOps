// ref : https://www.npmjs.com/package/ssh2
// ref : https://xtermjs.org/

const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const config = require("./config/config");
const Connection = require("./database/Models/Connection");
const Group = require("./database/Models/Group");
const { createShell } = require("./utils/SSHManager");

function initWSServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: config.FRONTEND_URL,
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || "");
            const token = cookies.token;
            if (!token) return next(new Error("Not authenticated"));
            const decoded = jwt.verify(token, config.JWT_TOKEN_SECRET);
            socket.userId = decoded.user_id;
            next();
        } catch (err) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {

        socket.on("start-terminal", async ({ connectionId }) => {
            try {
                const connection = await Connection.findById(connectionId);
                if (!connection) return socket.emit("terminal-error", "Connection not found");

                if (connection.type == "personal" && connection.owner?.toString() !== socket.userId) {
                    return socket.emit("terminal-error", "Not authorized");
                }
                if (connection.type == "group") {
                    const group = await Group.findById(connection.group);
                    if (!group) return socket.emit("terminal-error", "Group not found");
                    const isMember = group.members.some((memberId) => memberId.toString() === socket.userId);
                    if (!isMember) return socket.emit("terminal-error", "Not a member of this group");
                }

                const { conn, stream } = await createShell(connection);

                stream.on("data", (data) => socket.emit("output", data.toString()));
                stream.stderr.on("data", (data) => socket.emit("output", data.toString()));

                socket.on("input", (data) => stream.write(data));

                socket.on("resize", ({ rows, cols }) => stream.setWindow(rows, cols, 0, 0));

                stream.on("close", () => {
                    socket.emit("output", "\r\n[SSH session closed]\r\n");
                    conn.end();
                });
                socket.on("disconnect", () => conn.end());

            } catch (err) {
                socket.emit("terminal-error", err.message);
            }
        });
    });
}

module.exports = initWSServer;
