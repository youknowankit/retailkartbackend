# 🛒 RetailKart Backend

Backend API for the **RetailKart E-Commerce Platform**, built using the MERN stack. This server handles authentication, product management, image uploads, order processing, payment integration, email services, and database operations.

---

## 🚀 Features

- User Authentication & Authorization
- JWT-Based Secure Authentication
- Password Hashing with Bcrypt
- Product Management APIs
- Image Uploads using Multer & Cloudinary
- Order Management
- Razorpay Payment Gateway Integration
- Email Notifications using Nodemailer
- MongoDB Database Integration
- Environment Variable Configuration
- RESTful API Architecture

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Token (JWT)
- BcryptJS

### File Uploads

- Multer
- Cloudinary
- DataURI

### Payments

- Razorpay

### Email Services

- Nodemailer

### Utilities

- dotenv
- cors

---

## 📦 Installed Dependencies

```json
{
  "bcryptjs": "^3.0.3",
  "cloudinary": "^2.9.0",
  "cors": "^2.8.6",
  "datauri": "^4.1.0",
  "dotenv": "^17.3.1",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.3.2",
  "multer": "^2.1.1",
  "nodemailer": "^8.0.4",
  "nodemon": "^3.1.14",
  "razorpay": "^2.9.6"
}
```

---

## 📂 Project Structure

```bash
RetailKartBackend/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
├── uploads/
│
├── .env
├── server.js
├── package.json
└── README.md
```

> Folder names may vary based on your implementation.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/retailkartbackend.git
```

Move into the project directory:

```bash
cd retailkartbackend
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Running the Server

### Development Mode

```bash
npm run server
```

### Production Mode

```bash
npm start
```

---

## 🌐 API Responsibilities

### Authentication

- Register User
- Login User
- JWT Verification
- Protected Routes

### Products

- Create Product
- Update Product
- Delete Product
- Fetch Products

### Orders

- Create Orders
- Manage Orders
- Update Order Status

### Payments

- Razorpay Order Creation
- Payment Verification

### Image Uploads

- Upload Product Images
- Cloudinary Storage

### Email Services

- Order Confirmation Emails
- Notification Emails

---

## 🔒 Security Features

- Password Hashing using BcryptJS
- JWT Authentication
- Environment Variables Protection
- Secure API Access
- CORS Configuration

---

## 📈 Future Improvements

- Role-Based Access Control (RBAC)
- Refresh Tokens
- Product Reviews & Ratings
- Wishlist Functionality
- Coupon System
- Inventory Management
- Analytics Dashboard

---

## 👨‍💻 Author

**Ankit Yadav**

---

## 📄 License

This project is licensed under the ISC License.

---

⭐ If you found this project useful, consider giving it a star on GitHub.

# 🛒 RetailKart Backend

Backend API for the **RetailKart E-Commerce Platform**, built using the MERN stack. This server handles authentication, product management, image uploads, order processing, payment integration, email services, and database operations.

---

## 🚀 Features

- User Authentication & Authorization
- JWT-Based Secure Authentication
- Password Hashing with Bcrypt
- Product Management APIs
- Image Uploads using Multer & Cloudinary
- Order Management
- Razorpay Payment Gateway Integration
- Email Notifications using Nodemailer
- MongoDB Database Integration
- Environment Variable Configuration
- RESTful API Architecture

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Token (JWT)
- BcryptJS

### File Uploads

- Multer
- Cloudinary
- DataURI

### Payments

- Razorpay

### Email Services

- Nodemailer

### Utilities

- dotenv
- cors

---

## 📦 Installed Dependencies

```json
{
  "bcryptjs": "^3.0.3",
  "cloudinary": "^2.9.0",
  "cors": "^2.8.6",
  "datauri": "^4.1.0",
  "dotenv": "^17.3.1",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.3.2",
  "multer": "^2.1.1",
  "nodemailer": "^8.0.4",
  "nodemon": "^3.1.14",
  "razorpay": "^2.9.6"
}
```

---

## 📂 Project Structure

```bash
RetailKartBackend/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
├── uploads/
│
├── .env
├── server.js
├── package.json
└── README.md
```

> Folder names may vary based on your implementation.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/retailkartbackend.git
```

Move into the project directory:

```bash
cd retailkartbackend
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Running the Server

### Development Mode

```bash
npm run server
```

### Production Mode

```bash
npm start
```

---

## 🌐 API Responsibilities

### Authentication

- Register User
- Login User
- JWT Verification
- Protected Routes

### Products

- Create Product
- Update Product
- Delete Product
- Fetch Products

### Orders

- Create Orders
- Manage Orders
- Update Order Status

### Payments

- Razorpay Order Creation
- Payment Verification

### Image Uploads

- Upload Product Images
- Cloudinary Storage

### Email Services

- Order Confirmation Emails
- Notification Emails

---

## 🔒 Security Features

- Password Hashing using BcryptJS
- JWT Authentication
- Environment Variables Protection
- Secure API Access
- CORS Configuration

---

## 📈 Future Improvements

- Role-Based Access Control (RBAC)
- Refresh Tokens
- Product Reviews & Ratings
- Wishlist Functionality
- Coupon System
- Inventory Management
- Analytics Dashboard

---

## 👨‍💻 Author

**Ankit Yadav**

---

## 📄 License

This project is licensed under the ISC License.

---

⭐ If you found this project useful, consider giving it a star on GitHub.
