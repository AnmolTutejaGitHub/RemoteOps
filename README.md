# RemoteOps
<p align="center">
  <img src="https://socialify.git.ci/AnmolTutejaGithub/RemoteOps/image?font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pattern=Floating+Cogs&pulls=1&stargazers=1&theme=Dark" alt="RemoteOps" />
</p>
<p align="center">
  <a href="https://hits.sh/github.com/AnmolTutejaGitHub/RemoteOps/">
    <img src="https://hits.sh/github.com/AnmolTutejaGitHub/RemoteOps.svg?style=plastic&color=0077bf" alt="Hits"/>
  </a>
</p>

### Introduction 

**RemoteOps** is a remote server management platform that enables users to monitor system metrics like CPU and RAM in real time and securely execute SSH commands in remote servers. It simplifies server administration by providing a centralized and efficient way to manage and control remote machines.

### Live
- https://remoteops.anmoltuteja.in

### Setup and Installation 

#### Pre-Requisities     
- Node.js
- MongoDB (local or cloud-based,like MongoDB Atlas)
- npm or yarn for package management

#### Installation
1. Clone the repository:   
```bash
git clone https://github.com/AnmolTutejaGitHub/RemoteOps
cd RemoteOps
```
2. Install dependencies for both the client and server:
```bash
# Navigate to server and install
cd server
npm install

# Navigate to client and install
cd ../client
npm install
```

3. Set up Environment Variables: See `env.example` for required variables and setup.

4. Run The Application:   
```bash
# In the client folder
npm run dev

# In the server folder
npm start
```

# RemoteOps — Project Specification
 
## Goals
 
- To simplify remote server management through a centralized platform.
- To provide real-time monitoring of system metrics such as CPU and RAM usage.
- To enable secure execution of SSH commands on remote machines.
- To reduce the complexity of managing multiple servers.
- To build a scalable and efficient system for remote operations.
- To provide an interactive browser-based terminal emulator for live shell access to remote servers.
 
## Specifications
 
### Functional Requirements
 
- Users can connect to remote servers using SSH credentials.
- The system can fetch and display CPU utilization in real time.
- The system can fetch and display RAM usage (total and used).
- Users can execute shell commands on remote servers.
- The system maintains a history of executed commands.
- Supports both personal and group-based server connections.
- Users can open an interactive browser-based terminal with full PTY (pseudo terminal) support — enabling tools like `vim`, `top`, and tab completion — via a persistent WebSocket connection relayed through the application server using SSH.
- The system supports multiple concurrent terminal sessions across different servers, with each session maintaining an isolated SSH shell channel.
 
### Non-Functional Requirements
 
- The system ensures secure handling of SSH credentials.
- The application provides low-latency updates for system metrics.
- The backend is designed to handle multiple concurrent connections.
- WebSocket connections for terminal sessions must maintain sub-100ms keystroke-to-render latency under normal network conditions.
- SSH connections to remote servers are pooled per server — multiple terminal sessions to the same server reuse one underlying SSH connection via independent shell channels.

### Changelog

Refer to [CHANGELOG](CHANGELOG.md) for version history and updates.

### Contributing

We appreciate your interest in contributing to RemoteOps! Your contributions help us improve and grow. Please feel free to submit pull requests, report issues, or suggest new features. Your feedback and participation are highly valued as we continue to develop and enhance the platform.

### License

RemoteOps is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.