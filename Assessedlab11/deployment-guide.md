# Lab 11 - Cloudflare Pages 部署指南

## 📋 任务概览

### EFOLIO TASK 11.1 (PASS AND CREDIT LEVEL)
**需要提交：**
- 部署项目的链接
- Cloudflare页面截图（证明是您的部署项目）

### EFOLIO TASK 11.2 (DISTINCTION AND HIGH DISTINCTION LEVEL)
**需要提交：**
- Cloudflare页面截图，包含地址栏，显示Get Weather功能正常工作

## 🚀 部署步骤

### 第一步：准备GitHub仓库
1. 确保您的项目在GitHub上有一个仓库
2. 项目应该只包含一个Vue.js项目（不要包含多个项目）

### 第二步：Cloudflare设置
1. 访问 https://www.cloudflare.com/en-au/
2. 注册/登录账户
3. 点击 "Start Building"
4. 选择 "Build an application"
5. 选择 "Pages" 标签
6. 点击 "Import an existing Git Repository"

### 第三步：连接GitHub
1. 点击 "Connect Github"
2. 授权Cloudflare访问您的GitHub账户
3. 选择包含NoMash-Library项目的仓库
4. 点击 "Install & Authorize"

### 第四步：配置部署
1. 选择仓库后点击 "Begin setup"
2. **重要：在Framework preset中选择 "Vue"**
3. 其他设置保持默认
4. 点击 "Save and Deploy"

### 第五步：等待部署
- 系统会自动构建和部署
- 等待部署完成（通常需要2-5分钟）

## 🔧 常见问题修复

### Weather页面不工作的修复
部署后 `/WeatherCheck` 页面可能出现问题，原因可能包括：

1. **API密钥问题**
2. **CORS问题**
3. **环境变量配置**

## 📸 需要的截图

### Pass/Credit Level截图：
1. **Cloudflare部署成功页面** - 显示域名和部署状态
2. **项目主页** - 显示您的库注册表单

### D/HD Level截图：
1. **Weather页面工作截图** - 显示地址栏和天气数据
2. **浏览器开发者工具** - 显示没有错误

## 📝 提交清单

- [ ] Cloudflare部署链接
- [ ] 部署成功截图
- [ ] Weather功能截图（D/HD）
- [ ] 将所有内容整理成PDF文档
- [ ] 在Moodle上提交

## ⚠️ 注意事项

1. 确保所有截图分辨率清晰
2. 地址栏必须可见
3. 项目链接必须正常工作
4. 截图中应显示您的项目特有内容

## 📅 截止日期
Week 7 Sunday, 23:55 (Melbourne Time)
迟交每天扣10% 