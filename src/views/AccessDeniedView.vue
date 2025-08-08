<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="error-container">
          <div class="error-icon">
            🚫
          </div>
          <h1 class="error-title">Access Denied</h1>
          <p class="error-message">
            You need to be logged in to access this page.
          </p>
          <p class="error-description">
            This content is restricted to authenticated library members only.
            Please log in with your credentials to continue.
          </p>
          <div class="action-buttons">
            <router-link to="/login" class="btn btn-primary me-3">
              <i class="fas fa-sign-in-alt"></i> Login
            </router-link>
            <router-link to="/" class="btn btn-outline-secondary">
              <i class="fas fa-home"></i> Go Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.error-container {
  padding: 3rem 2rem;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.error-title {
  color: #dc3545;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.error-description {
  color: #868e96;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.action-buttons {
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
  background: transparent;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-1px);
}
</style> 