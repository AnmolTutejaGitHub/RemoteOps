// ref : https://www.npmjs.com/package/ssh2

const { Client } = require("ssh2");
const { decryptSSH } = require("./encryption");

function runCommand(connection, cmd) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        const key = decryptSSH(connection.sshEncrypted);

        conn.on("ready", () => {
            conn.exec(cmd, (err, stream) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                let result = "";

                stream.on("data", (data) => {
                    result += data.toString();
                });

                stream.stderr.on("data", (data) => {
                    result += data.toString();
                });

                stream.on("close", () => {
                    conn.end();
                    resolve(result);
                });
            });
        });

        conn.on("error", (err) => {
            reject(err);
        });

        conn.connect({
            host: connection.ip,
            username: connection.hostName,
            privateKey: key,
        });
    });
}


async function getMetrics(connection) {
    const output = await runCommand(
        connection,
        "top -bn1 | awk '/Cpu/ {print 100 - $8}' && free -m | awk 'NR==2{print $2, $3}'"
    );

    // output : format : 
    // 3.1
    // 916 138

    const lines = output.split("\n");

    const cpu = parseFloat(lines[0]);

    const parts = lines[1].split(" ");
    const total = parseInt(parts[0]);
    const used = parseInt(parts[1]);

    return {
        cpu: cpu,
        ram: {
            total: total,
            used: used
        }
    };
}

function createShell(connection) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        const key = decryptSSH(connection.sshEncrypted);

        conn.on("ready", () => {
            conn.shell({ term: "xterm-256color" }, (err, stream) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                resolve({ conn, stream });
            });
        });

        conn.on("error", reject);

        conn.connect({
            host: connection.ip,
            username: connection.hostName,
            privateKey: key,
        });
    });
}


module.exports = { runCommand, getMetrics, createShell };