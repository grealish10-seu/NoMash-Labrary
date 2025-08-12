<template>
  <header class="bg-primary text-white p-3">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center">
        <h1 class="h3 mb-0">NoMash Library</h1>
        <nav>
      <ul class="nav nav-pills">
        <li class="nav-item">
              <router-link to="/" class="nav-link text-white">Home (Week 8)</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link text-white">About</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/WeatherCheck" class="nav-link text-white">Get Weather</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/CountBookAPI" class="nav-link text-white">Count Book API</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/GetAllBookAPI" class="nav-link text-white">Get All Book API</router-link>
            </li>
            
            <!-- Firebase Auth Links -->
            <li class="nav-item">
              <router-link to="/FirebaseSignin" class="nav-link text-white">Firebase Auth</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/FireRegister" class="nav-link text-white">FireRegister</router-link>
            </li>
            
            <!-- Protected Links -->
            <li class="nav-item" v-if="isAuthenticated">
              <router-link to="/add-book" class="nav-link text-white">Add Book</router-link>
            </li>
            
            <!-- Authentication Status -->
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link to="/login" class="nav-link text-white">Login</router-link>
            </li>
            <li class="nav-item dropdown" v-if="isAuthenticated">
              <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Welcome, {{ currentUser?.username }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
              </ul>
        </li>
      </ul>
        </nav>
      </div>
    </div>
    </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, currentUser, logout } from '../auth.js'

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
