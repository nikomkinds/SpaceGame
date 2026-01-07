// ===================================================================================
//                             КОСМИЧЕСКАЯ ИГРА
// ===================================================================================

// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let gamePaused = false; // Игра на паузе
let earthOrbitAngle = 0; // Угол вращения Земли по орбите
let earthRotationAngle = 0; // Угол вращения Земли вокруг своей оси
let earthAnimationId = null; // ID анимации вращения Земли
let lastTimestamp = 0; // Последняя временная метка для плавности анимации
let difficultyMultiplier = 1; // Множитель сложности (1 — обычный, 1.3 — сложный)
let earthCurrentX = 0; // Текущая X координата центра Земли
let earthCurrentY = 0; // Текущая Y координата центра Земли
let asteroidInterval = null; // ID интервала генерации астероидов в "Спасти Землю"
let asteroidIdCounter = 0; // Счётчик ID астероидов в "Спасти Землю"
let asteroidAnimationId = null; // ID анимации движения астероидов в "Спасти Землю"
let timeLeft = 60; // Оставшееся время в секундах
let timerInterval = null; // ID таймера
let currentScore = 0; // Текущий счёт игрока
let ufoX = 410; // Текущая X-координата НЛО (начальное положение)
let ufoVelocity = 0; // Скорость движения НЛО по оси X
let ufoSpeed = 5; // Базовая скорость НЛО
let ufoKeys = { left: false, right: false }; // Нажатые клавиши (влево/вправо)
let ufoAnimationId = null; // ID анимации движения НЛО
let asteroidBeltInterval = null; // ID интервала генерации астероидов в "Поясе астероидов"
let asteroidBeltIdCounter = 0; // Счётчик ID астероидов в "Поясе астероидов"
let asteroidBeltAnimationId = null; // ID анимации движения астероидов в "Поясе астероидов"
let diamondInterval = null; // ID интервала генерации алмазов
let diamondIdCounter = 0; // Счётчик ID алмазов
let diamondAnimationId = null; // ID анимации движения алмазов
let ufoBullets = []; // Массив снарядов, выпущенных НЛО
let bulletSpeed = 5; // Скорость снаряда (в пикселях за кадр)
let ufoBulletsAnimationId = null; // ID анимации движения снарядов
let asteroidBigInterval = null; // ID интервала генерации больших астероидов в "Золотой жиле"
let asteroidBigIdCounter = 0; // Счётчик ID больших астероидов в "Золотой жиле"
let asteroidBigAnimationId = null; // ID анимации движения больших астероидов в "Золотой жиле"
let goldInterval = null; // ID интервала генерации золотых астероидов в "Золотой жиле"
let goldIdCounter = 0; // Счётчик ID золотых астероидов в "Золотой жиле"
let goldAnimationId = null; // ID анимации движения золотых астероидов в "Золотой жиле"
let soundEnabled = true; // флаг проигрывания звуков





// ===================================================================================
//                             ОБЩИЕ ФУНКЦИИ И МЕНЮ
// ===================================================================================

// Создание звёздного фона
function createStars() {
  // Получаем контейнер, в который будут добавлены звёзды
  const starsContainer = document.getElementById('stars');
  // Устанавливаем количество звёзд
  const starCount = 100;
  // Цикл для создания каждой звезды
  for (let i = 0; i < starCount; i++) {
    // Создаём элемент div для звезды
    const star = document.createElement('div');
    // Присваиваем класс 'star', чтобы применить к нему стили
    star.className = 'star';
    // Устанавливаем случайное положение по оси X (в процентах от ширины экрана)
    star.style.left = Math.random() * 100 + '%';
    // Устанавливаем случайное положение по оси Y (в процентах от высоты экрана)
    star.style.top = Math.random() * 100 + '%';
    // Устанавливаем случайный размер звезды от 1 до 4 пикселей
    star.style.width = Math.random() * 3 + 1 + 'px';
    // Высота звезды равна ширине (чтобы она была круглой)
    star.style.height = star.style.width;
    // Устанавливаем случайную продолжительность мерцания (от 2 до 6 секунд)
    star.style.setProperty('--duration', Math.random() * 4 + 2 + 's');
    // Устанавливаем случайную задержку перед началом мерцания (от 0 до 5 секунд)
    star.style.animationDelay = Math.random() * 5 + 's';
    // Добавляем звезду в контейнер
    starsContainer.appendChild(star);
  }
}

// Управление страницами
function showPage(pageId) {
  // Сначала скрываем все страницы, убирая у них класс 'active'
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  // Показываем нужную страницу, добавляя ей класс 'active'
  document.getElementById(pageId).classList.add('active');
}

// Показывает страницу авторизации
function showAuth() {
  showPage('authPage');
}

// Показывает главное меню
function showMainMenu() {
  // Обновляет имя игрока в меню
  updateDisplayName();
  // Обновляет состояние кнопок сложности (доступна/недоступна)
  updateAllDifficultyButtons();
  // Обновляет надпись на кнопке переключения звука
  updateSoundButton();
  // Показывает главное меню
  showPage('mainMenu');
}

// Показывает меню выбора сложности для "Спасти Землю"
function showDifficultyMenu() {
  // Обновляет состояние кнопки сложного режима для "Спасти Землю"
  updateDifficultyButtons('earth', 'hardBtnEarth');
  // Показывает меню выбора сложности
  showPage('difficultyMenu');
}

// Показывает меню выбора сложности для "Пояс астероидов"
function showAsteroidsMenu() {
  // Обновляет состояние кнопки сложного режима для "Пояс астероидов"
  updateDifficultyButtons('asteroids', 'hardBtnAsteroids');
  // Показывает меню выбора сложности
  showPage('asteroidsMenu');
}

// Показывает меню выбора сложности для "Золотая жила"
function showGoldMenu() {
  // Обновляет состояние кнопки сложного режима для "Золотая жила"
  updateDifficultyButtons('gold', 'hardBtnGold');
  // Показывает меню выбора сложности
  showPage('goldMenu');
}

// Показывает игровое поле
function showGame() {
  showPage('gamePage');
}

// Показывает таблицу рейтинга
function showRating() {
  // Загружает и отображает рейтинги
  loadRating();
  // Показывает страницу рейтинга
  showPage('ratingPage');
}

// Показывает правила игры
function showRules() {
  showPage('rulesPage');
}

// Функция отображения экрана окончания игры
function showEndGame(result, score) {
  // Получаем элемент страницы окончания игры
  const endGamePage = document.getElementById('endGamePage');
  // Получаем элемент, в который выводится результат (Победа/Поражение)
  const endGameResult = document.getElementById('endGameResult');
  // Получаем элемент, в который выводится итоговый счёт
  const finalScore = document.getElementById('finalScore');

  // Выводим итоговый счёт
  finalScore.textContent = score;

  // Проверяем, выиграл ли игрок
  if (result === 'win') {
    // Выводим "Победа"
    endGameResult.textContent = 'Победа';
    // Добавляем класс 'win', чтобы текст стал зелёным
    endGameResult.className = 'win';
  } else {
    // Выводим "Поражение"
    endGameResult.textContent = 'Поражение';
    // Добавляем класс 'lose', чтобы текст стал красным
    endGameResult.className = 'lose';
  }

  // Показываем экран окончания игры
  showPage('endGamePage');
}

// Функция перезапуска игры
function restartGame() {
  // Получаем уровень, на котором игрок остановился
  const level = localStorage.getItem('currentLevel');
  // Получаем сложность, на которой игрок играл
  const difficulty = localStorage.getItem('currentDifficulty') || 'normal';
  // Проверяем, был ли уровень выбран
  if (level) {
    // Перезапускаем игру с тем же уровнем и сложностью
    startLevelWithDifficulty(level, difficulty);
  } else {
    // Если уровень не выбран, возвращаем в главное меню
    showMainMenu();
  }
}

// Управление игроком
function startGame() {
  // Получаем имя, введённое игроком, и убираем лишние пробелы
  const playerName = document.getElementById('playerName').value.trim();
  // Проверяем, ввёл ли игрок имя
  if (playerName) {
    // Сохраняем имя игрока в локальное хранилище
    localStorage.setItem('currentPlayer', playerName);
    // Показываем главное меню
    showMainMenu();
  } else {
    // Если имя не введено, выводим сообщение
    alert('Пожалуйста, введите имя!');
  }
}

// Обновляет имя игрока в интерфейсе
function updateDisplayName() {
  // Получаем имя игрока из локального хранилища или "Аноним", если его нет
  const playerName = localStorage.getItem('currentPlayer') || 'Аноним';
  // Обновляем текст с именем игрока на странице
  document.getElementById('displayName').textContent = `Космонавт: ${playerName}`;
}

// Проверка, прошёл ли игрок обычный уровень
function hasPlayerBeatenNormalLevel(level) {
  // Получаем имя игрока из локального хранилища или "Аноним", если его нет
  const playerName = localStorage.getItem('currentPlayer') || 'Аноним';
  // Получаем список всех результатов из локального хранилища
  const ratings = JSON.parse(localStorage.getItem('gameRatings') || '[]');
  // Проверяем, есть ли среди результатов победа игрока на данном уровне в обычной сложности
  return ratings.some(game =>
    game.player === playerName &&      // Совпадает ли имя игрока
    game.level === level &&            // Совпадает ли уровень
    game.difficulty === 'normal' &&    // Совпадает ли сложность (обычная)
    game.result === 'win'              // Совпадает ли результат (победа)
  );
}

// Обновление состояния кнопок сложности
function updateDifficultyButtons(level, buttonId) {
  // Получаем кнопку сложного режима по ID
  const hardBtn = document.getElementById(buttonId);
  // Проверяем, прошёл ли игрок обычный уровень
  const canAccessHard = hasPlayerBeatenNormalLevel(level);
  // Если прошёл — разблокируем кнопку
  if (canAccessHard) {
    // Убираем класс 'disabled', чтобы кнопка была активной
    hardBtn.classList.remove('disabled');
    // Разрешаем кликать по кнопке
    hardBtn.style.pointerEvents = 'auto';
  } else {
    // Если не прошёл — блокируем кнопку
    // Добавляем класс 'disabled', чтобы кнопка выглядела неактивной
    hardBtn.classList.add('disabled');
    // Запрещаем кликать по кнопке
    hardBtn.style.pointerEvents = 'none';
  }
}

// Обновление всех кнопок сложности
function updateAllDifficultyButtons() {
  // Обновляем кнопку сложного режима для "Спасти Землю"
  updateDifficultyButtons('earth', 'hardBtnEarth');
  // Обновляем кнопку сложного режима для "Пояс астероидов"
  updateDifficultyButtons('asteroids', 'hardBtnAsteroids');
  // Обновляем кнопку сложного режима для "Золотая жила"
  updateDifficultyButtons('gold', 'hardBtnGold');
}

// Работа с рейтингом
function saveGameResult(level, score, time, result, difficulty = 'normal') {
  // Получаем имя игрока из локального хранилища или "Аноним", если его нет
  const playerName = localStorage.getItem('currentPlayer') || 'Аноним';
  // Создаём объект с данными об игре
  const gameData = {
    player: playerName,     // Имя игрока
    level: level,           // Уровень игры
    score: score,           // Набранные очки
    time: time,             // Время игры
    result: result,         // Результат: 'win' или 'lose'
    difficulty: difficulty, // Сложность: 'normal' или 'hard'
    timestamp: new Date().toISOString() // Время завершения игры
  };
  // Получаем текущий список результатов из локального хранилища
  let ratings = JSON.parse(localStorage.getItem('gameRatings') || '[]');
  // Добавляем новый результат в список
  ratings.push(gameData);
  // Сохраняем обновлённый список в локальное хранилище
  localStorage.setItem('gameRatings', JSON.stringify(ratings));
}

function loadRating() {
  // Получаем список всех результатов из локального хранилища
  const ratings = JSON.parse(localStorage.getItem('gameRatings') || '[]');
  // Получаем элемент, в который будут добавлены строки таблицы
  const tbody = document.getElementById('ratingBody');
  // Очищаем таблицу перед заполнением
  tbody.innerHTML = '';
  // Сортируем результаты по очкам в порядке убывания
  ratings.sort((a, b) => b.score - a.score);
  // Проходим по каждому результату и добавляем его в таблицу
  ratings.forEach((game, index) => {
    // Создаём новую строку в таблице
    const row = tbody.insertRow();
    // Заполняем строку данными
    row.innerHTML = `
      <td>${index + 1}</td>                             <!-- Место в рейтинге -->
      <td>${game.player}</td>                           <!-- Имя игрока -->
      <td>${getLevelName(game.level)}${game.difficulty ? ` (${getDifficultyName(game.difficulty)})` : ''}</td> <!-- Название уровня и сложности -->
      <td>${game.score}</td>                            <!-- Набранные очки -->
      <td>${Math.round(game.time)}с</td>                <!-- Время игры -->
      <td>${game.result === 'win' ? '🏆 Победа' : '💥 Поражение'}</td> <!-- Результат -->
    `;
  });
}

function clearRating() {
  // Спрашиваем у игрока, уверен ли он, что хочет очистить рейтинг
  if (confirm('Вы уверены, что хотите очистить весь рейтинг?')) {
    // Удаляем все результаты из локального хранилища
    localStorage.removeItem('gameRatings');
    // Обновляем таблицу рейтинга (она станет пустой)
    loadRating();
  }
}

function getLevelName(levelCode) {
  // Объект с названиями уровней
  const names = {
    'earth': 'Спасти Землю',
    'asteroids': 'Пояс астероидов',
    'gold': 'Золотая жила'
  };
  // Возвращаем название уровня по его коду или сам код, если не найден
  return names[levelCode] || levelCode;
}

function getDifficultyName(difficultyCode) {
  // Объект с названиями сложностей
  const names = {
    'normal': 'Обычный',
    'hard': 'Сложный'
  };
  // Возвращаем название сложности по её коду или сам код, если не найден
  return names[difficultyCode] || difficultyCode;
}

// Управление паузой
function pauseGame() {
  // Устанавливаем флаг паузы
  gamePaused = true;
  // Показываем экран паузы
  document.getElementById('pauseOverlay').style.display = 'flex';
  // Затеняем солнце и землю при паузе
  const sunElement = document.getElementById('sunElement');
  const earthElement = document.getElementById('earthElement');
  // Если солнце существует, делаем его полупрозрачным
  if (sunElement) {
    sunElement.style.opacity = '0.3';
  }
  // Если земля существует, делаем её полупрозрачной
  if (earthElement) {
    earthElement.style.opacity = '0.3';
  }
}

function resumeGame() {
  // Убираем флаг паузы
  gamePaused = false;
  // Скрываем экран паузы
  document.getElementById('pauseOverlay').style.display = 'none';
  // Восстанавливаем яркость солнца и земли после паузы
  const sunElement = document.getElementById('sunElement');
  const earthElement = document.getElementById('earthElement');
  // Если солнце существует, возвращаем ему полную яркость
  if (sunElement) {
    sunElement.style.opacity = '1';
  }
  // Если земля существует, возвращаем ей полную яркость
  if (earthElement) {
    earthElement.style.opacity = '1';
  }
}

function quitToMenu() {
  // Сохраняем результат как поражение
  const level = localStorage.getItem('currentLevel');
  const difficulty = localStorage.getItem('currentDifficulty') || 'normal';
  const time = 60 - timeLeft; // Время, которое игрок провёл в игре
  const score = currentScore; // Текущий счёт
  saveGameResult(level, score, time, 'lose', difficulty);

  // Останавливаем все анимации и генерацию
  stopEarthAnimation();
  stopAsteroidGeneration();
  stopUfoAnimation();
  stopAsteroidBeltGeneration();
  stopDiamondGeneration();
  stopBigAsteroidGeneration();
  stopGoldGeneration();
  ufoBullets = []; // Очищаем массив снарядов
  stopBulletsAnimation();

  // Сбрасываем игровое состояние
  gamePaused = false;
  document.getElementById('pauseOverlay').style.display = 'none';
  stopTimer();
  currentScore = 0;
  updateScoreDisplay();

  // Восстанавливаем яркость солнца и земли
  const sunElement = document.getElementById('sunElement');
  const earthElement = document.getElementById('earthElement');
  if (sunElement) {
    sunElement.style.opacity = '1';
  }
  if (earthElement) {
    earthElement.style.opacity = '1';
  }

  // Скрываем ящик
  const boxElement = document.getElementById('boxElement');
  if (boxElement) {
    boxElement.style.display = 'none';
  }

  // Удаляем все объекты с игрового поля
  const gameField = document.getElementById('gameField');
  const allElements = gameField.querySelectorAll('.asteroid, .asteroid-belt, .diamond-belt, .asteroid-big, .gold-big');
  allElements.forEach(el => el.remove());

  showMainMenu();
}

// Таймер
function startTimer() {
  // Устанавливаем начальное время (60 секунд)
  timeLeft = 60;
  // Обновляем отображение таймера на экране
  updateTimerDisplay();
  // Запускаем интервал, который будет срабатывать каждую секунду
  timerInterval = setInterval(function() {
    // Проверяем, не на паузе ли игра
    if (!gamePaused) {
      // Уменьшаем оставшееся время на 1
      timeLeft--;
      // Обновляем отображение таймера
      updateTimerDisplay();
      // Проверяем, закончилось ли время
      if (timeLeft <= 0) {
        // Останавливаем таймер
        clearInterval(timerInterval);

        // Останавливаем все анимации и генерацию
        stopEarthAnimation();
        stopAsteroidGeneration();
        stopUfoAnimation();
        stopAsteroidBeltGeneration();
        stopDiamondGeneration();
        stopBigAsteroidGeneration();
        stopGoldGeneration();
        ufoBullets = []; // Очищаем массив снарядов
        stopBulletsAnimation();

        // Скрываем ящик, если он был показан
        const boxElement = document.getElementById('boxElement');
        if (boxElement) {
          boxElement.style.display = 'none';
        }

        // Удаляем все объекты с игрового поля (астероиды, алмазы, золото и т.д.)
        const gameField = document.getElementById('gameField');
        const allElements = gameField.querySelectorAll('.asteroid, .asteroid-belt, .diamond-belt, .asteroid-big, .gold-big');
        allElements.forEach(el => el.remove());

        // Игрок выиграл, так как время закончилось
        const level = localStorage.getItem('currentLevel');
        const difficulty = localStorage.getItem('currentDifficulty') || 'normal';
        const time = 60; // Полное время
        // Сохраняем результат как победу
        saveGameResult(level, currentScore, time, 'win', difficulty);
        // Показываем экран окончания игры с надписью "Победа"
        showEndGame('win', currentScore);
      }
    }
  }, 1000); // Интервал в 1000 миллисекунд = 1 секунда
}

// Обновляет отображение таймера на экране
function updateTimerDisplay() {
  // Находим элемент с таймером и устанавливаем ему новое значение
  document.getElementById('timer').textContent = timeLeft;
}

// Обновляет отображение счёта на экране
function updateScoreDisplay() {
  // Находим элемент со счётом и устанавливаем ему новое значение
  document.getElementById('score').textContent = currentScore;

  // Проверяем, не стал ли счёт отрицательным
  if (currentScore < 0) {
    // Если да, то игра заканчивается как проигрыш
    gameOver();
  }
}

// Останавливает таймер
function stopTimer() {
  // Проверяем, запущен ли таймер
  if (timerInterval) {
    // Останавливаем интервал
    clearInterval(timerInterval);
    // Обнуляем переменную
    timerInterval = null;
  }
}

// Обработчик клавиатуры для паузы
document.addEventListener('keydown', function(e) {
  // Проверяем, нажата ли клавиша 'Escape' и активна ли игровая страница
  if (e.key === 'Escape' && document.getElementById('gamePage').classList.contains('active')) {
    // Если игра на паузе — снимаем паузу
    if (gamePaused) {
      resumeGame();
    } else {
      // Иначе — ставим на паузу
      pauseGame();
    }
  }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  // Создаём звёздный фон
  createStars();
  // Показываем страницу ввода имени
  showPage('authPage');
  // Удаляем fcp-marker
  document.getElementById('fcp-marker')?.remove();
});

// Добавляем обработчики событий для клавиатуры на странице авторизации
document.getElementById('playerName').addEventListener('keypress', function(e) {
  // Проверяем, нажата ли клавиша 'Enter'
  if (e.key === 'Enter') {
    // Если да — запускаем игру
    startGame();
  }
});





// ===================================================================================
//                             ИГРА "СПАСТИ ЗЕМЛЮ"
// ===================================================================================

// Анимация вращения Земли
function animateEarth(timestamp) {
  // Используем requestAnimationFrame с временной меткой для плавности анимации
  if (!lastTimestamp) lastTimestamp = timestamp; // Сохраняем первую метку
  const deltaTime = timestamp - lastTimestamp; // Вычисляем разницу между метками
  lastTimestamp = timestamp; // Обновляем последнюю метку
  // Проверяем, не на паузе ли игра
  if (!gamePaused) {
    // Увеличиваем угол вращения Земли по орбите (с учётом множителя сложности)
    earthOrbitAngle += 0.5 * difficultyMultiplier;
    // Увеличиваем угол вращения Земли вокруг своей оси (с учётом множителя сложности)
    earthRotationAngle += 2 * difficultyMultiplier;
    // Если угол вращения по орбите превышает 360 градусов — сбрасываем его
    if (earthOrbitAngle >= 360) earthOrbitAngle = 0;
    // Если угол вращения вокруг оси превышает 360 градусов — сбрасываем его
    if (earthRotationAngle >= 360) earthRotationAngle = 0;
    // Получаем элемент Земли
    const earthElement = document.getElementById('earthElement');
    // Если элемент существует
    if (earthElement) {
      // Радиус орбиты Земли
      const orbitRadius = 210;
      // Вычисляем координаты Земли на орбите
      const x = orbitRadius * Math.cos(earthOrbitAngle * Math.PI / 180);
      const y = orbitRadius * Math.sin(earthOrbitAngle * Math.PI / 180);
      // Центр игрового поля (900x675)
      const centerX = 900 / 2;
      const centerY = 675 / 2;
      // Вычисляем глобальные координаты центра Земли
      earthCurrentX = centerX + x;
      earthCurrentY = centerY + y;
      // Применяем трансформации: смещение по орбите и вращение вокруг своей оси
      earthElement.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${earthRotationAngle}deg)`;
    }
  }
  // Продолжаем анимацию, даже если игра на паузе (но углы не изменяются)
  earthAnimationId = requestAnimationFrame(animateEarth);
}

// Запускает анимацию вращения Земли
function startEarthAnimation() {
  // Сбрасываем углы вращения
  earthOrbitAngle = 0;
  earthRotationAngle = 0;
  // Сбрасываем временную метку
  lastTimestamp = 0;
  // Если анимация уже запущена — останавливаем её
  if (earthAnimationId) {
    cancelAnimationFrame(earthAnimationId);
  }
  // Запускаем анимацию
  earthAnimationId = requestAnimationFrame(animateEarth);
}

// Останавливает анимацию вращения Земли
function stopEarthAnimation() {
  // Если анимация запущена
  if (earthAnimationId) {
    // Останавливаем её
    cancelAnimationFrame(earthAnimationId);
    // Обнуляем переменную
    earthAnimationId = null;
    // Сбрасываем временную метку
    lastTimestamp = 0;
  }
}

// Генерация астероидов для режима "Спасти Землю"
function createAsteroid() {
  // Проверяем, не на паузе ли игра
  if (gamePaused) return;
  // Получаем игровое поле
  const gameField = document.getElementById('gameField');
  // Создаём новый элемент астероида
  const asteroid = document.createElement('div');
  // Присваиваем ему класс 'asteroid'
  asteroid.className = 'asteroid';
  // Присваиваем ему уникальный ID
  asteroid.id = `asteroid-${++asteroidIdCounter}`;
  // Генерируем случайный угол движения (0-360 градусов)
  const angle = Math.random() * 360;
  // Преобразуем угол в радианы
  const angleRad = angle * Math.PI / 180;
  // Определяем начальную позицию за пределами игрового поля (900x675)
  const fieldWidth = 900;
  const fieldHeight = 675;
  let startX, startY;
  // Выбираем случайную сторону для появления астероида (0 - сверху, 1 - справа, 2 - снизу, 3 - слева)
  const side = Math.floor(Math.random() * 4);
  switch(side) {
    case 0: // Сверху
      startX = Math.random() * fieldWidth;
      startY = -50;
      break;
    case 1: // Справа
      startX = fieldWidth + 50;
      startY = Math.random() * fieldHeight;
      break;
    case 2: // Снизу
      startX = Math.random() * fieldWidth;
      startY = fieldHeight + 50;
      break;
    case 3: // Слева
      startX = -50;
      startY = Math.random() * fieldHeight;
      break;
  }
  // Устанавливаем начальную позицию
  asteroid.style.left = `${startX}px`;
  asteroid.style.top = `${startY}px`;
  // Создаём изображение астероида
  const img = document.createElement('img');
  img.src = './images/asteroid.png';
  img.alt = 'Астероид';
  img.width = 35;
  img.height = 35;
  asteroid.appendChild(img);
  // Добавляем астероид на игровое поле
  gameField.appendChild(asteroid);
  // Устанавливаем скорость и направление движения
  const baseSpeed = 2 + Math.random() * 2; // Базовая скорость от 2 до 4
  const speed = baseSpeed * 0.5; // Уменьшаем на 50%
  // Увеличиваем скорость на 30% в сложном режиме (1.3x)
  const finalSpeed = speed * difficultyMultiplier;
  // Направление к центру (Земле)
  const targetX = fieldWidth / 2;
  const targetY = fieldHeight / 2;
  const dx = targetX - startX;
  const dy = targetY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const velocityX = (dx / distance) * finalSpeed;
  const velocityY = (dy / distance) * finalSpeed;
  // Сохраняем скорость и позицию в dataset элемента
  asteroid.dataset.velocityX = velocityX;
  asteroid.dataset.velocityY = velocityY;
  asteroid.dataset.x = startX;
  asteroid.dataset.y = startY;

  // Добавляем обработчик клика для уничтожения астероида
  asteroid.addEventListener('click', function() {
    // Удаляем астероид
    this.remove();
    // Создаём взрыв в центре астероида
    const x = parseFloat(asteroid.dataset.x) + 17.5; // 35/2
    const y = parseFloat(asteroid.dataset.y) + 17.5; // 35/2
    createExplosion(x, y);
    // Проигрываем звук взрыва
    playSound('boom');
    // Увеличиваем счёт на 10
    currentScore += 10;
    updateScoreDisplay();
  });
}

// Проверяет столкновение астероида с Землёй
function checkCollision(asteroid) {
  // Радиусы для столкновения
  const earthRadius = 40; // Радиус Земли
  const asteroidRadius = 18; // Радиус астероида

  // Текущая позиция астероида (центр div)
  const asteroidX = parseFloat(asteroid.dataset.x) + 17.5; // 35 / 2
  const asteroidY = parseFloat(asteroid.dataset.y) + 17.5; // 35 / 2

  // Текущая позиция Земли (центр div)
  const earthX = earthCurrentX;
  const earthY = earthCurrentY;

  // Вычисляем расстояние между центрами астероида и Земли
  const dx = asteroidX - earthX;
  const dy = asteroidY - earthY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Проверяем столкновение кругов (если расстояние меньше суммы радиусов)
  if (distance < (earthRadius + asteroidRadius)) {
    // Астероид столкнулся с Землёй
    asteroid.remove();
    // Завершаем игру как проигрыш
    gameOver();
    return true;
  }
  return false;
}

// Двигает астероиды
function moveAsteroids() {
  // Проверяем, не на паузе ли игра
  if (gamePaused) return;
  // Получаем все астероиды на игровом поле
  const asteroids = document.querySelectorAll('.asteroid');
  const gameField = document.getElementById('gameField');
  const fieldWidth = 900;
  const fieldHeight = 675;
  // Проходим по каждому астероиду
  asteroids.forEach(asteroid => {
    // Получаем текущую позицию и скорость
    let x = parseFloat(asteroid.dataset.x);
    let y = parseFloat(asteroid.dataset.y);
    const velocityX = parseFloat(asteroid.dataset.velocityX);
    const velocityY = parseFloat(asteroid.dataset.velocityY);
    // Обновляем позицию
    x += velocityX;
    y += velocityY;
    // Сохраняем обновлённые данные
    asteroid.dataset.x = x;
    asteroid.dataset.y = y;
    // Обновляем позицию на экране
    asteroid.style.left = `${x}px`;
    asteroid.style.top = `${y}px`;
    // Проверяем столкновение с Землёй
    if (checkCollision(asteroid)) {
      return; // Прерываем обработку этого астероида
    }
    // Удаляем астероид, если он вышел за пределы экрана
    if (x < -100 || x > fieldWidth + 100 || y < -100 || y > fieldHeight + 100) {
      asteroid.remove();
    }
  });
}

// Анимация движения астероидов
function animateAsteroids() {
  // Если игра не на паузе — двигаем астероиды
  if (!gamePaused) {
    moveAsteroids();
  }
  // Продолжаем анимацию
  asteroidAnimationId = requestAnimationFrame(animateAsteroids);
}

// Запускает генерацию астероидов
function startAsteroidGeneration() {
  // Очищаем предыдущий интервал
  stopAsteroidGeneration();
  // Создаём первый астероид
  createAsteroid();
  // Определяем интервал в зависимости от сложности
  const level = localStorage.getItem('currentLevel');
  const difficulty = localStorage.getItem('currentDifficulty') || 'normal';
  let intervalTime = 1000; // 1 секунда для обычного режима
  if (level === 'earth' && difficulty === 'hard') {
    intervalTime = 800; // 0.8 секунды для сложного режима "Спасти Землю"
  }
  // Запускаем интервал для создания новых астероидов
  asteroidInterval = setInterval(() => {
    if (!gamePaused) {
      createAsteroid();
    }
  }, intervalTime);
  // Запускаем анимацию движения астероидов
  asteroidAnimationId = requestAnimationFrame(animateAsteroids);
}

// Останавливает генерацию астероидов
function stopAsteroidGeneration() {
  // Если интервал запущен — останавливаем его
  if (asteroidInterval) {
    clearInterval(asteroidInterval);
    asteroidInterval = null;
  }
  // Если анимация запущена — останавливаем её
  if (asteroidAnimationId) {
    cancelAnimationFrame(asteroidAnimationId);
    asteroidAnimationId = null;
  }
}

// Функция завершения игры при поражении
function gameOver() {
  // Сохраняем результат как проигрыш
  const level = localStorage.getItem('currentLevel');
  const difficulty = localStorage.getItem('currentDifficulty') || 'normal';
  const time = 60 - timeLeft; // Время, которое игрок провёл в игре
  saveGameResult(level, currentScore, time, 'lose', difficulty);

  // Останавливаем все анимации и генерацию
  stopEarthAnimation();
  stopAsteroidGeneration();
  stopUfoAnimation();
  stopAsteroidBeltGeneration();
  stopDiamondGeneration();
  stopBigAsteroidGeneration();
  stopGoldGeneration();
  ufoBullets = []; // Очищаем массив снарядов
  stopBulletsAnimation();

  // Сбрасываем игровое состояние
  gamePaused = false;
  document.getElementById('pauseOverlay').style.display = 'none';
  stopTimer();

  // Восстанавливаем яркость солнца и земли
  const sunElement = document.getElementById('sunElement');
  const earthElement = document.getElementById('earthElement');
  if (sunElement) {
    sunElement.style.opacity = '1';
  }
  if (earthElement) {
    earthElement.style.opacity = '1';
  }

  // Скрываем ящик
  const boxElement = document.getElementById('boxElement');
  if (boxElement) {
    boxElement.style.display = 'none';
  }

  // Удаляем все объекты с игрового поля
  const gameField = document.getElementById('gameField');
  const allElements = gameField.querySelectorAll('.asteroid, .asteroid-belt, .diamond-belt, .asteroid-big, .gold-big');
  allElements.forEach(el => el.remove());

  // Показываем экран окончания игры
  showEndGame('lose', currentScore);
}





// ===================================================================================
//                             ИГРА "ПОЯС АСТЕРОИДОВ"
// ===================================================================================

// Управление НЛО стрелками
document.addEventListener('keydown', function(e) {
  // Проверяем, активна ли игровая страница и запущен ли уровень "Пояс астероидов"
  if (document.getElementById('gamePage').classList.contains('active') &&
      localStorage.getItem('currentLevel') === 'asteroids') {
    // Если нажата стрелка влево
    if (e.key === 'ArrowLeft') {
      // Устанавливаем флаг, что клавиша нажата
      ufoKeys.left = true;
      // Отменяем стандартное поведение клавиши
      e.preventDefault();
    }
    // Если нажата стрелка вправо
    if (e.key === 'ArrowRight') {
      // Устанавливаем флаг, что клавиша нажата
      ufoKeys.right = true;
      // Отменяем стандартное поведение клавиши
      e.preventDefault();
    }
  }
});

// Обработка отпускания клавиш
document.addEventListener('keyup', function(e) {
  // Проверяем, активна ли игровая страница и запущен ли уровень "Пояс астероидов"
  if (document.getElementById('gamePage').classList.contains('active') &&
      localStorage.getItem('currentLevel') === 'asteroids') {
    // Если отпущена стрелка влево
    if (e.key === 'ArrowLeft') {
      // Устанавливаем флаг, что клавиша отпущена
      ufoKeys.left = false;
      // Отменяем стандартное поведение клавиши
      e.preventDefault();
    }
    // Если отпущена стрелка вправо
    if (e.key === 'ArrowRight') {
      // Устанавливаем флаг, что клавиша отпущена
      ufoKeys.right = false;
      // Отменяем стандартное поведение клавиши
      e.preventDefault();
    }
  }
});

// Анимация движения НЛО
function animateUfo() {
  // Проверяем, запущен ли уровень "Пояс астероидов"
  if (localStorage.getItem('currentLevel') !== 'asteroids') {
    return;
  }

  // Обновляем скорость НЛО в зависимости от нажатых клавиш
  ufoVelocity = 0;
  // Если нажата стрелка влево — движение влево
  if (ufoKeys.left) ufoVelocity = -ufoSpeed;
  // Если нажата стрелка вправо — движение вправо
  if (ufoKeys.right) ufoVelocity = ufoSpeed;

  // Обновляем позицию НЛО
  ufoX += ufoVelocity;

  // Устанавливаем границы движения НЛО: отступ 30px слева и справа
  const minX = 30;
  const maxX = 900 - 120 - 30; // 900 — ширина поля, 120 — ширина НЛО
  // Ограничиваем позицию НЛО в пределах границ
  ufoX = Math.max(minX, Math.min(maxX, ufoX));

  // Применяем позицию к элементу НЛО
  const ufoElement = document.getElementById('ufoElement');
  if (ufoElement) {
    ufoElement.style.left = `${ufoX}px`;
  }

  // Продолжаем анимацию
  ufoAnimationId = requestAnimationFrame(animateUfo);
}

// Запуск анимации НЛО
function startUfoAnimation() {
  // Сбрасываем позицию НЛО к начальной
  ufoX = 410;
  // Сбрасываем состояние клавиш
  ufoKeys = { left: false, right: false };
  // Получаем элемент НЛО
  const ufoElement = document.getElementById('ufoElement');
  if (ufoElement) {
    // Устанавливаем начальную позицию
    ufoElement.style.left = `${ufoX}px`;
    // Показываем НЛО
    ufoElement.style.display = 'block';
  }
  // Если анимация уже запущена — останавливаем её
  if (ufoAnimationId) cancelAnimationFrame(ufoAnimationId);
  // Запускаем новую анимацию
  ufoAnimationId = requestAnimationFrame(animateUfo);
}

// Остановка анимации НЛО
function stopUfoAnimation() {
  // Если анимация запущена
  if (ufoAnimationId) {
    // Останавливаем её
    cancelAnimationFrame(ufoAnimationId);
    // Обнуляем переменную
    ufoAnimationId = null;
  }
  // Получаем элемент НЛО
  const ufoElement = document.getElementById('ufoElement');
  if (ufoElement) {
    // Скрываем НЛО
    ufoElement.style.display = 'none';
  }
}

// Создание астероида в "Поясе астероидов"
function createAsteroidBelt() {
  // Проверяем, не на паузе ли игра
  if (gamePaused) return;
  // Получаем игровое поле
  const gameField = document.getElementById('gameField');
  // Создаём новый элемент астероида
  const asteroid = document.createElement('div');
  // Присваиваем ему класс 'asteroid-belt'
  asteroid.className = 'asteroid-belt';
  // Присваиваем ему уникальный ID
  asteroid.id = `asteroid-belt-${++asteroidBeltIdCounter}`;
  // Генерируем случайную позицию по оси X (от 10 до 890)
  const fieldWidth = 900;
  const x = 10 + Math.random() * (fieldWidth - 10 - 35); // 35 — ширина астероида
  // Устанавливаем позицию по оси X
  asteroid.style.left = `${x}px`;
  // Устанавливаем позицию по оси Y (за пределами экрана сверху)
  asteroid.style.top = `-35px`;
  // Создаём изображение астероида
  const img = document.createElement('img');
  img.src = './images/asteroid.png';
  img.alt = 'Астероид';
  img.width = 35;
  img.height = 35;
  asteroid.appendChild(img);
  // Добавляем астероид на игровое поле
  gameField.appendChild(asteroid);

  // Устанавливаем начальную скорость (вниз)
  const baseSpeed = 2 + Math.random() * 2; // 2-4
  const speed = baseSpeed * 0.5; // Уменьшаем на 50%
  const finalSpeed = speed * difficultyMultiplier; // Учитываем множитель сложности
  asteroid.dataset.velocityY = finalSpeed; // Сохраняем вертикальную скорость
  asteroid.dataset.y = -35; // Начальная позиция по Y

  // Начальное вращение
  asteroid.dataset.rotation = 0;
}

// Анимация движения астероидов "Пояса астероидов"
function moveAsteroidBelt() {
   // Проверяем, не на паузе ли игра
  if (gamePaused) {
    // Если на паузе — продолжаем анимацию, но не обновляем позиции
    asteroidBeltAnimationId = requestAnimationFrame(moveAsteroidBelt);
    return;
  }
  
  // Получаем все астероиды на поле
  const asteroids = document.querySelectorAll('.asteroid-belt');
  const gameField = document.getElementById('gameField');
  const fieldHeight = 675;
  // Получаем элемент НЛО
  const ufoElement = document.getElementById('ufoElement');
  // Если НЛО не существует — выходим
  if (!ufoElement) return;

  // Получаем координаты НЛО
  const ufoRect = ufoElement.getBoundingClientRect();
  const gameFieldRect = gameField.getBoundingClientRect();

  // Вычисляем абсолютные координаты НЛО в пределах игрового поля
  const ufoAbsX = ufoRect.left - gameFieldRect.left;
  const ufoAbsY = ufoRect.top - gameFieldRect.top;

  // Определяем границы НЛО
  const ufoLeft = ufoAbsX;
  const ufoTop = ufoAbsY;
  const ufoRight = ufoAbsX + ufoRect.width;
  const ufoBottom = ufoAbsY + ufoRect.height;

  // Проходим по каждому астероиду
  asteroids.forEach(asteroid => {
    // Получаем текущую позицию и скорость
    let y = parseFloat(asteroid.dataset.y);
    const velocityY = parseFloat(asteroid.dataset.velocityY);
    let rotation = parseFloat(asteroid.dataset.rotation);

    // Обновляем позицию
    y += velocityY;
    asteroid.dataset.y = y;

    // Обновляем позицию и вращение на экране
    asteroid.style.top = `${y}px`;
    asteroid.style.transform = `rotate(${rotation}deg)`;

    // Увеличиваем вращение
    asteroid.dataset.rotation = rotation + 2;

    // Удаляем астероид, если он вышел за нижнюю границу
    if (y > fieldHeight + 35) {
      asteroid.remove();
      return;
    }

    // Получаем границы астероида
    const x = parseFloat(asteroid.style.left);
    const asteroidLeft = x;
    const asteroidTop = y;
    const asteroidRight = x + 35;
    const asteroidBottom = y + 35;

    // Проверяем столкновение с НЛО по прямоугольникам
    if (
      asteroidRight > ufoLeft &&      // Правая граница астероида за левой границей НЛО
      asteroidLeft < ufoRight &&      // Левая граница астероида до правой границы НЛО
      asteroidBottom > ufoTop &&      // Нижняя граница астероида ниже верхней границы НЛО
      asteroidTop < ufoBottom         // Верхняя граница астероида выше нижней границы НЛО
    ) {
      // Столкновение!
      asteroid.remove();
      gameOver(); // Завершаем игру как проигрыш
      return;
    }
  });
}

// Анимация движения астероидов
function animateAsteroidBelt() {
  // Если игра не на паузе — обновляем позиции
  if (!gamePaused) {
    moveAsteroidBelt();
  }
  // Продолжаем анимацию
  asteroidBeltAnimationId = requestAnimationFrame(animateAsteroidBelt);
}

// Запуск генерации астероидов
function startAsteroidBeltGeneration() {
  // Очищаем предыдущий интервал
  stopAsteroidBeltGeneration();
  // Определяем интервал в зависимости от сложности
  const difficulty = localStorage.getItem('currentDifficulty') || 'normal';
  let intervalTime = 800; // 0.8 секунды для обычного режима
  if (difficulty === 'hard') {
    intervalTime = 500; // 0.5 секунды для сложного режима
  }
  // Запускаем интервал создания астероидов
  asteroidBeltInterval = setInterval(() => {
    if (!gamePaused) {
      createAsteroidBelt();
    }
  }, intervalTime);
  // Запускаем анимацию движения астероидов
  asteroidBeltAnimationId = requestAnimationFrame(animateAsteroidBelt);
}

// Остановка генерации астероидов
function stopAsteroidBeltGeneration() {
  // Если интервал запущен — останавливаем его
  if (asteroidBeltInterval) {
    clearInterval(asteroidBeltInterval);
    asteroidBeltInterval = null;
  }
  // Если анимация запущена — останавливаем её
  if (asteroidBeltAnimationId) {
    cancelAnimationFrame(asteroidBeltAnimationId);
    asteroidBeltAnimationId = null;
  }
}

// Создание алмазика в потоке астероидов
function createDiamond() {
  // Проверяем, не на паузе ли игра
  if (gamePaused) return;
  // Получаем игровое поле
  const gameField = document.getElementById('gameField');
  // Создаём новый элемент алмаза
  const diamond = document.createElement('div');
  // Присваиваем ему класс 'diamond-belt'
  diamond.className = 'diamond-belt';
  // Присваиваем ему уникальный ID
  diamond.id = `diamond-${++diamondIdCounter}`;
  // Генерируем случайную позицию по оси X (от 10 до 890)
  const fieldWidth = 900;
  const x = 10 + Math.random() * (fieldWidth - 10 - 35); // 35 — ширина алмаза
  // Устанавливаем позицию по оси X
  diamond.style.left = `${x}px`;
  // Устанавливаем позицию по оси Y (за пределами экрана сверху)
  diamond.style.top = `-35px`;
  // Создаём изображение алмаза
  const img = document.createElement('img');
  img.src = './images/diamond.png';
  img.alt = 'Алмаз';
  img.width = 35;
  img.height = 35;
  diamond.appendChild(img);
  // Добавляем алмаз на игровое поле
  gameField.appendChild(diamond);

  // Устанавливаем начальную скорость (вниз), как у астероидов, с учётом множителя сложности
  const baseSpeed = 2 + Math.random() * 2; // 2-4
  const speed = baseSpeed * 0.5; // Уменьшаем на 50%
  const finalSpeed = speed * difficultyMultiplier; // Учитываем множитель сложности
  diamond.dataset.velocityY = finalSpeed; // Сохраняем вертикальную скорость
  diamond.dataset.y = -35; // Начальная позиция по Y

  // Начальное вращение
  diamond.dataset.rotation = 0;
}

// Анимация движения алмазиков в "Поясе астероидов"
function moveDiamonds() {
 // Проверяем, не на паузе ли игра
  if (gamePaused) {
    // Если на паузе — продолжаем анимацию, но не обновляем позиции
    diamondAnimationId = requestAnimationFrame(moveDiamonds);
    return;
  }

  // Получаем все алмазы на поле
  const diamonds = document.querySelectorAll('.diamond-belt');
  const gameField = document.getElementById('gameField');
  const fieldHeight = 675;
  // Получаем элемент НЛО
  const ufoElement = document.getElementById('ufoElement');
  // Если НЛО не существует — выходим
  if (!ufoElement) return;

  // Получаем координаты НЛО
  const ufoRect = ufoElement.getBoundingClientRect();
  const gameFieldRect = gameField.getBoundingClientRect();

  // Вычисляем абсолютные координаты НЛО в пределах игрового поля
  const ufoAbsX = ufoRect.left - gameFieldRect.left;
  const ufoAbsY = ufoRect.top - gameFieldRect.top;

  // Определяем границы НЛО
  const ufoLeft = ufoAbsX;
  const ufoTop = ufoAbsY;
  const ufoRight = ufoAbsX + ufoRect.width;
  const ufoBottom = ufoAbsY + ufoRect.height;

  // Проходим по каждому алмазу
  diamonds.forEach(diamond => {
    // Получаем текущую позицию и скорость
    let y = parseFloat(diamond.dataset.y);
    const velocityY = parseFloat(diamond.dataset.velocityY);
    let rotation = parseFloat(diamond.dataset.rotation);

    // Обновляем позицию
    y += velocityY;
    diamond.dataset.y = y;

    // Обновляем позицию и вращение на экране
    diamond.style.top = `${y}px`;
    diamond.style.transform = `rotate(${rotation}deg)`;

    // Увеличиваем вращение
    diamond.dataset.rotation = rotation + 2;

    // Удаляем алмаз, если он вышел за нижнюю границу
    if (y > fieldHeight + 35) {
      diamond.remove();
      return;
    }

    // Получаем границы алмаза
    const x = parseFloat(diamond.style.left);
    const diamondLeft = x;
    const diamondTop = y;
    const diamondRight = x + 35;
    const diamondBottom = y + 35;

    // Проверяем столкновение с НЛО по прямоугольникам
    if (
      diamondRight > ufoLeft &&      // Правая граница алмаза за левой границей НЛО
      diamondLeft < ufoRight &&      // Левая граница алмаза до правой границы НЛО
      diamondBottom > ufoTop &&      // Нижняя граница алмаза ниже верхней границы НЛО
      diamondTop < ufoBottom         // Верхняя граница алмаза выше нижней границы НЛО
    ) {
      // Столкновение!
      diamond.remove();
      // Начисляем 50 очков за сбор алмаза
      currentScore += 50;
      updateScoreDisplay();
      // Проигрываем звук начисления очков (как у золота в "Золотой жиле")
      playSound('gold');
      return;
    }
  });

  // Запускаем следующий кадр анимации
  diamondAnimationId = requestAnimationFrame(moveDiamonds);
}

// Анимация движения алмазов
function animateDiamonds() {
  // Если анимация уже запущена — останавливаем её
  if (diamondAnimationId) {
    cancelAnimationFrame(diamondAnimationId);
  }
  // Запускаем анимацию движения алмазов
  diamondAnimationId = requestAnimationFrame(moveDiamonds);
}

// Запуск генерации алмазиков
function startDiamondGeneration() {
  stopDiamondGeneration(); // Очищаем предыдущий интервал
  // Создаём первый алмаз
  createDiamond();
  // Интервал: 5 секунд
  diamondInterval = setInterval(() => {
    if (!gamePaused) {
      createDiamond();
    }
  }, 5000);
  // Запускаем анимацию
  animateDiamonds();
}

// Остановка генерации
function stopDiamondGeneration() {
  // Если интервал запущен — останавливаем его
  if (diamondInterval) {
    clearInterval(diamondInterval);
    diamondInterval = null;
  }
  // Если анимация запущена — останавливаем её
  if (diamondAnimationId) {
    cancelAnimationFrame(diamondAnimationId);
    diamondAnimationId = null;
  }
}

// Выстрел снарядом из НЛО по двойному клику
function shootBullet() {
  // Проверяем, запущен ли уровень "Пояс астероидов"
  if (localStorage.getItem('currentLevel') !== 'asteroids') return;

  // Получаем элемент НЛО
  const ufoElement = document.getElementById('ufoElement');
  // Если НЛО не существует — выходим
  if (!ufoElement) return;

  // Получаем координаты НЛО
  const ufoRect = ufoElement.getBoundingClientRect();
  const gameField = document.getElementById('gameField');
  const gameFieldRect = gameField.getBoundingClientRect();

  // Позиция выстрела: центр НЛО
  const ufoX = ufoRect.left - gameFieldRect.left + ufoRect.width / 2;
  const ufoY = ufoRect.top - gameFieldRect.top;

  // Создаём элемент снаряда
  const bullet = document.createElement('div');
  bullet.className = 'ufo-bullet';
  // Устанавливаем позицию снаряда
  bullet.style.left = `${ufoX - 5}px`;
  bullet.style.top = `${ufoY}px`;

  // Добавляем снаряд на игровое поле
  gameField.appendChild(bullet);

  // Проигрываем звук выстрела
  playSound('shoot');

  // Добавляем снаряд в массив
  ufoBullets.push({
    element: bullet,
    x: ufoX - 5,
    y: ufoY
  });
}

// Создание эффекта взрыва
function createExplosion(x, y) {
  // Получаем игровое поле
  const gameField = document.getElementById('gameField');
  // Создаём элемент взрыва
  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  // Устанавливаем позицию взрыва
  explosion.style.left = `${x - 25}px`; // Центрируем взрыв (50px / 2)
  explosion.style.top = `${y - 25}px`;

  // Создаём 8 частиц взрыва
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'explosion-particle';
    explosion.appendChild(particle);
  }

  // Добавляем взрыв на игровое поле
  gameField.appendChild(explosion);

  // Удаляем элемент взрыва после завершения анимации (0.4 секунды)
  setTimeout(() => {
    explosion.remove();
  }, 400);
}

// Анимация движения снарядов
function animateBullets() {
  // Проверяем, запущен ли уровень "Пояс астероидов" и не на паузе ли игра
  if (localStorage.getItem('currentLevel') !== 'asteroids' || gamePaused) {
    // Если уровень не тот или игра на паузе — продолжаем анимацию, но не обновляем позиции
    ufoBulletsAnimationId = requestAnimationFrame(animateBullets);
    return;
  }

  // Получаем все астероиды для проверки столкновений
  const asteroids = document.querySelectorAll('.asteroid-belt');

  // Проходим по каждому снаряду
  for (let i = ufoBullets.length - 1; i >= 0; i--) {
    const bullet = ufoBullets[i];
    // Двигаем снаряд вверх
    bullet.y -= bulletSpeed;

    // Проверяем, не вышел ли снаряд за верхнюю границу экрана
    if (bullet.y < -10) { // учитываем новую высоту снаряда (10px)
      // Удаляем снаряд с экрана
      bullet.element.remove();
      // Удаляем снаряд из массива
      ufoBullets.splice(i, 1);
      continue;
    }

    // Обновляем позицию снаряда на экране
    bullet.element.style.top = `${bullet.y}px`;

    // Проверка столкновения пули с астероидами
    const bulletLeft = bullet.x;
    const bulletTop = bullet.y;
    const bulletRight = bullet.x + 10; // ширина пули
    const bulletBottom = bullet.y + 20; // высота пули

    let bulletHit = false;

    // Проходим по каждому астероиду
    asteroids.forEach(asteroid => {
      if (bulletHit) return; // Пуля уже попала в астероид

      // Получаем координаты астероида
      const asteroidX = parseFloat(asteroid.style.left);
      const asteroidY = parseFloat(asteroid.dataset.y);
      const asteroidLeft = asteroidX;
      const asteroidTop = asteroidY;
      const asteroidRight = asteroidX + 35;
      const asteroidBottom = asteroidY + 35;

      // Проверяем пересечение прямоугольников (столкновение)
      if (
        bulletRight > asteroidLeft &&    // Правая граница пули за левой границей астероида
        bulletLeft < asteroidRight &&    // Левая граница пули до правой границы астероида
        bulletBottom > asteroidTop &&    // Нижняя граница пули ниже верхней границы астероида
        bulletTop < asteroidBottom       // Верхняя граница пули выше нижней границы астероида
      ) {
        // Столкновение! Создаём взрыв в центре астероида
        const explosionX = asteroidX + 17.5; // 35/2
        const explosionY = asteroidY + 17.5; // 35/2
        createExplosion(explosionX, explosionY);

        // Проигрываем звук взрыва
        playSound('boom');

        // Удаляем астероид и снаряд
        asteroid.remove();
        bullet.element.remove();
        // Удаляем снаряд из массива
        ufoBullets.splice(i, 1);
        bulletHit = true;

        // Начисляем 20 очков за уничтожение астероида
        currentScore += 20;
        updateScoreDisplay();
      }
    });
  }

  // Запускаем следующий кадр анимации
  ufoBulletsAnimationId = requestAnimationFrame(animateBullets);
}

// Остановка анимации снарядов
function stopBulletsAnimation() {
  // Если анимация запущена
  if (ufoBulletsAnimationId) {
    // Останавливаем её
    cancelAnimationFrame(ufoBulletsAnimationId);
    // Обнуляем переменную
    ufoBulletsAnimationId = null;
  }
}

// Обработчик двойного клика для выстрела
document.getElementById('gameField').addEventListener('dblclick', function(e) {
  // Проверяем, запущен ли уровень "Пояс астероидов" и не на паузе ли игра
  if (localStorage.getItem('currentLevel') === 'asteroids' && !gamePaused) {
    // Вызываем функцию выстрела
    shootBullet();
    // Отменяем стандартное поведение двойного клика
    e.preventDefault();
  }
});





// ===================================================================================
//                             ИГРА "ЗОЛОТАЯ ЖИЛА"
// ===================================================================================

// Создание большого астероида
function createBigAsteroid() {
  // Проверяем, не на паузе ли игра
  if (gamePaused) return;
  // Получаем игровое поле
  const gameField = document.getElementById('gameField');
  // Создаём новый элемент астероида
  const asteroid = document.createElement('div');
  // Присваиваем ему класс 'asteroid-big'
  asteroid.className = 'asteroid-big';
  // Присваиваем ему уникальный ID
  asteroid.id = `asteroid-big-${++asteroidBigIdCounter}`;

  // Определяем позицию по оси X: от 270 до (900 - 60 - 60) = 780
  const minX = 270;
  const maxX = 900 - 60 - 60; // 900 (ширина поля) - 60 (ширина астероида) - 60 (отступ справа)
  const x = minX + Math.random() * (maxX - minX);

  // Устанавливаем позицию по оси X и Y
  asteroid.style.left = `${x}px`;
  asteroid.style.top = `-60px`; // появляется сверху за пределами экрана

  // Создаём изображение астероида
  const img = document.createElement('img');
  img.src = './images/asteroid.png';
  img.alt = 'Большой астероид';
  img.width = 60;
  img.height = 60;
  asteroid.appendChild(img);

  // Добавляем астероид на игровое поле
  gameField.appendChild(asteroid);

  // Устанавливаем начальную скорость (вниз), как у обычных астероидов
  const baseSpeed = 2 + Math.random() * 2; // 2-4
  const speed = baseSpeed * 0.5; // Уменьшаем на 50%
  const finalSpeed = speed * difficultyMultiplier; // Учитываем множитель сложности
  asteroid.dataset.velocityY = finalSpeed; // Сохраняем вертикальную скорость
  asteroid.dataset.y = -60; // Начальная позиция по Y

  // Начальное вращение
  asteroid.dataset.rotation = 0;

  // Добавляем обработчики Drag&Drop
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Обработчик нажатия мыши на астероид
  asteroid.addEventListener('mousedown', (e) => {
    // Проверяем, запущен ли уровень "Золотая жила"
    if (localStorage.getItem('currentLevel') !== 'gold') return;
    // Устанавливаем флаг, что астероид перетаскивается
    isDragging = true;
    // Получаем координаты астероида
    const rect = asteroid.getBoundingClientRect();
    const gameFieldRect = gameField.getBoundingClientRect();
    // Вычисляем смещение относительно курсора
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    // Повышаем z-index при перетаскивании
    asteroid.style.zIndex = 1005;
    // Отменяем стандартное поведение
    e.preventDefault();
  });

  // Обработчик движения мыши
  document.addEventListener('mousemove', (e) => {
    // Если астероид не перетаскивается — выходим
    if (!isDragging) return;
    // Получаем координаты игрового поля
    const gameFieldRect = gameField.getBoundingClientRect();
    // Вычисляем новую позицию астероида
    let x = e.clientX - gameFieldRect.left - offsetX;
    let y = e.clientY - gameFieldRect.top - offsetY;

    // Ограничения: отступ 30px от краёв
    const minX = 30;
    const maxX = 900 - 60 - 30; // 900 - 60 (ширина астероида) - 30
    const minY = 30;
    const maxY = 675 - 60 - 30; // 675 - 60 (высота астероида) - 30

    // Ограничиваем позицию астероида в пределах границ
    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));

    // Устанавливаем новую позицию астероида
    asteroid.style.left = `${x}px`;
    asteroid.style.top = `${y}px`;
    // Сохраняем новую позицию в dataset
    asteroid.dataset.y = y;
  });

  // Обработчик отпускания мыши
  document.addEventListener('mouseup', () => {
    // Если астероид не перетаскивался — выходим
    if (!isDragging) return;
    // Сбрасываем флаг перетаскивания
    isDragging = false;
    // Возвращаем z-index к стандартному значению
    asteroid.style.zIndex = 1003;
  });
}

// Анимация больших астероидов
function moveBigAsteroids() {
  // Проверяем, не на паузе ли игра
  if (gamePaused) return;
  // Получаем все большие астероиды на поле
  const asteroids = document.querySelectorAll('.asteroid-big');
  const gameField = document.getElementById('gameField');
  const fieldHeight = 675;
  // Получаем элемент ящика
  const boxElement = document.getElementById('boxElement');
  // Если ящик не существует — выходим
  if (!boxElement) return;

  // Получаем границы ящика
  const boxRect = boxElement.getBoundingClientRect();
  const gameFieldRect = gameField.getBoundingClientRect();

  // Вычисляем абсолютные координаты ящика в пределах игрового поля
  const boxAbsX = boxRect.left - gameFieldRect.left;
  const boxAbsY = boxRect.top - gameFieldRect.top;

  // Определяем границы ящика
  const boxLeft = boxAbsX;
  const boxTop = boxAbsY;
  const boxRight = boxAbsX + boxRect.width;
  const boxBottom = boxAbsY + boxRect.height;

  // Проходим по каждому астероиду
  asteroids.forEach(asteroid => {
    // Получаем текущую позицию и скорость
    let y = parseFloat(asteroid.dataset.y);
    const velocityY = parseFloat(asteroid.dataset.velocityY);
    let rotation = parseFloat(asteroid.dataset.rotation);

    // Обновляем позицию
    y += velocityY;
    asteroid.dataset.y = y;

    // Обновляем позицию и вращение на экране
    asteroid.style.top = `${y}px`;
    asteroid.style.transform = `rotate(${rotation}deg)`;

    // Увеличиваем вращение
    asteroid.dataset.rotation = rotation + 2;

    // Удаляем астероид, если он вышел за нижнюю границу
    if (y > fieldHeight + 60) {
      asteroid.remove();
      return;
    }

    // Получаем границы астероида
    const x = parseFloat(asteroid.style.left);
    const asteroidLeft = x;
    const asteroidTop = y;
    const asteroidRight = x + 60;
    const asteroidBottom = y + 60;

    // Проверяем столкновение с ящиком
    if (
      asteroidRight > boxLeft &&      // Правая граница астероида за левой границей ящика
      asteroidLeft < boxRight &&      // Левая граница астероида до правой границы ящика
      asteroidBottom > boxTop &&      // Нижняя граница астероида ниже верхней границы ящика
      asteroidTop < boxBottom         // Верхняя граница астероида выше нижней границы ящика
    ) {
      // Столкновение!
      asteroid.remove();
      // Анимация ящика при столкновении с астероидом
      animateBoxForAsteroid();
      // Вычитаем 100 очков
      currentScore -= 100;
      updateScoreDisplay();
      // Проигрываем звук ошибки
      playSound('error');
      return;
    }
  });
}

// Анимация движения больших астероидов
function animateBigAsteroids() {
  // Если игра не на паузе — обновляем позиции
  if (!gamePaused) {
    moveBigAsteroids();
  }
  // Продолжаем анимацию
  asteroidBigAnimationId = requestAnimationFrame(animateBigAsteroids);
}

// Начать генерацию больших астероидов
function startBigAsteroidGeneration() {
  stopBigAsteroidGeneration(); // Очищаем предыдущий интервал
  // Создаём первый астероид
  createBigAsteroid();
  // Интервал: 1 секунда
  asteroidBigInterval = setInterval(() => {
    if (!gamePaused) {
      createBigAsteroid();
    }
  }, 1000);
  // Запускаем анимацию
  asteroidBigAnimationId = requestAnimationFrame(animateBigAsteroids);
}

// Закончить генерацию больших астероидов
function stopBigAsteroidGeneration() {
  // Если интервал запущен — останавливаем его
  if (asteroidBigInterval) {
    clearInterval(asteroidBigInterval);
    asteroidBigInterval = null;
  }
  // Если анимация запущена — останавливаем её
  if (asteroidBigAnimationId) {
    cancelAnimationFrame(asteroidBigAnimationId);
    asteroidBigAnimationId = null;
  }
}

// Функция создания золота
function createGold() {
  // Проверяем, не на паузе ли игра
  if (gamePaused) return;
  // Получаем игровое поле
  const gameField = document.getElementById('gameField');
  // Создаём новый элемент золота
  const gold = document.createElement('div');
  // Присваиваем ему класс 'gold-big'
  gold.className = 'gold-big';
  // Присваиваем ему уникальный ID
  gold.id = `gold-${++goldIdCounter}`;

  // Определяем позицию по оси X: от 270 до 780 (так же, как и у больших астероидов)
  const minX = 270;
  const maxX = 900 - 60 - 60; // 900 - 60 (ширина золота) - 60 (отступ справа)
  const x = minX + Math.random() * (maxX - minX);

  // Устанавливаем позицию по оси X и Y
  gold.style.left = `${x}px`;
  gold.style.top = `-60px`; // появляется сверху за пределами экрана

  // Создаём изображение золота
  const img = document.createElement('img');
  img.src = './images/gold.png';
  img.alt = 'Золото';
  img.width = 60;
  img.height = 60;
  gold.appendChild(img);

  // Добавляем золото на игровое поле
  gameField.appendChild(gold);

  // Устанавливаем начальную скорость (вниз), как у обычных астероидов
  const baseSpeed = 2 + Math.random() * 2; // 2-4
  const speed = baseSpeed * 0.5; // Уменьшаем на 50%
  const finalSpeed = speed * difficultyMultiplier; // Учитываем множитель сложности
  gold.dataset.velocityY = finalSpeed; // Сохраняем вертикальную скорость
  gold.dataset.y = -60; // Начальная позиция по Y

  // Начальное вращение
  gold.dataset.rotation = 0;

  // Добавляем обработчики Drag&Drop
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Обработчик нажатия мыши на золото
  gold.addEventListener('mousedown', (e) => {
    // Проверяем, запущен ли уровень "Золотая жила"
    if (localStorage.getItem('currentLevel') !== 'gold') return;
    // Устанавливаем флаг, что золото перетаскивается
    isDragging = true;
    // Получаем координаты золота
    const rect = gold.getBoundingClientRect();
    const gameFieldRect = gameField.getBoundingClientRect();
    // Вычисляем смещение относительно курсора
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    // Повышаем z-index при перетаскивании
    gold.style.zIndex = 1005;
    // Отменяем стандартное поведение
    e.preventDefault();
  });

  // Обработчик движения мыши
  document.addEventListener('mousemove', (e) => {
    // Если золото не перетаскивается — выходим
    if (!isDragging) return;
    // Получаем координаты игрового поля
    const gameFieldRect = gameField.getBoundingClientRect();
    // Вычисляем новую позицию золота
    let x = e.clientX - gameFieldRect.left - offsetX;
    let y = e.clientY - gameFieldRect.top - offsetY;

    // Ограничения: отступ 30px от краёв
    const minX = 30;
    const maxX = 900 - 60 - 30; // 900 - 60 (ширина золота) - 30
    const minY = 30;
    const maxY = 675 - 60 - 30; // 675 - 60 (высота золота) - 30

    // Ограничиваем позицию золота в пределах границ
    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));

    // Устанавливаем новую позицию золота
    gold.style.left = `${x}px`;
    gold.style.top = `${y}px`;
    // Сохраняем новую позицию в dataset
    gold.dataset.y = y;
  });

  // Обработчик отпускания мыши
  document.addEventListener('mouseup', () => {
    // Если золото не перетаскивалось — выходим
    if (!isDragging) return;
    // Сбрасываем флаг перетаскивания
    isDragging = false;
    // Возвращаем z-index к стандартному значению
    gold.style.zIndex = 1003;
  });
}

// Анимация золота как у астероидов
function moveGold() {
  // Проверяем, не на паузе ли игра
  if (gamePaused) return;
  // Получаем все элементы золота на поле
  const golds = document.querySelectorAll('.gold-big');
  const gameField = document.getElementById('gameField');
  const fieldHeight = 675;
  // Получаем элемент ящика
  const boxElement = document.getElementById('boxElement');
  // Если ящик не существует — выходим
  if (!boxElement) return;

  // Получаем границы ящика
  const boxRect = boxElement.getBoundingClientRect();
  const gameFieldRect = gameField.getBoundingClientRect();

  // Вычисляем абсолютные координаты ящика в пределах игрового поля
  const boxAbsX = boxRect.left - gameFieldRect.left;
  const boxAbsY = boxRect.top - gameFieldRect.top;

  // Определяем границы ящика
  const boxLeft = boxAbsX;
  const boxTop = boxAbsY;
  const boxRight = boxAbsX + boxRect.width;
  const boxBottom = boxAbsY + boxRect.height;

  // Проходим по каждому элементу золота
  golds.forEach(gold => {
    // Получаем текущую позицию и скорость
    let y = parseFloat(gold.dataset.y);
    const velocityY = parseFloat(gold.dataset.velocityY);
    let rotation = parseFloat(gold.dataset.rotation);

    // Обновляем позицию
    y += velocityY;
    gold.dataset.y = y;

    // Обновляем позицию и вращение на экране
    gold.style.top = `${y}px`;
    gold.style.transform = `rotate(${rotation}deg)`;

    // Увеличиваем вращение
    gold.dataset.rotation = rotation + 2;

    // Удаляем золото, если оно вышло за нижнюю границу
    if (y > fieldHeight + 60) {
      gold.remove();
      // Вычитаем 30 очков за пропущенное золото
      currentScore -= 30;
      // проигрываем звук ошибки
      playSound('error');
      updateScoreDisplay();
      return;
    }

    // Получаем границы золота
    const x = parseFloat(gold.style.left);
    const goldLeft = x;
    const goldTop = y;
    const goldRight = x + 60;
    const goldBottom = y + 60;

    // Проверяем столкновение с ящиком
    if (
      goldRight > boxLeft &&      // Правая граница золота за левой границей ящика
      goldLeft < boxRight &&      // Левая граница золота до правой границы ящика
      goldBottom > boxTop &&      // Нижняя граница золота ниже верхней границы ящика
      goldTop < boxBottom        // Верхняя граница золота выше нижней границы ящика
    ) {
      // Столкновение!
      gold.remove();
      // Анимация ящика при сборе золота
      animateBoxForGold();
      // Звук попадания золота в коробку
      playSound('gold');
      // Добавляем 10 очков за сбор золота
      currentScore += 10;
      updateScoreDisplay();
      return;
    }
  });
}

// Анимация движения золота
function animateGold() {
  // Если игра не на паузе — обновляем позиции
  if (!gamePaused) {
    moveGold();
  }
  // Продолжаем анимацию
  goldAnimationId = requestAnimationFrame(animateGold);
}

// Запуск генерации золота
function startGoldGeneration() {
  stopGoldGeneration(); // Очищаем предыдущий интервал
  // Создаём первое золото
  createGold();
  // Интервал: 0.8 секунды
  goldInterval = setInterval(() => {
    if (!gamePaused) {
      createGold();
    }
  }, 800);
  // Запускаем анимацию
  goldAnimationId = requestAnimationFrame(animateGold);
}

// Остановка генерации золота
function stopGoldGeneration() {
  // Если интервал запущен — останавливаем его
  if (goldInterval) {
    clearInterval(goldInterval);
    goldInterval = null;
  }
  // Если анимация запущена — останавливаем её
  if (goldAnimationId) {
    cancelAnimationFrame(goldAnimationId);
    goldAnimationId = null;
  }
}

// Функция для анимации коробки при сборе золота
function animateBoxForGold() {
  // Получаем элемент ящика
  const boxElement = document.getElementById('boxElement');
  // Если ящик существует
  if (boxElement) {
    // Убираем анимацию тряски (если была)
    boxElement.classList.remove('shake-red');
    // Добавляем анимацию зелёного свечения
    boxElement.classList.add('glow-green');
    // Через 300 мс убираем анимацию
    setTimeout(() => {
      boxElement.classList.remove('glow-green');
    }, 300);
  }
}

// Функция для анимации коробки при попадании астероида
function animateBoxForAsteroid() {
  // Получаем элемент ящика
  const boxElement = document.getElementById('boxElement');
  // Если ящик существует
  if (boxElement) {
    // Убираем анимацию свечения (если была)
    boxElement.classList.remove('glow-green');
    // Добавляем анимацию тряски и красного свечения
    boxElement.classList.add('shake-red');
    // Через 400 мс убираем анимацию
    setTimeout(() => {
      boxElement.classList.remove('shake-red');
    }, 400);
  }
}





// ===================================================================================
//                             ОБЩАЯ ЛОГИКА ЗАПУСКА УРОВНЕЙ
// ===================================================================================

function startLevelWithDifficulty(level, difficulty) {
  // Проверяем, доступен ли сложный режим
  if (difficulty === 'hard' && !hasPlayerBeatenNormalLevel(level)) {
    // Если нет — выводим сообщение и выходим
    alert(`Сложный уровень недоступен! Сначала победите в обычном режиме "${getLevelName(level)}".`);
    return;
  }
  // Сохраняем выбранный уровень и сложность в локальное хранилище
  localStorage.setItem('currentLevel', level);
  localStorage.setItem('currentDifficulty', difficulty);
  // Устанавливаем множитель сложности (1.3 для сложного, 1 для обычного)
  difficultyMultiplier = (difficulty === 'hard') ? 1.3 : 1;
  // Сбрасываем состояние паузы
  gamePaused = false;
  // Скрываем экран паузы
  document.getElementById('pauseOverlay').style.display = 'none';
  // Сбрасываем счёт
  currentScore = 0;
  // Обновляем отображение счёта
  updateScoreDisplay();
  // Показываем игровое поле
  showGame();

  // Очищаем все анимации и удаляем объекты перед запуском уровня
  stopEarthAnimation();
  stopAsteroidGeneration();
  stopUfoAnimation();
  stopAsteroidBeltGeneration();
  stopDiamondGeneration();
  stopBigAsteroidGeneration();
  stopGoldGeneration();

  // Очищаем снаряды
  ufoBullets.forEach(bullet => bullet.element.remove());
  ufoBullets = [];

  // Удаляем все объекты с игрового поля (астероиды, алмазы, золото, снаряды)
  const gameField = document.getElementById('gameField');
  const allElements = gameField.querySelectorAll('.asteroid, .asteroid-belt, .diamond-belt, .asteroid-big, .gold-big, .ufo-bullet');
  allElements.forEach(el => el.remove());

  // Для режима "Спасти Землю" показываем солнце, орбиту и землю, для других режимов скрываем
  const sunElement = document.getElementById('sunElement');
  const orbitElement = document.getElementById('orbitElement');
  const earthElement = document.getElementById('earthElement');
  if (level === 'earth') {
    // Показываем солнце, орбиту и землю
    sunElement.style.display = 'block';
    sunElement.style.opacity = '1';
    orbitElement.style.display = 'block';
    earthElement.style.display = 'block';
    earthElement.style.opacity = '1';

    // Запускаем анимацию вращения Земли
    startEarthAnimation();
    // Запускаем генерацию астероидов
    startAsteroidGeneration();
  } else {
    // Скрываем солнце, орбиту и землю
    sunElement.style.display = 'none';
    orbitElement.style.display = 'none';
    earthElement.style.display = 'none';

    // Заглушка для других режимов
    if (level === 'asteroids') {
      // Запускаем НЛО
      startUfoAnimation();
      // Запускаем пояс астероидов
      startAsteroidBeltGeneration();
      // Запускаем генерацию алмазов
      startDiamondGeneration();
      // Останавливаем старую анимацию снарядов
      stopBulletsAnimation();
      // Запускаем анимацию снарядов
      animateBullets();
    } else if (level === 'gold') {
      // Показываем ящик
      const boxElement = document.getElementById('boxElement');
      if (boxElement) {
        boxElement.style.display = 'block';
      }

      // Запускаем анимацию больших астероидов и золота
      startBigAsteroidGeneration();
      startGoldGeneration();
    }
  }
  // Сбрасываем и запускаем таймер
  stopTimer();
  startTimer();
  // Выводим сообщение в консоль
  console.log(`Начало игры: ${getLevelName(level)}, сложность: ${getDifficultyName(difficulty)}`);
}





// ===================================================================================
//                                     ЗВУКИ
// ===================================================================================

// Список звуков
const sounds = {
  boom: new Audio('./sounds/boom.mp3'),    // разрушение астероида
  shoot: new Audio('./sounds/shoot.mp3'),  // выстрел НЛО
  gold: new Audio('./sounds/gold.mp3'),     // падение золота в коробку
  error: new Audio('./sounds/error.mp3')  // ошибка (штраф)
};

// Функция воспроизведения звука по имени
function playSound(name) {
  if (!soundEnabled) return;
  const sound = sounds[name];
  if (sound) {
    // Перезапуск: если звук уже играет — начинаем с начала
    sound.currentTime = 0;
    // для случаев, когда нет взаимодействия с пользователем (политика браузеров)
    sound.play().catch(e => console.warn("Звук не проигрался:", e));
  }
}

// Инициализация звуков после первого клика/нажатия (обход политики autoplay)
function initAudio() {
  // Пытаемся "разблокировать" аудио
  Object.values(sounds).forEach(sound => {
    sound.load(); // подгружаем метаданные
  });
  // Удаляем обработчик после первого срабатывания
  document.body.removeEventListener('click', initAudio);
  document.body.removeEventListener('keydown', initAudio);
}

// Подключаем инициализацию на первое взаимодействие
document.body.addEventListener('click', initAudio, { once: true });   // На клик
document.body.addEventListener('keydown', initAudio, { once: true }); // На нажатие кнопки

// Переключение звука
function toggleSound() {
  soundEnabled = !soundEnabled; // Переключаем флаг звука
  updateSoundButton();          // Обновляем надпись на кнопке
}

// Обновление текста кнопки в зависимости от состояния звука
function updateSoundButton() {
  const btn = document.getElementById('soundToggleBtn');
  if (btn) {
    if (soundEnabled) {
      btn.textContent = 'Выключить звук';
    } else {
      btn.textContent = 'Включить звук';
    }
  }
}
