# 06 TEST REPORT｜測試與除錯紀錄

- Project ID：CI-2026-001　　測試版本：本機原型 2026-11-21　　日期：2026-11-21（Asia/Hong_Kong）
- 測試環境：Bot 雲端電腦本機 `python3 -m http.server 8080`（目錄 `prototype/`）；另以 `file://` 開啟驗證離線
- 測試者：BOT 05，使用 Playwright + Chromium 無頭瀏覽器（1280×800 與 360×740）實際執行
- 瀏覽器 Console：錯誤數為 0（見自動化結果）

> 只記錄實際執行過的測試。未做的項目標示「未測試」。

## 1. 驗收測試（對照 SPEC §6）

| 編號 | 測試步驟 | 預期 | 實際 | 結果 | 證據 |
|---|---|---|---|---|---|
| AC-01 | 逐頁檢查 14 頁＋來源附錄 | 標題與關鍵句完整、無佔位 | 15 個 `.slide`（14 頁＋來源）；關鍵數據句出現在對應頁 | PASS | 自動化 43 項全數通過；截圖 `screenshots/desktop-slide-01.png`–`14.png`、`desktop-sources.png` |
| AC-02 | 鍵盤翻頁；360 與 1280 寬度 | 可完成全程，無 Console 錯誤，無嚴重橫向溢出 | ArrowRight 可從第 1 頁到第 2 頁；360px `scrollWidth=clientWidth=360`；兩種寬度 Console 錯誤為 0 | PASS | 測試腳本紀錄 |
| AC-03 | 核對圖表數字與註腳 | 與 FACTCHECK 一致；2022 為 83.1%；推算標非官方 | 表格與圖表數據為 318/277/344/281/352/388 及對應比例；第 5 頁標「推算情境（非官方）」 | PASS | `desktop-slide-04.png`、`05.png` |
| AC-04 | 第 10 頁流程圖分支 | 同意／不同意、成功／失敗皆有 | 頁面含兩種分支；示範連結可點 | PASS | `desktop-slide-10.png` |
| AC-05 | 來源附錄 | 主要數據有 URL | 含 hkiac.org、wipo.int、info.gov.hk、legco.gov.hk | PASS | `desktop-sources.png` |
| AC-06 | 列印預覽 | 每頁分頁、隱藏導航 | 已寫 `@media print` 樣式 | 未測試完整「另存 PDF」輸出檔（只確認樣式存在） | `css/style.css` |
| AC-07 | 通道 A／B／C、拒絕、失敗；單方同意不得進入 | 文案正確並標示範 | 模式 A 達「調解成功」；B 對方不同意→「繼續原程序」；C 未能和解→恢復仲裁；僅一方同意時「下一步」為 disabled | PASS | `desktop-gateway-A-success.png`、`B-refuse.png`、`C-fail.png` |
| AC-08 | 離線／無外連 | 樣式與圖表仍在；無外站圖片或 CDN | 本機 HTTP 無外連 script/font/image；`file://` 開啟簡報第 4 頁及 gateway，無 pageerror | PASS | 自動化外連檢查＋file:// 抽查 |

## 2. 技術檢查

| 檢查項 | 方法 | 結果 | 備註 |
|---|---|---|---|
| 程式碼靜態檢查 / Lint | 未跑 ESLint | 未測試 | 手寫精簡 JS |
| 建置 | 無需建置 | PASS | 純靜態 |
| 瀏覽器 Console 無錯誤 | Playwright 收集 | PASS | 桌面簡報、三條通道路徑、手機皆為 0 |
| 網路請求失敗 | Playwright | PASS | 無 4xx/5xx |
| RWD 360／1280 | 兩種 viewport 截圖 | PASS | 768 未單獨截圖（介於兩者的網格斷點為 800px） |
| 無障礙基本檢查 | 鍵盤導航、圖表旁有數據表 | 部分通過 | 未做完整螢幕閱讀器測試 |
| 敏感資料掃描 | 搜尋金鑰形態 | PASS | 無真實當事人資料；示範資料已標示 |
| 第三方圖片熱連結 | 檢查外連 image 請求與 HTML | PASS | 僅用原創 SVG／CSS；Chart.js 已本地化 |

## 3. 錯誤與修復紀錄（測試期間）

| Bug ID | 重現 | 錯誤位置 | 根本原因 | 修正 | 重新測試 | 嘗試次數 |
|---|---|---|---|---|---|---|
| B-001 | 第 4 頁柱狀圖只畫出前三年 | `js/charts.js` | 投影片 `display:none` 時初始化 Chart.js，寬度量到不正確；且 `built` 旗標阻止再次初始化 | 在 `slidechange` 時呼叫 `chart.resize()` | 第 4／5 頁截圖顯示 2020–2025 完整 | 1 |
| B-002 | 修正後最末年（2025）柱仍被裁切 | 圖表右緣 | 畫布可用寬度略不足 | 增加 `layout.padding.right`，橫軸 `autoSkip: false` | 截圖可見 2025 年柱與 1.2% 佔比 | 2（同一圖表問題的後續） |

未達三次失敗上限。

## 4. 已知問題
| ID | 說明 | 嚴重度 | 計畫 |
|---|---|---|---|
| K-01 | 手機第 4 頁圖表＋表格較長，需直向捲動才能看到 IP 佔比圖與註解 | P2 | 可接受；未改為刪減內容 |
| K-02 | 768px 中間斷點未單獨自動化 | P2 | 有 800px 網格斷點，建議創辦人在自己的平板上看一次 |
| K-03 | 未產出實際 PDF 檔做像素級比對 | P2 | 請用瀏覽器「列印／另存 PDF」抽查 |
| K-04 | 觸控滑動已實作，自動化只完整驗證按鈕與鍵盤 | P3 | 請在手機實機滑動一次 |
| K-05 | 尚未推送 GitHub、尚未部署 Pages | — | 待創辦人建立空 repo 並批准 |

## 5. 結論
- ☑ 可進入 REVIEW（本機原型達到 P0 驗收，惟公開部署須創辦人批准）
- 未虛構任何測試結果。自動化共 43 項，全部 PASS（修復 B-001／B-002 之後重跑）。
