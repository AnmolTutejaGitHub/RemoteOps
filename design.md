# RemoteOps — Requirements and Design Document

**Version:** 1.0  
**Date:** 26 March 2026  
**Author:** Anmol Tuteja  
**Repository:** https://github.com/AnmolTutejaGitHub/RemoteOps

---

## 1. Introduction

RemoteOps is a web-based remote server management platform that allows users to monitor system metrics, execute SSH commands, and manage multiple remote machines from a single interface. This document outlines the requirements and system design for the platform.

---

## 2. Goals

- To simplify remote server management through a centralized platform.
- To provide real-time monitoring of system metrics such as CPU and RAM usage.
- To enable secure execution of SSH commands on remote machines.
- To reduce the complexity of managing multiple servers.
- To build a scalable and efficient system for remote operations.
- To provide an interactive browser-based terminal emulator for live shell access to remote servers.

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | Users can register and log in using secure authentication. |
| FR-02 | Users can connect to remote servers by providing SSH credentials (host, username, password or private key). |
| FR-03 | The system fetches and displays CPU utilization in real time. |
| FR-04 | The system fetches and displays RAM usage (total and used) in real time. |
| FR-05 | Users can execute shell commands on remote servers and view output. |
| FR-06 | The system maintains a per-server history of executed commands. |
| FR-07 | The platform supports both personal and group-based server connections. |
| FR-08 | Users can open a browser-based interactive terminal with full PTY (pseudo terminal) support, enabling tools like `vim`, `top`, and tab completion via a persistent WebSocket connection. |
| FR-09 | The system supports multiple concurrent terminal sessions across different servers, each with an isolated SSH shell channel. |

### 3.2 Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | SSH credentials are stored encrypted and never exposed to the client. |
| NFR-02 | System metric updates are delivered with low latency. |
| NFR-03 | The backend handles multiple concurrent SSH and WebSocket connections. |
| NFR-04 | SSH connections are pooled per server — multiple sessions to the same server reuse one SSH connection via independent shell channels. |

---

## 4. System Architecture

RemoteOps follows a three-tier architecture: a Next.js frontend, a Node.js/Express backend, and a MongoDB database.

```
┌─────────────────────┐        ┌──────────────────────┐        ┌─────────────────┐
│   Browser           │        │   Node.js Server     │        │  Remote Server  │
│                     │        │                      │        │                 │
│  Next.js (React)    │◄─HTTP─►│  Express REST API    │        │                 │
│  xterm.js terminal  │◄─WSS──►│  WebSocket relay     │◄─SSH──►│  port 22        │
│                     │        │  ssh2 (SSH client)   │        │                 │
└─────────────────────┘        └──────────┬───────────┘        └─────────────────┘
                                          │
                                          ▼
                                ┌──────────────────┐
                                │    MongoDB       │
                                │  users, servers  │
                                │  command history │
                                └──────────────────┘
```

---

## 5. Component Design

### 5.1 Frontend (Next.js)

- **Dashboard** — displays all connected servers with live CPU and RAM usage, connection status, and uptime.
- **Command Executor** — a text input that sends a command via HTTP POST to the backend, which SSHes into the target server and returns the output.
- **Terminal Emulator** — `xterm.js` renders a full VT100 terminal in the browser. Each keystroke is sent over a WebSocket to the server, and output streams back in real time.
- **Server Manager** — UI for adding, editing, and removing servers. Credentials are submitted over HTTPS and stored encrypted.

### 5.2 Backend (Node.js + Express)

- **REST API** — handles authentication (JWT), server CRUD, command execution, and metrics polling.
- **WebSocket Server (`ws`)** — accepts terminal session connections from the browser. Each connection is authenticated via JWT before any SSH session is started.

### 5.3 Database (MongoDB)
This section will be updated once the codebase is complete.

---

## 6. Terminal Emulator Design

The terminal emulator is the most technically complex feature. It bridges the browser and a remote shell using three layers:

```
User types keystroke
       │
       ▼
xterm.js (browser) ──WebSocket──► Node.js server ──SSH stream──► Remote server PTY
                                                                         │
xterm.js renders ◄──WebSocket──── Node.js server ◄──SSH stream────────── ┘
```

---

## 7. Security Design

- **Credential storage** — SSH private keys and passwords are encrypted with AES-256 before being stored in MongoDB. They are decrypted in memory only at connection time and never sent to the frontend.
- **Authentication** — all API routes and WebSocket connections require a valid JWT. 
- **Transport security** — all client–server communication uses HTTPS and WSS (TLS) in production.
- **Access control** — users can only access servers they own or have been explicitly granted access to via group membership.

---

## 8. APIs
This section will be updated once the codebase is complete.

---

## 9. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (React), xterm.js, xterm-addon-fit |
| Backend | Node.js, Express, ws, ssh2 |
| Database | MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken) |
| Deployment |  |