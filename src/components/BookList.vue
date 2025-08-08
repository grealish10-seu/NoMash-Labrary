<template>
  <div class="mt-5">
    <h3>📚 Advanced Book Search</h3>
    
    <!-- Query Controls -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">ISBN Range</label>
            <select class="form-select" v-model="queryParams.isbnRange">
              <option value="all">All Books</option>
              <option value="over1000">> 1000</option>
              <option value="over5000">> 5000</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Sort By</label>
            <select class="form-select" v-model="queryParams.sortBy">
              <option value="isbn">ISBN</option>
              <option value="name">Book Name</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Sort Direction</label>
            <select class="form-select" v-model="queryParams.sortDir">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Limit Results</label>
            <select class="form-select" v-model="queryParams.limit">
              <option :value="3">3 Books</option>
              <option :value="5">5 Books</option>
              <option :value="10">10 Books</option>
              <option :value="null">No Limit</option>
            </select>
          </div>
        </div>
        <div class="mt-3">
          <button class="btn btn-primary" @click="fetchBooks">
            🔍 Search Books
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else>
      <div class="alert alert-info mb-3">
        Found {{ books.length }} books matching your criteria
      </div>
      <div v-if="books.length === 0" class="alert alert-warning">
        No books found with current filters
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Book Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>
                <span v-if="editingBook?.id !== book.id">{{ book.isbn }}</span>
                <input
                  v-else
                  type="number"
                  class="form-control"
                  v-model.number="editingBook.isbn"
                  required
                />
              </td>
              <td>
                <span v-if="editingBook?.id !== book.id">{{ book.name }}</span>
                <input
                  v-else
                  type="text"
                  class="form-control"
                  v-model="editingBook.name"
                  required
                />
              </td>
              <td>
                <div v-if="editingBook?.id !== book.id" class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="startEdit(book)">
                    ✏️ Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(book)">
                    🗑️ Delete
                  </button>
                </div>
                <div v-else class="btn-group">
                  <button class="btn btn-sm btn-success" @click="saveEdit()">
                    💾 Save
                  </button>
                  <button class="btn btn-sm btn-secondary" @click="cancelEdit()">
                    ❌ Cancel
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Delete</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete the book "{{ bookToDelete?.name }}"?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" @click="deleteBook()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/init.js'
import { Modal } from 'bootstrap'

const books = ref([])
const loading = ref(true)
const error = ref(null)
const editingBook = ref(null)
const bookToDelete = ref(null)
const deleteModal = ref(null)

// Query parameters
const queryParams = ref({
  isbnRange: 'over1000',
  sortBy: 'isbn',
  sortDir: 'asc',
  limit: 5
})

const fetchBooks = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Build query constraints
    const constraints = []
    
    // ISBN range filter
    if (queryParams.value.isbnRange === 'over1000') {
      constraints.push(where('isbn', '>', 1000))
    } else if (queryParams.value.isbnRange === 'over5000') {
      constraints.push(where('isbn', '>', 5000))
    }
    
    // Sort order
    constraints.push(orderBy(
      queryParams.value.sortBy,
      queryParams.value.sortDir
    ))
    
    // Result limit
    if (queryParams.value.limit) {
      constraints.push(limit(queryParams.value.limit))
    }

    // Create and execute query
    console.log('🔍 Executing query with constraints:', constraints)
    const q = query(collection(db, "books"), ...constraints)
    const querySnapshot = await getDocs(q)
    
    books.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log('🔥 Fetched books:', books.value)
  } catch (err) {
    console.error('Error fetching books:', err)
    error.value = 'Failed to load books: ' + err.message
  } finally {
    loading.value = false
  }
}

// Edit functions
const startEdit = (book) => {
  editingBook.value = { ...book }
}

const cancelEdit = () => {
  editingBook.value = null
}

const saveEdit = async () => {
  try {
    if (!editingBook.value) return

    const bookRef = doc(db, "books", editingBook.value.id)
    await updateDoc(bookRef, {
      isbn: editingBook.value.isbn,
      name: editingBook.value.name
    })

    console.log('🔥 Book updated successfully')
    await fetchBooks()
    editingBook.value = null
  } catch (err) {
    console.error('Error updating book:', err)
    error.value = 'Failed to update book: ' + err.message
  }
}

// Delete functions
const confirmDelete = (book) => {
  bookToDelete.value = book
  const modal = new Modal(deleteModal.value)
  modal.show()
}

const deleteBook = async () => {
  try {
    if (!bookToDelete.value) return

    const bookRef = doc(db, "books", bookToDelete.value.id)
    await deleteDoc(bookRef)

    console.log('🔥 Book deleted successfully')
    const modal = Modal.getInstance(deleteModal.value)
    modal.hide()
    await fetchBooks()
    bookToDelete.value = null
  } catch (err) {
    console.error('Error deleting book:', err)
    error.value = 'Failed to delete book: ' + err.message
  }
}

// Fetch books when component is mounted
onMounted(fetchBooks)

// Expose the fetchBooks method to parent components
defineExpose({ fetchBooks })
</script>

<style scoped>
.table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table thead th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.table tbody tr:hover {
  background-color: #f5f5f5;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.modal-content {
  border-radius: 0.5rem;
}

.modal-header {
  background-color: #f8f9fa;
  border-radius: 0.5rem 0.5rem 0 0;
}

/* New styles */
.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style> 