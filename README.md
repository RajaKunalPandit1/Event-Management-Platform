# 🌐 Event Management Platform

A powerful, role-based event management system built with **Django (Backend)** and **React + Vite (Frontend)**, JWT-based authentication with protected routes and scheduled email reminders via AWS Lambda and deployed with a production-grade AWS CI/CD infrastructure.

🎥 **Demo Video**: [Watch on YouTube](https://www.youtube.com/watch?v=A69P-NmbC1s)
---

## 🧠 Table of Contents

- [Overview](#overview)
- [Roles and Features](#roles-and-features)
- [Reminders and Notifications](#reminders-and-notifications)
- [Password Reset Feature](#password-reset-feature)
- [Deployment Architecture](#deployment-architecture)
  - [Frontend Deployment](#frontend-deployment)
  - [Backend Deployment](#backend-deployment)
  - [Database and Monitoring](#database-and-monitoring)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

---

## 🚀 Overview

This is a role-based event management platform where users can RSVP to events, receive reminder emails, and filter events based on **date** and **location**. The platform ensures scalable and secure deployment using AWS services like ECS Fargate, CloudFront, RDS, Lambda, and more.

---

## 👥 Roles and Features

### 🧑‍💼 User
- RSVP to events with statuses: **Going**, **Not Going**, **Might Go**
- View public events
- Filter events by **date** and **location**

### 💎 Premium User
- All features of the basic user
- Access **Premium Events** earlier than regular users

### 🛠️ Admin
- Create, update, and delete events
- Mark events as **Premium**
- View event guest lists
- Remove RSVPs of any user

---

## 📩 Reminders and Notifications

- RSVP'd users receive **email reminders** a day before their events
- Implemented via **AWS Lambda** and **EventBridge**
  - Lambda containerized and pushed to ECR
  - Triggered daily by EventBridge to check and notify upcoming RSVPs

---

## 🔐 Password Reset Feature

Users can request a password reset via email. The tokenized link allows secure password update through the frontend.

**Backend Logic** (Django):

```python
@csrf_exempt
def request_password_reset(request):
    ...
    # Generate uid & token
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
    # Email sending logic
    ...
