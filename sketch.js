// 高中中文能力測驗題庫（共五題）
let questions = [
  {
    prompt: "下列選項中的成語，何者用字完全正確？",
    options: [
      "針貶時弊 / 墨守成規",
      "金榜題名 / 班門弄斧",
      "鬼斧神工 / 再接再勵",
      "世外桃園 / 尤抱琵琶"
    ],
    answer: 1 // 金榜題名 / 班門弄斧（A針砭、C再接再厲、D世外桃源）
  },
  {
    prompt: "下列關於先秦諸子思想的敘述，何者正確？",
    options: [
      "老子主張「兼愛」、「非攻」以治天下",
      "孟子主張「性善說」，認為人皆有惻隱之心",
      "荀子主張「性惡說」，因此全盤否定禮樂教化",
      "莊子強調積極入世，以拯救亂世蒼生為己任"
    ],
    answer: 1 // 孟子主張「性善說」
  },
  {
    prompt: "「文起八代之衰，而道濟天下之溺」是指下列哪一位文學家？",
    options: ["陶淵明", "蘇軾", "王安石", "韓愈"],
    answer: 3 // 韓愈（蘇軾〈潮州韓文公廟碑〉評韓愈之言）
  },
  {
    prompt: "下列各句詩詞，何者描寫的季節是「秋季」？",
    options: [
      "接天蓮葉無窮碧，映日荷花別樣紅",
      "亂花漸欲迷人眼，淺草才能沒馬蹄",
      "停車坐愛楓林晚，霜葉紅於二月花",
      "忽如一夜春風來，千樹萬樹梨花開"
    ],
    answer: 2 // 停車坐愛楓林晚（秋季）
  },
  {
    prompt: "下列「」中的字，何者讀音兩兩相同？",
    options: [
      "「剖」析 / 步履維「艱」",
      "「纖」維 / 「殲」滅",
      "「酗」酒 / 撫「恤」",
      "「瞠」目結舌 / 「螳」臂擋車"
    ],
    answer: 2 // 酗、恤皆讀ㄒㄩˋ
  }
];

let currentQuestion = 0;   // 目前題目的索引
let score = 0;             // 累計答對題數
let hasAnswered = false;   // 是否已經作答當前題目
let quizFinished = false;  // 測驗是否已結束

// 按鈕陣列與下一題按鈕
let optionButtons = [];
let nextButton;

function setup() {
  // 建立全螢幕畫布，自動適配手機、平板、電腦
  createCanvas(windowWidth, windowHeight);

  // 設定畫布預設文字字型為 Google Fonts 的 Noto Serif HK
  textFont('Noto Serif HK');

  // 建立「下一題 / 看總成績」按鈕
  nextButton = createButton('下一題');
  styleButton(nextButton, '#2b2d42', '#ffffff');
  nextButton.hide(); // 初始隱藏，答題後才顯示
  nextButton.mousePressed(nextQuestionHandler);

  // 建立四個選項按鈕
  for (let i = 0; i < 4; i++) {
    let btn = createButton('');
    styleOptionButton(btn);
    let idx = i;
    btn.mousePressed(() => checkAnswer(idx));
    optionButtons.push(btn);
  }

  // 初始化介面與按鈕位置
  updateQuizUI();
}

function draw() {
  // 設定背景顏色為 #e1e5f2
  background(225, 229, 242);

  // 根據螢幕尺寸動態調整字型大小（RWD響應式設計）
  let isMobile = width < 600;
  let titleSize = isMobile ? 20 : 26;
  let promptSize = isMobile ? 18 : 22;

  if (!quizFinished) {
    // 繪製頂端測驗標題與進度
    push();
    textSize(titleSize);
    fill(43, 45, 66);
    noStroke();
    textAlign(CENTER, TOP);
    text(
      `高中中文能力測驗 (第 ${currentQuestion + 1} 題 / 共 ${questions.length} 題)`,
      width / 2,
      isMobile ? 20 : 40
    );
    pop();

    // 題目卡片尺寸與位置
    let boxWidth = min(width - 40, 700);
    let boxHeight = isMobile ? 130 : 110;
    let boxY = isMobile ? 110 : 130;

    // 繪製題目卡片背景（以中心為基準）
    push();
    fill(255, 255, 255, 200);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, boxY, boxWidth, boxHeight, 12);
    pop();

    // 顯示題目文字：文字框同樣以中心為基準，正好落在卡片正中央
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    fill(43, 45, 66);
    noStroke();
    textSize(promptSize);
    text(questions[currentQuestion].prompt, width / 2, boxY, boxWidth - 30, boxHeight - 20);
    pop();

  } else {
    // 測驗結束後的結算畫面
    let finishTitleSize = isMobile ? 26 : 36;
    let finishTextSize = isMobile ? 18 : 24;

    push();
    noStroke();
    textAlign(CENTER, CENTER);

    textSize(finishTitleSize);
    fill(43, 45, 66);
    text("📜 測驗圓滿結束！ 📜", width / 2, height / 2 - 100);

    textSize(finishTextSize);
    fill(75, 83, 105);
    text(`您的總得分為：${score * 20} 分`, width / 2, height / 2 - 30);
    text(`總答對題數：${score} / ${questions.length} 題`, width / 2, height / 2 + 20);
    pop();
  }
}

// 更新選項按鈕的文字與動態排版位置（支援不同螢幕寬度）
function updateQuizUI() {
  if (quizFinished) return;

  let q = questions[currentQuestion];
  let isMobile = width < 600;

  // 計算選項按鈕的寬高與起始 Y 座標
  let btnWidth = min(width - 40, 700);
  let btnHeight = isMobile ? 55 : 50;
  let startY = isMobile ? 200 : 210;
  let spacing = isMobile ? 65 : 62;

  for (let i = 0; i < 4; i++) {
    let btn = optionButtons[i];
    btn.html(`(${i + 1}) ${q.options[i]}`);
    btn.show();

    // 恢復選項按鈕的預設樣式
    styleOptionButton(btn);

    // 定位按鈕位置（置中排列）
    btn.size(btnWidth, btnHeight);
    btn.position(width / 2 - btnWidth / 2, startY + i * spacing);
  }

  // 隱藏下一題按鈕，重設作答狀態
  nextButton.hide();
  hasAnswered = false;
}

// 檢查使用者點選的答案
function checkAnswer(selectedIndex) {
  if (hasAnswered) return; // 防止重複點擊
  hasAnswered = true;

  let q = questions[currentQuestion];
  let isMobile = width < 600;

  if (selectedIndex === q.answer) {
    score++;
    // 答對：選項轉為綠色，文字變白
    optionButtons[selectedIndex].style('background-color', '#2b9348');
    optionButtons[selectedIndex].style('color', '#ffffff');
    optionButtons[selectedIndex].style('border', '2px solid #1b4332');
    playCorrectSound();
  } else {
    // 答錯：選錯的變紅，正確答案顯示綠色
    optionButtons[selectedIndex].style('background-color', '#d90429');
    optionButtons[selectedIndex].style('color', '#ffffff');
    optionButtons[selectedIndex].style('border', '2px solid #8d0801');

    optionButtons[q.answer].style('background-color', '#2b9348');
    optionButtons[q.answer].style('color', '#ffffff');
    optionButtons[q.answer].style('border', '2px solid #1b4332');
    playWrongSound();
  }

  // 設置「下一題」或「看總成績」按鈕的文字與位置
  if (currentQuestion < questions.length - 1) {
    nextButton.html('下一題 ➔');
  } else {
    nextButton.html('查看總成績 🏆');
  }

  let btnWidth = min(width - 40, 300);
  let startY = isMobile ? 200 : 210;
  let spacing = isMobile ? 65 : 62;

  nextButton.show();
  nextButton.size(btnWidth, 48);
  nextButton.position(width / 2 - btnWidth / 2, startY + 4 * spacing + 10);
}

// 點擊「下一題」按鈕後的處理邏輯
function nextQuestionHandler() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    updateQuizUI();
  } else {
    quizFinished = true;
    // 結算時隱藏所有作答按鈕
    for (let btn of optionButtons) {
      btn.hide();
    }
    nextButton.hide();
  }
}

// 視窗大小改變時自動調整畫布與元件
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (!quizFinished) {
    updateQuizUI();
  }
}

// 選項按鈕通用樣式設定（套用 Noto Serif HK 字型）
function styleOptionButton(btn) {
  btn.style('font-family', '"Noto Serif HK", serif');
  btn.style('font-weight', '500');
  btn.style('font-size', width < 600 ? '15px' : '17px');
  btn.style('background-color', '#ffffff');
  btn.style('color', '#2b2d42');
  btn.style('border', '2px solid #8d99ae');
  btn.style('border-radius', '8px');
  btn.style('cursor', 'pointer');
  btn.style('text-align', 'left');
  btn.style('padding-left', '15px');
  btn.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.05)');
}

// 下一題按鈕通用樣式設定（套用 Noto Serif HK 字型）
function styleButton(btn, bgColor, textColor) {
  btn.style('font-family', '"Noto Serif HK", serif');
  btn.style('font-size', '18px');
  btn.style('font-weight', 'bold');
  btn.style('background-color', bgColor);
  btn.style('color', textColor);
  btn.style('border', 'none');
  btn.style('border-radius', '8px');
  btn.style('cursor', 'pointer');
  btn.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.15)');
}

// 答對音效（需載入 p5.sound 函式庫）
function playCorrectSound() {
  let osc = new p5.Oscillator('sine');
  osc.freq(587.33); // D5 音符
  osc.amp(0.2);
  osc.start();
  osc.stop(0.18); // 0.18 秒後自動停止
}

// 答錯音效
function playWrongSound() {
  let osc = new p5.Oscillator('sawtooth');
  osc.freq(160); // 低音頻率
  osc.amp(0.25);
  osc.start();
  osc.stop(0.25); // 0.25 秒後自動停止
}