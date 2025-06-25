 🐄 Farmlink – Livestock & Products Trading System

Farmlink is a digital livestock marketplace that connects farmers, buyers, veterinarians, and transporters. Designed to empower small-scale farmers, the system simplifies the livestock trade process, removes unnecessary middlemen, and increases trust through secure payments and verified listings.

🚀 Key Features

- User Registration & JWT Authentication
- Product Listings – Livestock & related products
- Veterinary Consultation Portal
- Secure M-Pesa Integration for Payments
- Shopping Cart & Checkout System
- Transport Coordination for Delivery
- Mobile-friendly React Frontend

 ⚙️ Tech Stack

| Layer         | Technologies                         |
|---------------|---------------------------------|
| Frontend | React (Vite), Material UI (MUI)      |
| Backend  | Django, Django REST Framework (DRF)  |
| Database  | MongoDB (via Djongo)                |
| Auth    | Djoser (email-based JWT authentication)|
| Payments  | M-Pesa integration (planned)         |
| Other    | Git, GitHub, Git LFS, .env support    |

 Project Structure

FarmlinkApp/
├── farm_link/ # Django backend
├── marketplace-frontend/ # React + Vite frontend
├── dev-tools/ # MongoDB test scripts
├── media/ # Uploaded images
├── .env # Environment variables
├── .gitignore
├── .gitattributes
├── README.md # You're here!
└── Farm_link Design.zip # Design files (tracked via Git LFS)

---

   🛠️ Installation

    1. Clone the repository
```bash
git clone https://github.com/EZRA-KIP/-FARM-LINK-LIVESTOCK-AND-PRODUCTS-TRADING-SYSTEM-.git
cd FarmlinkApp
2. Backend Setup (Django)
bash
Copy
Edit
cd farm_link
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
3. Frontend Setup (React)
bash
Copy
Edit
cd ../marketplace-frontend
npm install
npm run dev
     Usage Guide
Register and log in

Browse or post livestock/product listings

Add to cart, pay securely via M-Pesa

Consult veterinarians or arrange transport

🧪 Dev Tools
For development testing or local MongoDB data imports, refer to:

bash
Copy
Edit
dev-tools/playground-1.mongodb.js
👨‍💻 Author
Ezra Kipyego smaei
Bachelor of Business Information Technology
University of Eastern Africa, Baraton
GitHub: @EZRA-KIP

📜 License
This project is for academic and developmental use only. You may fork or reference it for educational purposes.