<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Add Book Form -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">📚 Add New Book</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <input
                  type="number"
                  class="form-control"
                  id="isbn"
                  v-model.number="bookForm.isbn"
                  required
                  placeholder="Enter book ISBN"
                />
              </div>
              
              <div class="mb-3">
                <label for="name" class="form-label">Book Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="bookForm.name"
                  required
                  placeholder="Enter book name"
                />
              </div>

              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isLoading ? 'Adding Book...' : 'Add Book' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Book List -->
      <div class="col-md-6">
        <BookList ref="bookList" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/init.js'
import BookList from '../components/BookList.vue'

const bookForm = ref({
  isbn: null,
  name: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const bookList = ref(null)

const addBook = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    // Add book to Firestore
    const docRef = await addDoc(collection(db, "books"), {
      isbn: bookForm.value.isbn,
      name: bookForm.value.name
    })

    console.log('🔥 Book added with ID:', docRef.id)
    successMessage.value = 'Book added successfully!'

    // Clear form
    bookForm.value = {
      isbn: null,
      name: ''
    }

    // Refresh the book list
    await bookList.value?.fetchBooks()

  } catch (error) {
    console.error('Error adding book:', error)
    errorMessage.value = `Failed to add book: ${error.message}`
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border-bottom: none;
}

.btn-primary {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #27ae60 0%, #219a52 100%);
}

.btn-primary:disabled {
  opacity: 0.6;
}
</style> 