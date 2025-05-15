<template>
  <div class="container">
    <div class="header">
      <span class="header-item" :class="{'stale-text': isDataStale}">
        数据更新时间：{{ updateTimeFormatted }}
      </span>
      <span class="header-item">HIVE价格：{{ hivePriceUSDT }}</span>
      <span class="header-item">BTC价格：{{ btcPriceUSDT }}</span>
      <span class="header-item">ETH价格：{{ ethPriceUSDT }}</span>
    </div>
    <table>
      <colgroup>
        <col style="width: 150px;" />
        <col style="width: 80px;" />
        <col style="width: 80px;" />
        <col style="width: 230px;" />
        <col style="width: 230px;" />
        <col style="width: 230px;" />
      </colgroup>
      <thead>
        <tr>
          <th>名称</th>
          <th class="narrow-col">BN比率</th>
          <th class="narrow-col">HE比率</th>
          <th>BN价格</th>
          <th>HE价格</th>
          <th>BNUSDT计价</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="configCoin in orderedCoinConfig" :key="configCoin.key">
          <tr v-if="apiCoinData[configCoin.key]" :class="{'red-row': isRowRed(apiCoinData[configCoin.key])}">
            <td class="first-col">
              <img v-if="configCoin.icon" :src="configCoin.icon" :alt="configCoin.displayName" class="icon" />
              {{ configCoin.displayName }}
            </td>
            <td class="narrow-col" :class="{'bold-cell': apiCoinData[configCoin.key].isGtThreshold1}">
              {{ formatRatio(apiCoinData[configCoin.key].ratio1) }}
            </td>
            <td class="narrow-col" :class="{'bold-cell': apiCoinData[configCoin.key].isGtThreshold2}">
              {{ formatRatio(apiCoinData[configCoin.key].ratio2) }}
            </td>
            <td>{{ formatPrice(apiCoinData[configCoin.key].binanceHive) }} HIVE</td>
            <td>{{ formatPrice(apiCoinData[configCoin.key].heHive) }} HIVE</td>
            <td>{{ formatPrice(apiCoinData[configCoin.key].binanceUsdt) }} USDT</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "PriceTable",
  data() {
    return {
      updateTime: null,             // 数据更新时间
      currentTimestamp: Date.now(), // 当前时间戳
      apiCoinData: {},              // 存储从 /data 获取的对象
      // 定义显示顺序、名称和图标。
      // 'key' 必须与后端 JSON 对象中的键匹配 (例如 "bnb", "axs")。
      orderedCoinConfig: [
        { key: "bnb",    displayName: "BNB",    icon: "/binance-coin-bnb-logo.png" },
        { key: "axs",    displayName: "AXS",    icon: "/axie-infinity-axs-logo.png?v=014" },
        { key: "slp",    displayName: "SLP",    icon: "/smooth-love-potion-slp-logo.png?v=014" },
        // AXSSLP 现在是一个常规条目, 假设 API 数据中有 'axsslp' 键
        { key: "axsslp", displayName: "AXSSLP", icon: "/axie-infinity-axs-logo.png?v=014" }, // 使用 AXS 图标
        { key: "sps",    displayName: "SPS",    icon: "/sps-logo.png"}, // 如果不同，请替换为实际的 logo URL
        { key: "matic",  displayName: "MATIC",  icon: "/polygon-matic-logo.png?v=014" },
        { key: "ltc",    displayName: "LTC",    icon: "/litecoin-ltc-logo.png?v=014" },
        { key: "bch",    displayName: "BCH",    icon: "/bitcoin-cash-bch-logo.png?v=014" },
        { key: "btc",    displayName: "BTC",    icon: "/bitcoin-btc-logo.png?v=014" }, // BTC 表格行
        { key: "eth",    displayName: "ETH",    icon: "/ethereum-eth-logo.png?v=014" },
        { key: "sol",    displayName: "SOL",    icon: "/solana-sol-logo.png?v=014" },
        { key: "doge",   displayName: "DOGE",   icon: "/dogecoin-doge-logo.png?v=014" },
        { key: "steem",  displayName: "STEEM",  icon: "/steem-steem-logo.png?v=014" }
        // 如果 HIVE 也需要在表格中作为一行显示, 在此添加:
        // { key: "hive", displayName: "HIVE", icon: "HIVE_图标_URL" },
      ],
      // Express 应用的 baseUrl。
      // 如果 Vue 应用由同一个 Express 应用提供服务 (例如在 3000 端口上),
      // 且 Express 路由是 /data, 则此值可以是 '' 或 'http://localhost:3000'。
      // 原始代码使用 3000 端口作为后端。
      baseUrl: `${window.location.protocol}//${window.location.hostname}:3000`,
      fetchDataInterval: null,
      updateTimestampInterval: null,
    };
  },
  computed: {
    hivePriceUSDT() {
      // hiveUsdt作为一个冗余字段添加在每一个coin的dict里面了，这里就判断一下btc的
      // 期望 API 返回: { ..., "hive": { "binanceUsdt": 0.3 }, ... }
      const hiveData = this.apiCoinData.btc;
      return hiveData && typeof hiveData.hiveUsdt !== 'undefined' ? this.formatPrice(hiveData.hiveUsdt) : "N/A";
    },
    btcPriceUSDT() {
      // 期望 API 返回: { ..., "btc": { "binanceUsdt": 60000 }, ... }
      const btcData = this.apiCoinData.btc; // 此 'btc' 用于头部显示
      return btcData && typeof btcData.binanceUsdt !== 'undefined' ? this.formatPrice(btcData.binanceUsdt) : "N/A";
    },
    ethPriceUSDT() {
      // 期望 API 返回: { ..., "btc": { "binanceUsdt": 60000 }, ... }
      const ethData = this.apiCoinData.eth; // 此 'btc' 用于头部显示
      return ethData && typeof ethData.binanceUsdt !== 'undefined' ? this.formatPrice(ethData.binanceUsdt) : "N/A";
    },
    updateTimeFormatted() {
      return this.updateTime ? this.updateTime.toLocaleString() : "暂无数据";
    },
    isDataStale() {
      // 数据超过1分钟未更新则认为是过时的
      return this.updateTime ? (this.currentTimestamp - this.updateTime.getTime() > 60000) : false;
    }
  },
  methods: {
    async fetchData() {
      try {
        // 从 Express 应用的 /data 端点获取数据
        const response = await fetch(`${this.baseUrl}/coins`);
        if (!response.ok) {
          throw new Error(`HTTP错误！状态码: ${response.status}`);
        }
        this.apiCoinData = await response.json();
        this.updateTime = new Date();
        // console.log('已获取币种数据:', this.apiCoinData);
      } catch (error) {
        console.error("数据获取失败：", error);
        // 可以考虑在 data() 中设置一个错误消息并在 UI 中显示
      }
    },
    updateCurrentTimestamp() {
      this.currentTimestamp = Date.now();
    },
    formatPrice(value) {
      const n = parseFloat(value);
      if (isNaN(n)) return "N/A";
      if (n >= 1000) {
        return n.toFixed(0);
      } else if (n >= 1 && n < 1000) {
        return n.toFixed(2);
      } else if (n < 1 && n > 0.01) {
        return n.toFixed(3);
      } else { // 包括 0 和小于等于 0.01 的数字
        return n.toFixed(5);
      }
    },
    formatRatio(value) {
      const n = parseFloat(value);
      if (isNaN(n)) return "N/A";
      return n.toFixed(3); // 比率显示三位小数
    },
    isRowRed(coinDetails) {
      // coinDetails 是 apiCoinData 中的一个值对象, 例如 apiCoinData.bnb
      if (!coinDetails) return false;
      return coinDetails.isGtThreshold1 || coinDetails.isGtThreshold2;
    }
  },
  mounted() {
    this.fetchData();
    // 每5秒获取一次数据，可根据需要调整
    this.fetchDataInterval = setInterval(this.fetchData, 2000);
    this.updateTimestampInterval = setInterval(this.updateCurrentTimestamp, 1000);
  },
  beforeUnmount() {
    clearInterval(this.fetchDataInterval);
    clearInterval(this.updateTimestampInterval);
  }
};
</script>

<style scoped>
/* 样式与您原始内容基本相同，因为它们主要与表示相关 */
.container {
  font-family: Arial, sans-serif;
  margin: 20px auto;
  width: 1000px;
  transition: background-color 1s ease;
}

/* 顶部 header 美化 */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #dfefff, #ffffff);
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 1s ease, color 1s ease;
}
.header-item {
  margin: 0 10px;
  padding: 0 10px;
  border-right: 1px solid #ccc;
  transition: background-color 1s ease, color 1s ease;
}
.header-item:last-child {
  border-right: none;
}
/* 当数据滞后时，仅“数据更新时间”文字闪烁 */
.stale-text {
  animation: flashingText 1s infinite;
}
@keyframes flashingText {
  0% { color: red; }
  50% { color: white; } /* 在浅色背景上，考虑使用更深的颜色以获得更好的可见性 */
  100% { color: red; }
}

/* 表格样式 */
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  transition: background-color 1s ease, color 1s ease, transform 1s ease;
}
th {
  background-color: #f2f2f2;
}

/* 第一列不换行 */
td.first-col {
  white-space: nowrap;
}

/* 隔行变色（非红色行） */
tbody tr:nth-child(even):not(.red-row) {
  background-color: #f9f9f9;
}

/* 红色行背景 */
.red-row {
  background-color: #ffcccc;
}
.red-row td.narrow-col {
  background-color: #ffcccc; /* 如果需要，确保红色行中的窄列也应用红色背景 */
}

/* 超过设定阈值的单元格加粗 */
.bold-cell {
  font-weight: bold;
}

/* 狭窄列背景色 */
td.narrow-col {
  background-color: #fcfcfc;
}

/* 图标样式 */
.icon {
  width: 24px;
  height: 24px;
  max-width: 24px;
  max-height: 24px;
  vertical-align: middle;
  margin-right: 5px;
  transition: transform 1s ease;
}

/* 数字变动时的过渡效果 */
td {
  transition: background-color 1s ease, color 1s ease, transform 1s ease;
}
</style>