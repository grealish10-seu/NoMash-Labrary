<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="welcome-banner">
          <h1>🏛️ About Our Library</h1>
          <p class="lead">Welcome to our digital library! We're dedicated to providing a vast collection of books and resources to our community.</p>
        </div>
      </div>
    </div>

    <!-- Members-only content -->
    <div class="row mt-4">
      <div class="col-md-12">
        <div class="alert alert-success" role="alert">
          <h5 class="alert-heading">🎉 Welcome, Member!</h5>
          <p>You're successfully logged in and can access exclusive member content below.</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">📚 Digital Collection</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Access over 10,000 digital books, journals, and research papers.</p>
            <ul class="list-unstyled">
              <li>✓ E-books</li>
              <li>✓ Academic journals</li>
              <li>✓ Research databases</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-header bg-success text-white">
            <h5 class="card-title mb-0">🕒 24/7 Access</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Round-the-clock access to all digital resources from anywhere.</p>
            <ul class="list-unstyled">
              <li>✓ Online catalog</li>
              <li>✓ Remote access</li>
              <li>✓ Mobile app</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-header bg-info text-white">
            <h5 class="card-title mb-0">🎓 Study Spaces</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Book private study rooms and collaborative spaces online.</p>
            <ul class="list-unstyled">
              <li>✓ Private rooms</li>
              <li>✓ Group spaces</li>
              <li>✓ Computer labs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">📊 Member Statistics</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-md-3">
                <h3 class="text-primary">10,000+</h3>
                <p>Digital Books</p>
              </div>
              <div class="col-md-3">
                <h3 class="text-success">500+</h3>
                <p>Active Members</p>
              </div>
              <div class="col-md-3">
                <h3 class="text-info">50+</h3>
                <p>Study Rooms</p>
              </div>
              <div class="col-md-3">
                <h3 class="text-warning">24/7</h3>
                <p>Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { isAuthenticated, currentUser } from '../auth.js'
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-banner h1 {
  margin-bottom: 1rem;
  font-weight: bold;
}

.card {
  transition: transform 0.2s;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-header {
  border-bottom: none;
}

.list-unstyled li {
  margin-bottom: 0.5rem;
}
</style> 