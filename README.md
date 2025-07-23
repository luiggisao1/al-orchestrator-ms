# Gateway Microservice

## Overview

This gateway microservice serves as a central orchestrator between the frontend and other backend services, specifically the kitchen microservice and mwarehouse microservice. It acts as an API gateway to handle and route all requests from the frontend to the appropriate service and manages the return of responses.

## Key Features

- **Request Orchestration**: Routes frontend requests to appropriate microservices
- **Real-time Notifications**: Updates frontend about order status and pmarket purchases
- **RabbitMQ Integration**: Uses RPC queues to facilitate communication between services
- **Central Gateway**: Simplifies the architecture by providing a single point of entry for frontend requests

## Technical Architecture

The service uses RabbitMQ with RPC (Remote Procedure Call) queues to establish communication channels with other microservices. This approach enables:

- Asynchronous processing
- Service decoupling
- Efficient message routing
- Reliable communication

## Communication Flow

1. Frontend sends requests to this gateway service
2. Gateway routes requests to appropriate microservices (kitchen, mwarehouse)
3. Microservices process requests and return responses through RabbitMQ
4. Gateway sends notifications and updates back to the frontend

## Setup and Configuration

### Prerequisites

- Docker
- Docker Compose

### Installation

Clone the repository:

```bash
git clone https://github.com/luiggisao1/al-orchestrator-ms
cd al-orchestrator-ms
docker compose up --build
```

This will:

- Build the Docker container for the gateway service
- Set up RabbitMQ for message queuing
- Configure network connections between services
- Start the gateway service on the configured port

The service should now be accessible at the configured port (default: 3000).

## API Documentation

[Include API endpoints, request/response formats, etc.]

## Dependencies

- RabbitMQ
- Express.js
- TypeScript
- Docker

## Related Repositories

To run the complete system, you will need to set up these additional microservices:

### Kitchen Microservice

This service handles food preparation and cooking processes.

```bash
git clone https://github.com/luiggisao1/alegra-kitchen
cd al-kitchen-ms
docker compose up --build
```

### Warehouse Microservice

This service manages product inventory, stock levels, and supply chain operations.

```bash
git clone https://github.com/luiggisao1/alegra-warehouse
cd al-warehouse-ms
docker compose up --build
```

For the complete system to function properly, all three microservices should be running simultaneously.
