# 智財仲調結合——一鍵轉換數位通道

專案 ID：CI-2026-001。把 14 頁論述做成可離線演示的靜態網頁簡報，並附上「一鍵仲調轉換」互動示範（沒有真實後端）。

網站放在 `site/`（對應交付包裡的 `prototype/`）。產品文件放在 `docs/`。GitHub Pages 只發佈 `site/`。

## 這是什麼

- `site/index.html`：14 頁繁體中文簡報，最後另有資料來源附錄。
- `site/gateway.html`：一鍵轉換數位通道的互動示範。
- 圖表使用已內嵌的 Chart.js（`site/vendor/chart.umd.min.js`），不連外站 CDN，可離線開啟。
- **通道裡的姓名、公司、案件編號與專家全部是虛構示範資料。** 介面標示「示範」，不會把資料送出，也不是真實申請入口。
- 簡報裡 2026–2030 的增長路徑，以及 3%／5.4%／8% 的 IP 情境，都標成 **非官方推算**（頁面上的徽章是「推算情境（非官方）」）。這些不是 HKIAC 的官方預測。已公布數據與推算分開標示；入庫時沒有改動簡報上的數字。

## 本機開啟

在倉庫根目錄執行：

```bash
python3 -m http.server 8080
```

然後開啟：

- 簡報：http://127.0.0.1:8080/site/
- 通道示範：http://127.0.0.1:8080/site/gateway.html

也可以直接用瀏覽器開啟 `site/index.html`（`file://`）。樣式、腳本與圖表都是本地檔。

若要模擬 GitHub Pages 專案站的子路徑 `/ip-medarb-gateway/`，把 `site/` 掛在該路徑下再伺服（例如上一層目錄裡放一個名為 `ip-medarb-gateway` 的連結指向 `site/`）。頁面之間與 `css/`、`js/`、`vendor/` 都使用相對路徑，在這個子路徑下可以解析。

簡報操作：鍵盤 ← →、空白鍵、Home／End；底部按鈕；觸控滑動。瀏覽器可列印或另存 PDF。

## 部署到 GitHub Pages

工作流程檔：`.github/workflows/deploy-pages.yml`。

- 觸發：推送到 `main`，或手動執行（`workflow_dispatch`）。
- 步驟使用 `actions/configure-pages`、`actions/upload-pages-artifact`（只上傳 `site/`）、`actions/deploy-pages`。
- 部署環境名稱：`github-pages`。

合併本 PR 之後，請創辦人完成下列設定（本 PR 不會改倉庫設定，也不會自行合併）：

1. 開啟倉庫 **Settings → Pages**。
2. 將 **Source** 設為 **GitHub Actions**。
3. 確認 `main` 上的「Deploy to GitHub Pages」工作流程成功。
4. 預期網址：https://shirosakuraegs.github.io/ip-medarb-gateway/

## 文件

| 檔案 | 內容 |
|---|---|
| `docs/01_PRD.md` | 產品需求 |
| `docs/02_SPEC.md` | 技術規格 |
| `docs/03_UX_FLOW.md` | 操作流程 |
| `docs/04_ARCHITECTURE.md` | 架構說明（原文以 `prototype/` 為推送單位；本倉庫對應目錄是 `site/`） |
| `docs/05_TASKS.md` | 任務與里程碑 |
| `docs/06_TEST_REPORT.md` | 交付前本機測試報告（43 項通過） |
| `docs/FACTCHECK.md` | 數據核對 |
| `docs/PROJECT_CARD.md` | 專案卡 |
| `docs/test-results.json` | 自動化結果 |
| `docs/screenshots/` | 代表性截圖：封面、第 4 頁已公布數據、第 5 頁非官方推算、通道成功路徑、手機封面 |

`docs/screenshots/` 只保留上面五張，方便審閱。測試報告提到的其餘截圖是當時本機測試的產出，沒有全部放進倉庫。

## 資料界線

- 已公布數據（HKIAC、WIPO、立法會、政府新聞稿）維持簡報原文的數字與出處。
- 推算一律視為 **非官方推算**，不要說成官方預測，也不要說成香港每年實際的國際 IP 仲裁宗數。
- 通道示範資料全部虛構。
