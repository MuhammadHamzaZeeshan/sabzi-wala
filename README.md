# Sabzi Wala Marketplace

A Django and React-powered B2B fruit and vegetable procurement platform for wholesalers and retailers.  
This project demonstrates practical full-stack development skills including:

- Custom Django user roles (Admin, Wholesaler, Retailer)
- REST API development with Django REST Framework
- Product and live price listing management
- Order placement with automatic total invoice calculation
- React + Tailwind frontend with dynamic API integration

## 🚀 Features

- **Role-Based User System**: Custom authentication model with marketplace roles
- **Product Catalog**: Centralized fruit and vegetable product master
- **Live Price Listings**: Wholesalers can publish per-kg rates and availability
- **Order Management**: Retailers can place quantity-based orders through API
- **Auto Price Calculation**: Invoice total is calculated automatically in backend
- **Responsive Frontend**: Modern React interface for browsing and booking

## 🛠️ Tech Stack

- **Backend**: Django 6, Django REST Framework
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Database**: PostgreSQL

## 🚀 Quick Start

1. **Clone repository:**
   ```bash
   git clone https://github.com/MuhammadHamzaZeeshan/sabzi-wala
   ```

2. **Go to project directory:**
   ```bash
   cd sabzi-wala
   ```

3. **Set up backend environment:**
   ```bash
   cd backend
   python -m venv env
   env\Scripts\activate
   pip install django djangorestframework django-cors-headers django-environ psycopg2-binary
   ```

4. **Create backend environment file (`backend/core/.env`):**
   ```env
   SECRET_KEY=your_secret_key
   DEBUG=True
   DATABASE_URL=postgres://username:password@localhost:5432/sabzi_wala
   ```

5. **Run backend migrations and server:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   Backend runs at: http://127.0.0.1:8000/

6. **Set up frontend (new terminal):**
   ```bash
   cd frontend
   npm install
   ```

7. **Create frontend environment file (`frontend/.env`):**
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

8. **Run frontend server:**
   ```bash
   npm run dev
   ```
   Frontend runs at: http://127.0.0.1:5173/

## 📁 Project Structure

```bash
sabzi-wala/
├── backend/
│   ├── core/                  # Django project settings and routes
│   ├── marketplace/           # Main app: models, serializers, views, URLs
│   └── manage.py              # Django management script
├── frontend/
│   ├── src/                   # React app source code
│   ├── public/                # Static frontend assets
│   └── package.json           # Frontend dependencies and scripts
└── README.md
```

## 🎯 Main API Endpoints

- **Products** (`/api/products/`) - List all available products
- **Listings** (`/api/listings/`) - View/create wholesaler price listings
- **Orders** (`/api/orders/`) - View/create procurement orders
- **Admin** (`/admin/`) - Django admin panel

---

## 👨‍💻 Author

Muhammad Hamza Zeeshan 
Full Stack Developer

---

⭐ Star this repository if it helps you build your next project!
