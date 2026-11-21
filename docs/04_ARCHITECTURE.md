# 04 ARCHITECTURE｜系統架構與技術選擇

- Project ID：CI-2026-001　　版本：v0.1

## 1. 架構概觀
純靜態網站：瀏覽器載入 HTML／CSS／JS 與本地 vendor。無伺服器端邏輯、無 API、無資料庫。未來如需真實案件處理，必須另行規劃後端並取得創辦人批准（本期不做）。

## 2. 技術選擇與理由
| 層級 | 選擇 | 為什麼 | 替代方案 |
|---|---|---|---|
| 前端 | 手寫 HTML／CSS／JS | 無建置步驟、離線可開、易於 Pages 部署、列印可控 | React＋Vite（本期過重） |
| 簡報框架 | 自製投影片引擎 | 完全控制鍵盤、觸控、列印與 RWD；避免額外相依 | Reveal.js（需 vendor 且列印客製較繁） |
| 圖表 | Chart.js 4.x（本地 `vendor/chart.umd.min.js`） | 成熟、離線、授權清楚 | 純 SVG 手繪（維護成本高） |
| 部署 | GitHub Actions → GitHub Pages | 與 BOT 05 標準流程一致 | 從分支直接發佈（較少建置控制） |

## 3. 資料夾結構（準備推送到 repo 根目錄的內容＝`prototype/`）
```
prototype/
├─ index.html              # 簡報入口
├─ gateway.html            # 通道模擬
├─ css/style.css
├─ js/deck.js
├─ js/charts.js
├─ js/gateway.js
├─ vendor/chart.umd.min.js
├─ README.md
└─ .github/workflows/deploy-pages.yml
```

## 4. 安全設計
- 不提交金鑰；無追蹤；模擬資料全為虛構。
- 不請求外站資源（無 CDN、無熱連結圖片）。
- 公開 Pages 前再做一次敏感資料與外連掃描。

## 5. 技術債與未來擴充
- 英文版、.pptx 匯出、真實機構合作介面均不在本期。
- Chart.js 已鎖定本機檔案；日後升級須再做回歸測試。
