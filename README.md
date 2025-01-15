# Cybernatus Assignment - Jatin Shankar Srivasstava


A modern web application for managing user profiles and hobbies with an interactive UI. Cybernatus combines a powerful backend with a responsive and interactive frontend to deliver an exceptional user experience.

## ✨ Features

- Create, edit, delete, and retrieve user profiles
- Add hobbies to users via a draggable interface
- Visualize relationships between users and hobbies with a React Flow interface
- Fully responsive for both desktop and mobile screens
- Toast notifications for user feedback (success and errors)

## 🛠️ Tech Stack

### Frontend:
- **React** (with TypeScript)
- **React Flow Renderer** (for graph visualizations)
- **TailwindCSS** (for styling)
- **React Toastify** (for notifications)

### Backend:
- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)

## 📸 Screenshots

### Complete web
![image](https://github.com/user-attachments/assets/fa5c0c23-7468-41a6-abb9-abb01af39221)
### User Node and Hobbies as childnode
![logo](https://github.com/user-attachments/assets/7e2dc71f-3c4f-4d93-b42e-4a7e8930b318)


## 🚀 Setup and Installation

### Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start server
node index.js
```

### Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```bash
PORT=3000
MONGO_URI=your_mongo_uri
```


## 📚 API Documentation

API documentation is available via Postman:
```bash
{
    "info": {
        "_postman_id": "963974b9-cf71-4baf-86d4-d44a988a6567",
        "name": "cubernatus",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        "description": ""
    },
    "item": [
        {
            "name": "Post user",
            "request": {
                "method": "POST",
                "url": {
                    "raw": "http://localhost:3000/api/users",
                    "path": [
                        "api",
                        "users"
                    ],
                    "protocol": "http",
                    "host": [
                        "localhost"
                    ],
                    "port": "3000"
                },
                "body": {
                    "mode": "raw",
                    "options": {
                        "raw": {
                            "language": "json"
                        }
                    },
                    "raw": "{\r\n  \"username\": \"Rajesh\",\r\n  \"age\": 40,\r\n  \"hobbies\": [\"Singing\", \"Swimming\"]\r\n}\r\n"
                }
            }
        },
        {
            "name": "get users",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "http://localhost:3000/api/users",
                    "path": [
                        "api",
                        "users"
                    ],
                    "protocol": "http",
                    "host": [
                        "localhost"
                    ],
                    "port": "3000"
                }
            }
        },
        {
            "name": "Edit User",
            "request": {
                "method": "PUT",
                "url": {
                    "raw": "http://localhost:3000/api/users/67866823e884382dc333d7fd",
                    "path": [
                        "api",
                        "users",
                        "67866823e884382dc333d7fd"
                    ],
                    "protocol": "http",
                    "host": [
                        "localhost"
                    ],
                    "port": "3000"
                },
                "body": {
                    "mode": "raw",
                    "options": {
                        "raw": {
                            "language": "json"
                        }
                    },
                    "raw": "{\n  \"username\": \"jatinneww\",\n  \"age\": 42,\n  \"hobbies\": [\"Singing\", \"Swimming\"]\n}\n"
                }
            }
        },
        {
            "name": "Delete user",
            "request": {
                "method": "DELETE",
                "url": {
                    "raw": "http://localhost:3000/api/users/67859e95ccd0410494a72fd5",
                    "path": [
                        "api",
                        "users",
                        "67859e95ccd0410494a72fd5"
                    ],
                    "protocol": "http",
                    "host": [
                        "localhost"
                    ],
                    "port": "3000"
                }
            }
        }
    ]
}
```

## 💡 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Made with ❤️ by The Cybernatus Team</strong>
</div>
