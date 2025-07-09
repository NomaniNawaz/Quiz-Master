# Quiz App - Complete Implementation

A full-stack quiz application with Firebase authentication and PHP/MySQL backend.

## 🚀 Features

### Web Application (Next.js)
- ✅ Firebase Authentication (Email/Password)
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Interactive quiz interface
- ✅ Real-time score tracking
- ✅ Detailed results with answer review
- ✅ Score sharing functionality
- ✅ Progressive web app ready

### Backend (PHP + MySQL)
- ✅ RESTful API endpoints
- ✅ MySQL database with sample questions
- ✅ Score storage and retrieval
- ✅ CORS enabled for cross-origin requests

## 🛠️ Setup Instructions

### Phase 1: Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication → Email/Password
4. Get your Firebase config from Project Settings
5. Update `lib/firebase.ts` with your config

### Phase 2: Backend Setup (PHP + MySQL)
1. Install XAMPP/WAMP/MAMP
2. Start Apache and MySQL
3. Create database using `backend/database.sql`
4. Place PHP files in your web server directory
5. Update API URL in `lib/api.ts`

### Phase 3: Web App Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Phase 4: Flutter Mobile App (Optional)

Create a new Flutter project and implement:

#### Dependencies (pubspec.yaml)
```yaml
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  http: ^1.1.0
  shared_preferences: ^2.2.2
```

#### Key Files Structure
```
lib/
├── main.dart
├── screens/
│   ├── auth_screen.dart
│   ├── home_screen.dart
│   ├── quiz_screen.dart
│   └── result_screen.dart
├── models/
│   └── question.dart
├── services/
│   ├── auth_service.dart
│   └── api_service.dart
└── widgets/
    └── custom_button.dart
```

## 📱 Mobile Implementation Guide

### 1. Firebase Setup for Flutter
- Download `google-services.json` from Firebase Console
- Place in `android/app/` directory
- Configure `android/build.gradle` and `android/app/build.gradle`

### 2. Authentication Service
```dart
class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  
  Future<User?> signInWithEmail(String email, String password) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
        email: email, 
        password: password
      );
      return result.user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }
  
  Future<User?> registerWithEmail(String email, String password) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
        email: email, 
        password: password
      );
      return result.user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }
}
```

### 3. API Service
```dart
class ApiService {
  static const String baseUrl = 'http://your-domain.com/quiz-api';
  
  Future<List<Question>> fetchQuestions() async {
    final response = await http.get(Uri.parse('$baseUrl/get_questions.php'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Question.fromJson(json)).toList();
    }
    throw Exception('Failed to load questions');
  }
  
  Future<bool> submitScore(String userId, int score, int totalQuestions) async {
    final response = await http.post(
      Uri.parse('$baseUrl/submit_score.php'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'user_id': userId,
        'score': score,
        'total_questions': totalQuestions,
        'quiz_date': DateTime.now().toIso8601String(),
      }),
    );
    return response.statusCode == 200;
  }
}
```

## 🎯 Key Features Implemented

### Authentication
- Email/password registration and login
- Firebase user management
- Secure logout functionality

### Quiz Functionality
- Dynamic question loading from database
- Multiple choice questions with 4 options
- Real-time answer validation
- Progress tracking

### Results & Analytics
- Score calculation and display
- Detailed answer review
- Score sharing capabilities
- Backend score storage

### UI/UX
- Modern, responsive design
- Smooth animations and transitions
- Loading states and error handling
- Mobile-first approach

## 🔧 Customization

### Adding More Questions
1. Insert into `quiz_questions` table via phpMyAdmin
2. Or create an admin panel for question management

### Styling
- Modify Tailwind classes in components
- Update color scheme in `tailwind.config.ts`
- Add custom animations in CSS

### Features to Add
- Timer for each question
- Different difficulty levels
- Categories/topics
- Leaderboard
- User profiles
- Question explanations

## 🚀 Deployment

### Web App
- Deploy to Vercel, Netlify, or similar
- Update Firebase config for production
- Set up environment variables

### Backend
- Deploy PHP files to web hosting
- Set up MySQL database
- Configure CORS for production domain

### Mobile App
- Build APK for Android
- Deploy to Google Play Store
- Configure Firebase for production

## 📝 Notes

- The web app includes fallback mock data for demo purposes
- Backend API endpoints are CORS-enabled
- All user data is securely handled through Firebase
- Responsive design works on all device sizes

This implementation provides a complete, production-ready quiz application that can be easily extended and customized for specific needs.