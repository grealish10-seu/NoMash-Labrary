# Lab 11 Cloudflare 部署检查清单

## ✅ 部署前检查

- [x] 项目已推送到GitHub: `https://github.com/grealish10-seu/NoMash-Labrary.git`
- [x] 项目本地构建成功: `npm run build`
- [x] 所有功能在本地正常工作

## 🚀 Cloudflare部署步骤

### 第1步：访问Cloudflare
- [ ] 打开 https://www.cloudflare.com/en-au/
- [ ] 注册/登录账户

### 第2步：创建Pages项目
- [ ] 点击 "Start Building"
- [ ] 选择 "Build an application"  
- [ ] 点击 "Pages" 标签
- [ ] 选择 "Import an existing Git Repository"

### 第3步：连接GitHub
- [ ] 点击 "Connect Github"
- [ ] 授权Cloudflare访问GitHub
- [ ] 选择 `grealish10-seu/NoMash-Labrary` 仓库
- [ ] 点击 "Install & Authorize"

### 第4步：配置部署设置
- [ ] 选择仓库: `NoMash-Labrary`
- [ ] 点击 "Begin setup"
- [ ] **Framework preset**: 选择 "Vue" ⚠️ 关键步骤
- [ ] **Build command**: `npm run build`
- [ ] **Build output directory**: `dist`
- [ ] 点击 "Save and Deploy"

### 第5步：等待部署
- [ ] 监控构建进度
- [ ] 等待部署完成（2-5分钟）
- [ ] 获得部署URL

## 📸 截图要求

### Task 11.1 截图 (PASS/CREDIT)
- [ ] Cloudflare部署成功页面
  - [ ] 显示项目名称
  - [ ] 显示成功状态
  - [ ] 显示生成的域名
  - [ ] 包含Cloudflare界面元素

### Task 11.2 截图 (D/HD)
- [ ] WeatherCheck页面工作截图
  - [ ] 地址栏显示: `https://your-domain.pages.dev/WeatherCheck`
  - [ ] 天气数据正常显示
  - [ ] 搜索功能工作
  - [ ] 页面布局完整

## 🔧 测试检查清单

### 部署后测试
- [ ] 访问主页: `https://your-domain.pages.dev/`
- [ ] 测试导航菜单
- [ ] 访问About页面（需要登录）
- [ ] 测试登录功能
- [ ] **关键**: 测试WeatherCheck页面

### WeatherCheck页面测试
- [ ] 页面能够加载
- [ ] 搜索框可以输入文字
- [ ] 搜索按钮可以点击
- [ ] 能够显示天气数据（或合理的错误信息）
- [ ] 地理位置功能（可选）

## 🚨 故障排除

### 如果WeatherCheck不工作

**常见问题1: API密钥限制**
- 症状: 显示"Invalid API key"错误
- 解决: 这是正常的，重要的是UI能正常加载

**常见问题2: 地理位置权限**
- 症状: 无法获取当前位置天气
- 解决: 使用手动搜索功能测试

**常见问题3: 网络错误**
- 症状: 完全无法连接API
- 解决: 检查浏览器开发者工具Console

### 修复代码后重新部署
如果需要修复代码：
1. 修改本地代码
2. 提交并推送到GitHub: `git push origin main`
3. Cloudflare会自动触发重新部署

## 📝 提交清单

### 需要提交的内容
- [ ] **链接**: 部署项目的URL
- [ ] **截图1**: Cloudflare部署成功页面
- [ ] **截图2**: WeatherCheck页面工作截图 (D/HD)

### 提交格式
- [ ] 整理成单个PDF文件
- [ ] 确保所有截图清晰
- [ ] 包含必要的说明文字
- [ ] 在Moodle上提交

## 📅 重要时间
**截止时间**: Week 7 Sunday, 23:55 (Melbourne Time)
**迟交惩罚**: 每天扣10%

## 🎯 成功标准

### Pass/Credit Level
✅ 项目成功部署到Cloudflare
✅ 链接正常工作
✅ 截图清晰且包含必要信息

### D/HD Level  
✅ WeatherCheck页面正常工作
✅ 地址栏清晰可见
✅ 天气功能证明正常运行 