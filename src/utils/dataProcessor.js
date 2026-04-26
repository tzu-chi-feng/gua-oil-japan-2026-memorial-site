import Papa from 'papaparse';

export const processExpenseData = (csvString) => {
  const result = Papa.parse(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const data = result.data;
  
  // 1. 基礎統計資料
  const stats = {
    totalTWD: 0,
    byCategory: {},
    byPayer: { '油': 0, '瓜': 0 },
    byDay: {},
    totalRebate: 0,
    paymentMethods: {},
  };

  data.forEach(row => {
    // 取得台幣金額 (金額 * 匯率)
    // 注意：CSV 裡的金額通常是負數（代表支出）
    const amountTWD = Math.abs(row['支付金額'] * (row['匯率'] || 1));
    const payer = row['付款人'];
    const category = row['消費類型'];
    const day = row['第幾天'] || '其他';
    const method = row['付款方式'];

    // 排除系統回饋，分開計算
    if (method === '系統回饋') {
      stats.totalRebate += amountTWD;
      return;
    }

    // 加總總額
    stats.totalTWD += amountTWD;

    // 按類別統計
    stats.byCategory[category] = (stats.byCategory[category] || 0) + amountTWD;

    // 按付款人統計 (排除系統)
    if (stats.byPayer[payer] !== undefined) {
      stats.byPayer[payer] += amountTWD;
    }

    // 按支付方式統計
    stats.paymentMethods[method] = (stats.paymentMethods[method] || 0) + amountTWD;

    // 按天數分組原始資料
    if (!stats.byDay[day]) {
      stats.byDay[day] = {
        day: day,
        total: 0,
        items: [],
        count: 0
      };
    }
    stats.byDay[day].total += amountTWD;
    stats.byDay[day].count += 1;
    stats.byDay[day].items.push({
      id: row['account ID'],
      eventId: row['event ID'],
      location: row['行程名稱'],
      name: row['品項名稱'],
      category: category,
      method: method,
      currency: row['支付幣別'],
      amountOriginal: row['支付金額'],
      amountTWD: amountTWD,
      payer: payer
    });
  });

  // 2. 計算趣味獎項 (Awards)
  const awards = {
    biggestSpender: null, // 單筆最高
    mostTiringDay: null,  // 行程最多
    topFoodie: null,      // 最貴一餐
    shoppingKing: null,   // 購物狂 (單筆購物最高)
  };

  let maxSpend = 0;
  let maxCount = 0;
  let maxFood = 0;
  let maxShop = 0;

  data.forEach(row => {
    const amount = Math.abs(row['支付金額'] * (row['匯率'] || 1));
    const cat = row['消費類型'];
    const method = row['付款方式'];
    
    if (method === '系統回饋') return;

    // 破財大魔王
    if (amount > maxSpend) {
      maxSpend = amount;
      awards.biggestSpender = { name: row['品項名稱'], amount: amount, day: row['第幾天'] };
    }

    // 吃貨金賞
    if (cat?.includes('飲食') && amount > maxFood) {
      maxFood = amount;
      awards.topFoodie = { name: row['品項名稱'], amount: amount, day: row['第幾天'] };
    }

    // 購物王
    if (cat?.includes('購物') && amount > maxShop) {
      maxShop = amount;
      awards.shoppingKing = { name: row['品項名稱'], amount: amount, day: row['第幾天'] };
    }
  });

  // 鐵腿日
  Object.values(stats.byDay).forEach(d => {
    if (d.count > maxCount && d.day !== '其他') {
      maxCount = d.count;
      awards.mostTiringDay = { day: d.day, count: d.count };
    }
  });

  // 排序天數
  const sortedDays = Object.values(stats.byDay).sort((a, b) => {
    if (a.day === '其他') return 1;
    if (b.day === '其他') return -1;
    return a.day - b.day;
  });

  return {
    raw: data,
    stats: stats,
    timeline: sortedDays,
    awards: awards
  };
};

export const fetchAndProcessData = async () => {
  const response = await fetch('/data/expenses.csv');
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value);
  return processExpenseData(csv);
};
