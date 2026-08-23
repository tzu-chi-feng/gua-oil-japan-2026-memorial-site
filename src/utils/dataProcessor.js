import Papa from 'papaparse';

export const processExpenseData = (expenseCsv, itineraryCsv, splitCsv) => {
  const expenseResult = Papa.parse(expenseCsv, { header: true, dynamicTyping: true, skipEmptyLines: true });
  const itineraryResult = Papa.parse(itineraryCsv, { header: true, dynamicTyping: true, skipEmptyLines: true });
  const splitResult = Papa.parse(splitCsv, { header: true, dynamicTyping: true, skipEmptyLines: true });

  const expenses = expenseResult.data;
  const itinerary = itineraryResult.data;
  const splits = splitResult.data;

  // 預處理分攤資料，按 account ID 分組
  const splitMap = {};
  splits.forEach(s => {
    const aid = s['account ID'];
    if (!aid) return;
    if (!splitMap[aid]) splitMap[aid] = [];
    splitMap[aid].push({
      person: s['旅伴名稱'],
      amountTWD: Math.abs(s['台幣結算'] || 0)
    });
  });
  
  const stats = {
    totalTWD: 0,
    byCategory: {},
    byPayer: { '油': 0, '瓜': 0 },
    byDay: {},
    totalRebate: 0,
    paymentMethods: {},
  };

  const awards = {
    biggestSpender: null,
    mostTiringDay: null,
    topFoodie: null,
    shoppingKing: null,
  };

  let maxSpend = 0, maxCount = 0, maxFood = 0, maxShop = 0;

  // 1. 先處理行程資料，建立每一天的基礎架構
  itinerary.forEach(item => {
    const day = item['第幾天'];
    if (!day) return;
    
    if (!stats.byDay[day]) {
      stats.byDay[day] = {
        day: day,
        title: "",
        total: 0,
        count: 0,
        events: [], // 這裡存放合併後的行程與消費
        miscExpenses: [] // 這裡存放找不到 eventID 的雜項消費
      };
    }

    // 處理每日主題
    if (item['景點名稱'] === '今天的主題是') {
      stats.byDay[day].title = item['筆記'] || "";
      return;
    }

    // 基礎行程物件
    stats.byDay[day].events.push({
      eventId: item['event ID'],
      name: item['景點名稱'],
      order: item['順序'],
      note: item['筆記'],
      type: 'itinerary',
      expenses: [] // 該行程對應的消費
    });
  });

  // 2. 處理消費資料，並嘗試掛載到對應行程下
  expenses.forEach(row => {
    const amountTWD = Math.abs(row['支付金額'] * (row['匯率'] || 1));
    const payer = row['付款人'];
    const category = row['消費類型'];
    const day = row['第幾天'];
    const eventId = row['event ID'];

    if (row['付款方式'] === '系統回饋') {
      stats.totalRebate += amountTWD;
      return;
    }

    // 統計資料
    stats.totalTWD += amountTWD;
    stats.byCategory[category] = (stats.byCategory[category] || 0) + amountTWD;
    if (stats.byPayer[payer] !== undefined) stats.byPayer[payer] += amountTWD;

    // 趣味獎項計算
    if (amountTWD > maxSpend) {
      maxSpend = amountTWD;
      awards.biggestSpender = { name: row['品項名稱'], amount: amountTWD, day: day };
    }
    if (category?.includes('飲食') && amountTWD > maxFood) {
      maxFood = amountTWD;
      awards.topFoodie = { name: row['品項名稱'], amount: amountTWD, day: day };
    }
    if (category?.includes('購物') && amountTWD > maxShop) {
      maxShop = amountTWD;
      awards.shoppingKing = { name: row['品項名稱'], amount: amountTWD, day: day };
    }

    // 掛載消費到行程
    if (day && stats.byDay[day]) {
      stats.byDay[day].total += amountTWD;
      
      const expenseItem = {
        id: row['account ID'],
        name: row['品項名稱'],
        category: category,
        amountTWD: amountTWD,
        payer: payer,
        splits: splitMap[row['account ID']] || [] // 夾帶分攤詳情
      };

      const targetEvent = stats.byDay[day].events.find(e => e.eventId === eventId);
      if (targetEvent) {
        targetEvent.expenses.push(expenseItem);
      } else {
        // 如果找不到對應 eventID，塞入該日的雜項消費清單
        stats.byDay[day].miscExpenses.push(expenseItem);
      }
    }
  });

  // 3. 鐵腿日計算
  Object.values(stats.byDay).forEach(d => {
    if (d.events.length > maxCount) {
      maxCount = d.events.length;
      awards.mostTiringDay = { day: d.day, count: d.events.length };
    }
    // 排序每一天的事件 (按順序)
    d.events.sort((a, b) => (a.order || 999) - (b.order || 999));
  });

  const sortedDays = Object.values(stats.byDay).sort((a, b) => a.day - b.day);

  return { stats, timeline: sortedDays, awards };
};

export const fetchAndProcessData = async () => {
  const baseUrl = import.meta.env.BASE_URL;
  const [expenseRes, itineraryRes, splitRes] = await Promise.all([
    fetch(`${baseUrl}data/expenses.csv`),
    fetch(`${baseUrl}data/itinerary.csv`),
    fetch(`${baseUrl}data/splits.csv`)
  ]);

  if (!expenseRes.ok || !itineraryRes.ok || !splitRes.ok) {
    throw new Error('無法讀取行程、消費或分攤資料檔');
  }

  const [expenseText, itineraryText, splitText] = await Promise.all([
    expenseRes.text(),
    itineraryRes.text(),
    splitRes.text()
  ]);

  return processExpenseData(expenseText, itineraryText, splitText);
};
