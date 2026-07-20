# SmartBid

SmartBid is a full-stack auction application with authentication, image uploads, real-time bidding, auction dashboards, category browsing, and winner payments through Razorpay.

## Features

- User registration, login, JWT authentication, and refresh-token cookies
- Create auctions with 2–5 Cloudinary-hosted images
- Browse all, live, personal, and category-filtered auctions
- Separate seller and buyer interfaces
- Real-time bid prices and bid counts with Socket.IO
- Dynamic dashboard statistics
- Winner-only Razorpay payment after an auction ends
- Server-side payment signature verification and webhook confirmation

## Technology

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Authentication | JWT and HTTP-only cookies |
| Images | Cloudinary |
| Real-time updates | Socket.IO |
| Payments | Razorpay Standard Checkout |

## Project structure

```text
Library M/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- MongoDB instance
- Cloudinary Programmable Media account
- Razorpay test account

## Installation

Install backend dependencies:

```powershell
cd Backend
npm install
```

Install frontend dependencies:

```powershell
cd ../Frontend
npm install
```

## Environment variables

Create `Backend/.env`:

```env
PORT=8000
CORS_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017

ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace_with_another_long_random_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

Create `Frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

Never place Cloudinary secrets, JWT secrets, or `RAZORPAY_KEY_SECRET` in the frontend environment.

## Running locally

Start the backend from the `Backend` directory:

```powershell
npm run dev
```

Start the frontend in a second terminal:

```powershell
cd Frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Razorpay setup

1. Open Razorpay Dashboard in Test Mode.
2. Generate a test Key ID and Key Secret.
3. Add them to `Backend/.env` using the exact variable names shown above.
4. Enable automatic payment capture in Razorpay Dashboard.
5. Configure a webhook pointing to:

```text
https://your-public-backend.com/api/v1/payments/webhook
```

Subscribe to:

- `order.paid`
- `payment.captured`

The webhook secret is chosen while creating the webhook and is different from the Razorpay API Key Secret. Razorpay webhooks require a publicly reachable HTTPS backend; `localhost` cannot be used directly.

### Payment workflow

1. The auction ends.
2. The highest bidder receives the payment option.
3. The backend verifies the winner and calculates the amount from stored bids.
4. The backend creates a Razorpay order.
5. Razorpay Checkout collects the payment.
6. The backend verifies the returned signature and Razorpay payment status.
7. The webhook confirms payment asynchronously and broadcasts the update.

The current simplified integration collects funds in the application's Razorpay account. It does not automatically pay the seller.

## Real-time updates

Socket.IO broadcasts:

- New auction creation
- New bids
- Current price and bid-count changes
- Payment completion

Open the same auction in two browser windows to test live bid updates.

## Main API endpoints

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/users/register` | No | Register user |
| POST | `/api/v1/users/login` | No | Log in |
| POST | `/api/v1/users/refresh-token` | Cookie | Refresh access token |
| GET | `/api/v1/users/get-details` | Yes | Current user |
| GET | `/api/v1/auctions` | No | List auctions |
| GET | `/api/v1/auctions/:auctionId` | No | Auction details |
| POST | `/api/v1/auctions/create-auction` | Yes | Create auction |
| POST | `/api/v1/bids` | Yes | Place bid |
| GET | `/api/v1/bids/stats` | Yes | User bid statistics |
| POST | `/api/v1/payments/order` | Yes | Create winner payment order |
| POST | `/api/v1/payments/verify` | Yes | Verify Checkout result |
| POST | `/api/v1/payments/webhook` | Razorpay signature | Confirm payment event |

## Frontend routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/login` | Login |
| `/register` | Registration |
| `/dashboard` | User dashboard |
| `/auction` | Auction listing |
| `/auction/:id` | Auction details |
| `/create-auction` | Create auction |
| `/categories` | Auction categories |

## Validation

Run frontend linting:

```powershell
cd Frontend
npm run lint
```

Create a frontend production build:

```powershell
npm run build
```

## Security notes

- Do not commit `.env` files.
- Use long, independent JWT secrets.
- Keep Razorpay and Cloudinary secrets on the backend only.
- Always calculate auction prices and winners on the backend.
- Treat webhook verification as mandatory in production.
- Use HTTPS and secure cookies in production.
