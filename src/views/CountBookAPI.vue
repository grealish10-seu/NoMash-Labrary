<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">📚 Count Book API</h1>
        <p class="text-center text-muted mb-4">
          Local API service displaying JSON data from authors.json
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 loading-text">Loading authors data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Error!</h4>
      <p>{{ error }}</p>
    </div>

    <!-- API Response -->
    <div v-else-if="apiResponse" class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title mb-0">📊 Statistics Summary</h3>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-6">
                <h2 class="text-primary">{{ authorsCount }}</h2>
                <p class="text-muted">Total Authors</p>
              </div>
              <div class="col-6">
                <h2 class="text-success">{{ totalBooks }}</h2>
                <p class="text-muted">Total Books</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-header">
            <h3 class="card-title mb-0">👥 Authors Overview</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Author Name</th>
                    <th>Book Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="author in apiResponse.data.authors" :key="author.name">
                    <td>{{ author.name }}</td>
                    <td>
                      <span class="badge bg-primary">{{ author.bookCount }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title mb-0">🔗 API Response (JSON)</h3>
            <small class="text-muted">Generated at: {{ new Date(apiResponse.timestamp).toLocaleString() }}</small>
          </div>
          <div class="card-body">
            <div class="api-response">
              <pre class="bg-light p-3 rounded"><code>{{ JSON.stringify(apiResponse, null, 2) }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="text-center mt-4">
      <button 
        class="btn btn-primary btn-lg" 
        @click="getApiData"
        :disabled="loading"
      >
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        {{ loading ? 'Loading...' : 'Refresh API Data' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)

const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

const getApiData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Import the JSON data using ES6 import
    const authorsModule = await import('@/assets/json/authors.json')
    const data = authorsModule.default
    
    authors.value = data
    calculateStats()
    
    // Create API response object
    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map(author => ({
          name: author.name,
          bookCount: author.famousWorks.length,
          birthYear: author.birthYear,
          genres: author.genres
        }))
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        source: "local-authors-api"
      }
    }
    
    console.log('📚 API Data loaded successfully:', apiResponse.value)
    
  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`
    console.error('❌ Error loading authors data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getApiData()
})

// Expose methods for parent components
defineExpose({
  getApiData
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
  font-size: 0.9rem;
  max-height: 400px;
  overflow-y: auto;
  border: 2px solid #dee2e6;
  background-color: #f8f9fa !important;
  color: #212529 !important;
  font-weight: 500;
  line-height: 1.5;
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

/* 统计数字样式 */
h2.text-primary {
  color: #0056b3 !important;
  font-weight: 700;
}

h2.text-success {
  color: #28a745 !important;
  font-weight: 700;
}

/* 表格样式 */
.table {
  color: #212529 !important;
  background-color: #ffffff;
}

.table th {
  background-color: #e9ecef !important;
  color: #2c3e50 !important;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  color: #495057 !important;
  font-weight: 500;
  border-bottom: 1px solid #dee2e6;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f8f9fa !important;
}

/* 徽章样式 */
.badge.bg-primary {
  background-color: #0056b3 !important;
  color: #ffffff !important;
  font-weight: 600;
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
    font-size: 0.8rem;
    max-height: 300px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style> 