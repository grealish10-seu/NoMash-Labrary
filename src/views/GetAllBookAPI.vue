<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">📖 Get All Book API</h1>
        <p class="text-center text-muted mb-4">
          API endpoint displaying all books data in JSON format
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 loading-text">Loading all books data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Error!</h4>
      <p>{{ error }}</p>
    </div>

    <!-- API Response -->
    <div v-else-if="allBooksData" class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title mb-0">📚 All Books API Response</h3>
            <small class="text-muted">Generated at: {{ new Date(allBooksData.metadata.timestamp).toLocaleString() }}</small>
          </div>
          <div class="card-body">
            <div class="api-response">
              <pre class="bg-light p-3 rounded"><code>{{ JSON.stringify(allBooksData, null, 2) }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="text-center mt-4">
      <button 
        class="btn btn-primary btn-lg" 
        @click="fetchAllBooks"
        :disabled="loading"
      >
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        {{ loading ? 'Loading...' : 'Refresh All Books Data' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const allBooksData = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchAllBooks = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Import the JSON data using ES6 import
    const authorsModule = await import('@/assets/json/authors.json')
    const authorsData = authorsModule.default
    
    // Extract all books from all authors
    const allBooks = []
    authorsData.forEach(author => {
      author.famousWorks.forEach(book => {
        allBooks.push({
          id: `${author.id}-${book.title.replace(/\s+/g, '-').toLowerCase()}`,
          title: book.title,
          year: book.year,
          author: {
            name: author.name,
            birthYear: author.birthYear,
            genres: author.genres
          }
        })
      })
    })
    
    // Create comprehensive API response
    allBooksData.value = {
      success: true,
      totalBooks: allBooks.length,
      totalAuthors: authorsData.length,
      books: allBooks,
      metadata: {
        timestamp: new Date().toISOString(),
        version: "2.0.0",
        endpoint: "/api/books/all",
        description: "Complete list of all books with author information",
        source: "authors.json"
      },
      statistics: {
        booksByDecade: calculateBooksByDecade(allBooks),
        genreDistribution: calculateGenreDistribution(authorsData),
        averagePublicationYear: calculateAverageYear(allBooks)
      }
    }
    
    console.log('📚 All books data loaded successfully:', allBooksData.value)
    
  } catch (err) {
    error.value = `Error loading books data: ${err.message}`
    console.error('❌ Error loading books data:', err)
  } finally {
    loading.value = false
  }
}

// Helper functions for statistics
const calculateBooksByDecade = (books) => {
  const decades = {}
  books.forEach(book => {
    const decade = Math.floor(book.year / 10) * 10
    decades[`${decade}s`] = (decades[`${decade}s`] || 0) + 1
  })
  return decades
}

const calculateGenreDistribution = (authors) => {
  const genres = {}
  authors.forEach(author => {
    author.genres.forEach(genre => {
      genres[genre] = (genres[genre] || 0) + 1
    })
  })
  return genres
}

const calculateAverageYear = (books) => {
  const sum = books.reduce((acc, book) => acc + book.year, 0)
  return Math.round(sum / books.length)
}

onMounted(() => {
  fetchAllBooks()
})

// Expose methods for parent components
defineExpose({
  fetchAllBooks
})
</script>

<style scoped>
/* 改进整体容器的背景和字体 */
.container {
  background-color: #ffffff;
  color: #212529;
  min-height: 100vh;
  padding-bottom: 2rem;
}

/* 主标题样式 */
h1 {
  color: #2c3e50 !important;
  font-weight: 700;
}

/* 副标题样式 */
.text-muted {
  color: #6c757d !important;
  font-weight: 500;
}

/* API响应区域 */
.api-response pre {
  font-size: 0.85rem;
  max-height: 600px;
  overflow-y: auto;
  border: 2px solid #dee2e6;
  background-color: #f8f9fa !important;
  color: #212529 !important;
  font-weight: 500;
  line-height: 1.4;
}

.api-response code {
  color: #495057 !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 卡片样式 */
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #e9ecef;
  background-color: #ffffff;
}

.card-header {
  background-color: #f1f3f4 !important;
  border-bottom: 2px solid #dee2e6;
  color: #2c3e50 !important;
}

.card-title {
  color: #2c3e50 !important;
  font-weight: 600;
}

.card-body {
  background-color: #ffffff;
  color: #212529;
}

/* 加载状态 */
.loading-container {
  padding: 3rem 0;
  background-color: #ffffff;
}

.loading-text {
  color: #495057 !important;
  font-weight: 500;
  font-size: 1.1rem;
}

.spinner-border {
  color: #0056b3 !important;
}

/* 按钮样式 */
.btn-primary {
  background-color: #0056b3 !important;
  border-color: #0056b3 !important;
  color: #ffffff !important;
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #004085 !important;
  border-color: #004085 !important;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 错误信息 */
.alert-danger {
  background-color: #f8d7da !important;
  border-color: #f5c6cb !important;
  color: #721c24 !important;
}

.alert-heading {
  color: #721c24 !important;
  font-weight: 600;
}

/* 时间戳样式 */
.card-header small {
  color: #6c757d !important;
  font-weight: 500;
}

/* 图标动画 */
.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .api-response pre {
    font-size: 0.75rem;
    max-height: 400px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}
</style> 