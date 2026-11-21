(function () {
  if (typeof Chart === "undefined") {
    console.error("Chart.js 未能載入（請確認 vendor/chart.umd.min.js）");
    return;
  }

  Chart.defaults.font.family = '"PingFang TC","Hiragino Sans CNS","Noto Sans TC","Microsoft JhengHei",sans-serif';
  Chart.defaults.font.size = 11;
  Chart.defaults.color = "#5a6570";

  const navy = "#0b1f3a";
  const teal = "#0e6b6b";
  const gold = "#c4a35a";
  const instances = [];
  let built = false;

  function create() {
    if (built) return;
    const a = document.getElementById("chart-hkiac");
    const b = document.getElementById("chart-forecast");
    const c = document.getElementById("chart-ipshare");
    if (!a || !b || !c) return;
    built = true;

    instances.push(new Chart(a, {
      type: "bar",
      data: {
        labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
        datasets: [
          { label: "全部仲裁案件", data: [318, 277, 344, 281, 352, 388], backgroundColor: navy, borderRadius: 4 },
          { label: "國際案件約數（由比例推算）", data: [230, 226, 286, 211, 269, 327], backgroundColor: teal, borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 16, left: 4, top: 0, bottom: 0 } },
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "已公布數據｜HKIAC 全部仲裁（非 IP 專項案件數）" }
        },
        scales: {
          x: { ticks: { autoSkip: false, maxRotation: 0 } },
          y: { beginAtZero: true, ticks: { stepSize: 50 } }
        }
      }
    }));

    instances.push(new Chart(b, {
      type: "line",
      data: {
        labels: ["2025 基準", "2026", "2027", "2028", "2029", "2030"],
        datasets: [
          {
            label: "國際仲裁推算（假設每年 +6%）",
            data: [327, 347, 368, 390, 413, 438],
            borderColor: gold,
            backgroundColor: "rgba(196,163,90,.2)",
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 4,
            fill: false,
            tension: 0.15
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 16, left: 4 } },
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "推算情境（非官方）｜非 HKIAC 預測" }
        },
        scales: {
          x: { ticks: { autoSkip: false, maxRotation: 0 } },
          y: { suggestedMin: 300, suggestedMax: 460 }
        }
      }
    }));

    instances.push(new Chart(c, {
      type: "bar",
      data: {
        labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
        datasets: [{
          label: "IP 類型佔比（%）",
          data: [2.2, 4.0, 0.6, 2.5, null, 1.2],
          backgroundColor: teal,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 16, left: 4 } },
        plugins: {
          legend: { display: false },
          title: { display: true, text: "已公布數據｜爭議類型中的 Intellectual Property 佔比（2024 未單獨公布）" }
        },
        scales: {
          x: { ticks: { autoSkip: false, maxRotation: 0 } },
          y: { beginAtZero: true, suggestedMax: 8, ticks: { callback: (v) => v + "%" } }
        }
      }
    }));
  }

  function refresh() {
    create();
    instances.forEach(function (ch) {
      ch.resize();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
  window.addEventListener("slidechange", refresh);
  window.addEventListener("resize", refresh);
})();
