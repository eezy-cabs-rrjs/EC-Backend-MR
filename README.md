# 🚖 EEZY CABS - Backend System

The central backend infrastructure for **EEZY CABS**, a scalable, microservices-based ride-hailing platform. This repository houses the API Gateway and the suite of isolated services that power the rider, driver, and admin applications.

---

## 📌 Table of Contents
- [System Overview](#-system-overview)
- [Architecture](#-architecture)
  - [Service Ecosystem](#-service-ecosystem)
  - [Data Layer](#-data-layer)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Microservices Port Mapping](#-microservices-port-mapping)
- [Contact](#-contact)

---

## ☁️ System Overview

The EEZY CABS backend is built to handle the complex orchestration required for modern ride-hailing. It features a **Modular Microservices Architecture** accessed via a central **API Gateway**. The system supports:

* **Real-time Geolocation:** WebSocket-based tracking for drivers and active rides.
* **Dynamic Pricing:** Demand-based fare calculation (Surge pricing).
* **Split Payments & Payouts:** Automated driver earnings processing via Stripe Connect.
* **Geofencing:** Regulatory compliance and service area management.
* **Support & Dispute Resolution:** Ticket-based support system.

---

## 🏗 Architecture

The system uses an **API Gateway** pattern. Clients (Mobile Apps/Web) communicate only with the Gateway, which routes requests to the appropriate background services via HTTP or acts as a proxy for WebSocket connections.

### 🖼️ Architecture Diagram
![EEZY CABS Architecture Diagram](https://raw.githubusercontent.com/eezy-cabs-rrjs/EC-Backend-MR/refs/heads/main/Arch-Diagram.png)

### 🧩 Service Ecosystem

The application is decomposed into domain-specific services:

| Service | Description |
| :--- | :--- |
| **🛡️ Auth Service** | Handles JWT issuance, user registration, and secure login. |
| **👤 User Service** | Manages rider/driver profiles and KYC verification documents. |
| **🚕 Booking Service** | The core engine for ride requests, matching logic, and state management. |
| **📍 Location Service** | Real-time WebSocket gateway for tracking driver coordinates. |
| **💵 Payout Service** | Manages driver bank accounts, earnings, and Stripe Connect payouts. |
| **🏷️ Pricing Service** | Calculates fares based on distance, time, and demand surges. |
| **⭐ Rating Service** | Handles double-blind rating system for riders and drivers. |
| **💬 Chat Service** | Enables in-app messaging between rider and driver. |
| **🆘 Support Service** | Manages dispute tickets and lost-and-found issues. |
| **📊 Analytics Service** | Aggregates data for admin business insights. |

### 💾 Data Layer

We utilize a polyglot persistence strategy:
* **PostgreSQL:** Primary transactional data (Users, Bookings, Payments, Payouts).
* **MongoDB:** Unstructured high-volume data (Chat logs, Notifications, Analytics events).
* **Redis:** Caching, Session management, and Pub/Sub for real-time location updates.

---

## 📌 Tech Stack

* **Framework:** NestJS (Node.js)
* **Language:** TypeScript
* **ORM:** Prisma (PostgreSQL) / Mongoose (MongoDB)
* **Communication:** HTTP (Inter-service), Socket.io (Real-time)
* **Payments:** Stripe API & Stripe Connect
* **Infrastructure:** Docker, Docker Compose
* **External APIs:** Google Maps (Distance Matrix/Geocoding)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Docker & Docker Compose
* pnpm (or npm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/EEZY-CABS/eezy-cabs-backend.git](https://github.com/EEZY-CABS/eezy-cabs-backend.git)
    cd eezy-cabs-backend
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root (and inside specific service folders if running individually) following the `.env.example` template.

4.  **Run with Docker (Recommended):**
    To spin up the Gateway, all Microservices, Databases (Postgres/Mongo), and Redis:
    ```bash
    docker-compose up --build
    ```

---

## 🔌 Microservices Port Mapping

If running services locally without the internal Docker network, referencing these ports is essential:

| Service | Local Port |
| :--- | :--- |
| **API Gateway** | `3000` |
| **Auth Service** | `3001` |
| **User Service** | `3002` |
| **Booking Service** | `3003` |
| **Location/Socket** | `3004` |
| **Payout Service** | `3005` |
| **Rating Service** | `3006` |
| **Support Service** | `3007` |
| **Incentive Service** | `3008` |
| **Analytics Service** | `3009` |
| **Geofencing Service**| `3010` |

---

## 📬 Contact

If you’re a recruiter or hiring manager and would like to see a live demo or get a walkthrough of the architecture — feel free to reach out!

👤 **Name:** Rishiraj Sajeev
📧 **Email:** rishirajsajeev@gmail.com
📞 **Phone:** +91 7012256686
