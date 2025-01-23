// Звуки игры
const clickSound = new Audio('sound/click.mp3'); // Звук клика
const dropSound = new Audio('sound/drop.mp3'); // Звук сброса карты

// Настройки колод и карт
let chuseDeckForEach = 0; // Счетчик выбора колоды
let numberDeck = []; // Массив для хранения выбранных колод
const colsCardsInSprites = 6; // Количество колонок с картами в спрайте

// Названия и параметры колод
const deckNames = [
    'img/deck/animals.jpg', 'img/deck/wildanimals.jpg', 'img/deck/fables.jpg',
    'img/deck/history.jpg', 'img/deck/myths.jpg', 'img/deck/spookies.jpg',
    'img/deck/hogwarts.jpg', 'img/deck/tvary.jpg', 'img/deck/starWars.jpg', 'img/deck/marveldc.jpg'
];
const rowsCardsInSprite = {
    "animals.jpg": 5, "fables.jpg": 6, "history.jpg": 6,
    "hogwarts.jpg": 7, "myths.jpg": 5, "spookies.jpg": 5,
    "starWars.jpg": 8, "tvary.jpg": 7, "wildanimals.jpg": 5, "marveldc.jpg": 11
};
const emptyCards = [0, 0, 4, 4, 0, 0, 3, 3, 4]; // Пустые карты в колодах
const urlImgsBack = [
    'img/back/animals.jpg', 'img/back/wildanimals.jpg', 'img/back/fables.jpg',
    'img/back/history.jpg', 'img/back/myths.jpg', 'img/back/spookies.jpg',
    'img/back/hogwarts.jpg', 'img/back/tvary.jpg', 'img/back/starWars.jpg', 'img/back/marveldc.jpg'
];

// Игровые массивы
let imagesArrayPlayer = []; // Карты выбранные игроками
let imagesArrayVed = []; // Карты ведущего (если отличается от карт игроков)
let shuffleDeckPlayer = []; // Перемешанный список индексов карт игроков
let shuffleDeckVed = []; // Перемешанный список индексов карт ведущего
let openedCards = []; // Открытые карты на столе
let vedCards = []; // Карты ведущего после предыдущего раунда
let openedHints = []; // Открытые подсказки
let selectedCards = []; // Карты, выбранные игроками

// Индексы и состояния карт
let selectedCardIndex = null; // Индекс выбранной карты
let shuffledIndexesPlayer = []; // Перемешанные индексы карт в колоде игроков
let shuffledIndexesVed = []; // Перемешанные индексы карт в колоде ведущего
let indexEmptyHint = null; // Индекс ранее выбранной карты в колоде ведущего

// Игра и управление ходом
let turne = null; // Текущий ход (ведущего или игроков)
let round = 0; // Текущий раунд
let chuseCardPlayer = 0; // Количество выбранных карт для игроков
let secretCard = null; // Секретная карта
let rejimeGame = null; // Режим игры

// Статусы и условия игры
let chuseHint = false; // Выбор подсказки активен или нет
let luse = false; // Проигрыш
let win = false; // Проверка на победу
let notPush = false; // Блокировка нажатий на кнопки и карты

// Тексты для действий игроков
const textForPlayers = [
    'Угадывающие должны убрать 1 карту', 'Угадывающие должны убрать 2 карты',
    'Угадывающие должны убрать 3 карты', 'Угадывающие должны убрать 4 карты',
    'Угадывающие должны убрать 1 карту'
];

// Функция создания карт для выбора колоды
function createDeckCards() {
    const deckContainer = document.getElementById("deckContainer");
    for (let i = 0; i < urlImgsBack.length; i++) {
        const deckCard = document.createElement("div");
        deckCard.classList.add("deck");
        deckCard.id = `card${i + 1}`;
        deckCard.onclick = () => ChuseDeckForGame(i);
        deckContainer.appendChild(deckCard);
    }
}

// Функция создания игровых карт
function createGameCards() {
    const gameCardsContainer = document.getElementById("gameCardsContainer");
    for (let i = 1; i <= 12; i++) {
        const gameCard = document.createElement("div");
        gameCard.classList.add("card");
        gameCard.onclick = () => chusePlayersCards(i);
        gameCardsContainer.appendChild(gameCard);
    }
}

// Функция создания карт для выбора подсказок
function createHintCards() {
    const hintsContainer = document.getElementById("hintsContainer");
    for (let i = 1; i <= 5; i++) {
        const hintCard = document.createElement("div");
        hintCard.classList.add("chuse-card");
        hintCard.onclick = () => chuseCardHints(i);
        hintsContainer.appendChild(hintCard);
    }
}

// Функция для выбора спрайта и создания стилей карт
function generateDeckStyles(deckNumber, imageArray) {

    const selectedDeck = deckNames[deckNumber].split('/').pop();; // Получаем имя выбранной колоды
    console.log("Колода:", selectedDeck);

    const rows = rowsCardsInSprite[selectedDeck]; // Количество строк в спрайте
    const cols = colsCardsInSprites; // Количество колонок всегда 6
    const cardWidth = 100 / (cols - 1); // Ширина каждой карты в процентах
    const cardHeight = 100 / (rows - 1); // Высота каждой карты в процентах

    // Очищаем массив перед добавлением новых стилей
    imageArray.length = 0;

    // Создаем стили для каждой карты в спрайте
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cardStyle = {
                'background-image': `url('${deckNames[deckNumber]}')`,
                'background-position': `${col * cardWidth}% ${row * cardHeight}%`,
                'background-size': `${cols * 100}% ${rows * 100}%`,
            };
            imageArray.push(cardStyle); // Добавляем стили в массив
        }
    }

    for (let del = 1; del < emptyCards[deckNumber] + 1; del++) {
        imageArray.pop();
    }
    return imageArray;
}

// Функция для перемешивания индексов карт
function shuffleCards(array, shaffleArray) {
    shaffleArray.length = 0; // Очищаем перемешанный массив
    for (let i = 0; i < array.length; i++) {
        shaffleArray.push(i); // Заполняем массив индексами
    }
    simpleShuffle(shaffleArray);
    return shaffleArray;
}

// Функция Фишера-Йетса с многократным перемешиванием
function simpleShuffle(array) {
    // Генерируем случайное число от 7 до 22 для количества перемешиваний
    const times = ultraRandom(7, 22);

    // Запускаем алгоритм Фишера-Йетса несколько раз
    for (let t = 0; t < times; t++) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    return array;
}

// Функция для генерации случайного числа с учётом времени
function ultraRandom(min, max) {
    const now = Date.now();
    const timeBasedRandom = (now % 1000) / 1000;
    const randomValue = (Math.random() + Math.random() * timeBasedRandom - Math.random() * timeBasedRandom);

    // Гарантируем, что результат находится в пределах min и max
    return Math.floor((Math.abs(randomValue) % 1) * (max - min + 1)) + min;
}

// Функция для отображения карт на странице
function displayShuffledCards(cardClass) {
    const cards = document.querySelectorAll(cardClass); // Получаем все элементы с указанным классом

    if (cardClass === '.chuse-card') {
        // Проверяем, совпадают ли колоды игрока и ведущего
        let nextCardIndex = (numberDeck[0] === numberDeck[1])
            ? shuffledIndexesPlayer.shift()
            : shuffledIndexesVed.shift();

        // Если массив vedCards пустой, загружаем новые карты из массива перемешанных карт
        if (vedCards.length === 0 && nextCardIndex !== undefined) {
            for (let i = 0; i < cards.length; i++) {
                if (shuffledIndexesVed.length > 0) {
                    nextCardIndex = shuffledIndexesVed.shift(); // Получаем новую карту
                }
                if (nextCardIndex !== undefined) {
                    vedCards.push(nextCardIndex); // Добавляем в массив карт ведущего
                }
            }
        } else if (nextCardIndex !== undefined) {
            vedCards.push(nextCardIndex); // Добавляем в массив карт ведущего
        }

        // Отображаем карты из vedCards
        vedCards.forEach((cardIndex, i) => {
            if (i < cards.length && imagesArrayVed[cardIndex]) {
                const cardStyle = imagesArrayVed[cardIndex];
                Object.assign(cards[i].style, {
                    'background-image': cardStyle['background-image'],
                    'background-position': cardStyle['background-position'],
                    'background-size': cardStyle['background-size'],
                    'width': cardStyle['width'],
                    'height': cardStyle['height']
                });
            }
        });

        simpleShuffle(shuffledIndexesVed);
        console.log("Колода ведущего", shuffledIndexesVed);
        console.log("Карты ведущего", vedCards);
    } else {
        // Для других классов отображаем карты из массива openedCards или перемешанных
        for (let i = 0; i < cards.length; i++) {
            const cardIndex = openedCards[i] !== undefined ? openedCards[i] : shuffledIndexesPlayer.shift(); // Получаем индекс из openedCards или перемешанных
            if (cardIndex !== undefined && imagesArrayPlayer[cardIndex]) {
                const cardStyle = imagesArrayPlayer[cardIndex];
                Object.assign(cards[i].style, {
                    'background-image': cardStyle['background-image'],
                    'background-position': cardStyle['background-position'],
                    'background-size': cardStyle['background-size'],
                    'width': cardStyle['width'],
                    'height': cardStyle['height']
                });
            }

            // Добавляем индекс в openedCards, если его там нет
            if (cardIndex !== undefined && !openedCards.includes(cardIndex)) {
                openedCards.push(cardIndex);
            }
        }
        simpleShuffle(openedCards);
        console.log("Карты игроков", openedCards);
    }
}

// Функция для выбора случайной загаданной карты из списка показанных карт на столе
function chuseSecretCard() {
    // Проверяем, есть ли открытые карты
    if (openedCards.length === 0) {
        console.error("Ошибка: нет открытых карт для выбора секретной карты.");
        return;
    }

    // Выбираем случайный индекс карты из открытых карт
    let randomIndex = null;

    const indexFor = ultraRandom(0, 17);

    for (i = 1; i < indexFor; i++) {
        randomIndex = ultraRandom(0, 11);; // Генерирует случайное число от 0 до 12
    }
    // Устанавливаем секретную карту по индексу
    secretCard = randomIndex;
    if (secretCard === null) {
        chuseSecretCard();
    }
}

function showSecretCard() {
    // Получаем все карты на столе
    const cards = document.querySelectorAll('.card');

    // Добавляем стили для выделения секретной карты
    const secretCardStyle = cards[secretCard];
    secretCardStyle.classList.add('selected'); // Добавляем класс для стилизации
    secretCardStyle.classList.add('secret');
}

function hideSecretCard() {
    // Получаем все карты на столе
    const cards = document.querySelectorAll('.card');

    // Убираем выделение у секретной карты
    const secretCardStyle = cards[secretCard];
    secretCardStyle.classList.remove('selected'); // Убираем класс выделения
}

function changePage(pageNumber) {
    // Получаем все элементы с классом 'container'
    let pages = document.querySelectorAll('.container');

    // Скрываем все страницы
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // Показываем только нужную страницу
    if (pages[pageNumber]) {
        pages[pageNumber].style.display = 'flex';
    }
    // Скрываем загрузочный экран
    const overlay = document.querySelector('.overlay.load');
    overlay.classList.remove('hidden');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToDown() {
    window.scrollTo({
        top: document.body.scrollHeight, //|| document.documentElement.scrollHeight,
        behavior: 'smooth' // Плавная прокрутка
    });
}

// Функция для удаления атрибута onclick со всех элементов
function removeAllOnClick() {
    // Получаем все элементы с атрибутом onclick
    const elements = document.querySelectorAll('[onclick]');

    // Проходим по всем найденным элементам
    elements.forEach(element => {
        element.removeAttribute('onclick'); // Удаляем атрибут onclick
    });
}

function MenuOverlay() {
    scrollToTop();
    playSound(clickSound);

    const overlay = document.querySelector('.overlay.menu-overlay');
    const textOverlay = document.querySelector('.table-text.menu');
    const textTop = document.getElementById('text-chuse-deck');

    if (textTop.textContent.includes('Колода для ведущего')) {
        textOverlay.textContent = "Ход ведущего";
    } else if (textTop.textContent.includes('Выберите колоду для игроков')) {
        textTop.textContent = "Выберите колоду для ведущего";
    } else {
        textTop.textContent = "Выберите колоду для игроков";
        textOverlay.textContent = "Колода для ведущего";
    }
    overlay.classList.add('hidden');
}

function ChuseDeckForGame(number) {
    playSound(clickSound);

    const overlay = document.querySelector('.overlay.menu-overlay');

    numberDeck.push(number);
    console.log('Выбрана колода номер: ', numberDeck);
    if (numberDeck.length === 2) {
        overlay.classList.add('hidden');
        NextTurnTable();
    } else {
        overlay.classList.remove('hidden');
    }
}

function startGame() {
    // Генерация стилей для выбранной колоды
    generateDeckStyles(numberDeck[0], imagesArrayPlayer);
    // Перемешиваем индексы карт
    shuffledIndexesPlayer = shuffleCards(imagesArrayPlayer, shuffleDeckPlayer);
    console.log("Колода перемешанных карт игроков:", shuffledIndexesPlayer);

    // Если колоды игрока и ведущего совпадают
    if (numberDeck[0] === numberDeck[1]) {
        imagesArrayVed = imagesArrayPlayer;
        shuffledIndexesVed = shuffledIndexesPlayer;
    } else {
        generateDeckStyles(numberDeck[1], imagesArrayVed);
        shuffledIndexesVed = shuffleCards(imagesArrayVed, shuffleDeckVed);
    }

    // Отображаем перемешанные карты на странице
    displayShuffledCards('.card');
    displayShuffledCards('.chuse-card');
    // Выбираем и показываем секретную карту
    chuseSecretCard(); // Выбираем случайную секретную карту
    showSecretCard(); // Показываем секретную карту ведущему
    // Переход на страницу игры
    changePage(1); // Переход на страницу игры
}

function NextTurnTable() {
    const overlay = document.querySelector('.overlay.load');
    // Показ оверлея
    if (overlay.classList.contains('hidden')) {
        if (round === 0) {
            playSound(clickSound);
            startGame(); // Запускаем игру
            turne = "ved";
        } else {
            overlay.classList.remove('hidden'); // Показываем оверлей при запуске
        }
    } else {
        playSound(clickSound);
        if (round === 0) {
            playSound(dropSound);
            overlay.classList.remove('hidden'); // Скрываем оверлей после выполнения
            scrollToTop(); // Прокрутка к верхней части страницы
        } else {
            handleNextTurn(); // Выполняем действия для следующего хода
        }
        overlay.classList.add('hidden'); // Добавляем оверлей после выполнения
    }
    updateText(); // Обновляем текст на экране
    checkEndGame(); // Проверка и завершение игры
}

function checkEndGame() {
    const textTable = document.querySelector('.table-loading');
    const endButton = document.querySelector('.btn.end');

    if (win) {
        endButton.classList.remove('hidden'); // Показываем кнопку завершения
        endButton.textContent = "Открыть карты";
        // Обновляем текст для ведущего
        textTable.textContent = "ПОБЕДА!";
        scrollToTop();
    } else if (luse) {
        endButton.classList.remove('hidden'); // Показываем кнопку завершения
        endButton.textContent = "Открыть карты";
        // Обновляем текст для ведущего
        textTable.textContent = "ПРОИГРЫШ";
        scrollToTop();
    }
    if (endButton.textContent === 'Открыть карты') {
        removeAllOnClick();
        FinishClick();
    }
}

function handleNextTurn() {
    if (turne === "ved") {
        displayShuffledCards('.chuse-card'); // Действия ведущего
        scrollToDown();
    } else {
        scrollToTop();
    }
}

function updateText() {
    const textSecond = document.getElementById('text-for-players');
    const textTable = document.querySelector('.table-loading');
    const textRound = document.getElementById('round');
    const endButton = document.querySelector('.btn.end');

    if (turne === "ved" && !luse) {
        if (win) {
            // Обновляем текст для всех элементов
            textTable.textContent = "ПОБЕДА";
            textSecond.textContent = `Поздравляю! Вы нашли загаданную карту.`;
            textRound.textContent = "ПОБЕДА";
            scrollToTop();
        } else {
            playSound(clickSound);
            // Обновляем текст для ведущего
            textTable.textContent = "Ход ведущего";
            endButton.classList.remove('hidden');
            endButton.textContent = "Продолжить";
            textSecond.textContent = textForPlayers[round];
            textRound.textContent = `РАУНД ${round + 1}`;
        }
    } else {
        // Обновляем текст для игроков
        textTable.textContent = "Ход игроков";
        if (luse === true) {
            textRound.textContent = `ПРОИГРЫШ`;
            textSecond.textContent = "Вы проиграли. Попробуйте еще раз.";
            scrollToTop();
        }
    }
}

function openBack(back) {
    const cards = document.querySelectorAll('.chuse-card'); // Получаем все элементы с классом .card

    // Применяем стили к элементам на основе перемешанных индексов
    for (let i = 0; i < cards.length; i++) {
        // Удаляем текущее фоновое изображение, если оно есть
        cards[i].style.backgroundImage = '';
        cards[i].style.backgroundPosition = '';
        cards[i].style.backgroundSize = '';

        // Создаем объект со стилями
        const styles = {
            'background-image': `url(${urlImgsBack[back]})`,
            'background-size': '100%',
        };

        // Применяем стили к текущей карте
        Object.assign(cards[i].style, styles);
    }
}

function chuseCardHints(number) {
    if (turne === "ved" && chuseHint === false && !luse && !win) {
        playSound(clickSound);
        const cards = document.querySelectorAll('.chuse-card');
        const confirmButton = document.querySelector('.container-btn-confirm');

        // Убираем выделение с предыдущей карты, если она была выбрана
        if (selectedCardIndex !== null) {
            cards[selectedCardIndex].classList.remove('selected');
        }

        // Если нажата та же карта, снимаем выделение
        if (selectedCardIndex === number - 1) {
            selectedCardIndex = null; // Сброс выбора
            confirmButton.classList.add('hidden'); // Скрываем кнопку
        } else {
            // Устанавливаем новое выделение
            selectedCardIndex = number - 1; // Обновляем индекс выбранной карты
            cards[selectedCardIndex].classList.add('selected');
            confirmButton.classList.remove('hidden'); // Показываем кнопку
        }
        scrollToDown();
    }
}

function chusePlayersCards(number) {
    if (turne !== "player" || notPush) return;

    const cards = document.querySelectorAll('.card');
    const confirmButton = document.querySelector('.btn-confirm.ok');

    const cardIndex = number - 1;
    const cardElement = cards[cardIndex];

    if (cardElement.classList.contains('deleted')) return;

    // Определяем максимальное количество карт, которое можно выбрать в текущем раунде
    const maxCardsToSelect = chuseCardPlayer === 5 ? 1 : chuseCardPlayer;

    // Проверяем, выбрана ли карта
    const isSelected = selectedCards.includes(cardIndex);

    if (isSelected) {
        // Убираем карту из массива выбранных
        playSound(clickSound);
        selectedCards = selectedCards.filter(index => index !== cardIndex);
        cardElement.classList.remove('selected');
    } else if (selectedCards.length < maxCardsToSelect) {
        // Добавляем карту, если лимит не превышен
        playSound(clickSound);
        selectedCards.push(cardIndex);
        cardElement.classList.add('selected');
    }
    // Управляем видимостью кнопки подтверждения
    confirmButton.classList.toggle('hidden', selectedCards.length !== maxCardsToSelect);
}

async function okPlayerCard() {
    playSound(clickSound);
    const cards = document.querySelectorAll('.card.selected');
    const confirmButton = document.querySelector('.btn-confirm.ok');
    const delay = 1000;
    const extraDelay = 800;

    notPush = true;
    selectedCards = [];
    confirmButton.classList.add('hidden');

    for (let index = 0; index < cards.length; index++) {
        await pause(delay);
        playSound(dropSound);
        cards[index].classList.remove('selected');
        cards[index].classList.add('deleted');
        if (cards[index].classList.contains('secret')) {
            luse = true;
            console.log("Игрок проиграл, секретная карта была удалена.");
        }
    }

    if (round === 5 && luse !== true) {
        win = true;
        console.log('Игроки победили: win === ', win);
    }

    await pause(extraDelay);
    turne = "ved";
    NextTurnTable();
    showSecretCard();
    notPush = false;
    playSound(clickSound);
    scrollToTop();
}

function showHintsCard(direction) {
    playSound(dropSound);
    playSound(clickSound);

    chuseHint = true;

    const cards = document.querySelectorAll('.chuse-card');
    const hintCardsContainers = document.querySelectorAll('.container-hint-card');
    const hintCards = document.querySelectorAll('.hint-card');
    const textHintCards = document.querySelectorAll('.text-hint-card');
    const confirmButton = document.querySelector('.container-btn-confirm');
    const buttonClose = document.querySelector('.container-btn-cancel');

    // Скрываем кнопку
    confirmButton.classList.add('hidden');
    buttonClose.classList.remove('hidden');

    // Убираем выделение с выбранной карты
    cards[selectedCardIndex].classList.remove('selected');
    cards[selectedCardIndex].classList.add('deleted');

    // Сохраняем индекс выделенной карты в массив открытых подсказок
    const selectedCard = selectedCardIndex; // Используем индекс
    openedHints.push(selectedCard);

    // Применяем стили для hint-card на основе выбранной карты
    const hintIndex = openedHints.length - 1; // Индекс текущей подсказки
    const cardIndex = openedHints[hintIndex]; // Индекс выбранной карты

    const containerHintCard = hintCardsContainers[hintIndex];
    const hintCard = hintCards[hintIndex]; // Получаем hintCard по индексу
    const textHintCard = textHintCards[hintIndex];

    // Применяем стили к hintCard
    containerHintCard.classList.remove('hidden'); // Делаем подсказку видимой

    Object.assign(hintCard.style, {
        'background-image': cards[cardIndex].style.backgroundImage || '',
        'background-position': cards[cardIndex].style.backgroundPosition || 'center',
        'background-size': cards[cardIndex].style.backgroundSize || 'cover',
        'transform': `rotate(${direction}deg)` // Поворот в зависимости от направления
    });

    if (direction === 0) {
        textHintCard.classList.add('similo');
        textHintCard.textContent = "Есть что-то общее."
    } else {
        textHintCard.classList.remove('similo');
        textHintCard.textContent = "Чем-то отличается."
    }

    scrollToDown();
}

function cancelHints() {

    playSound(clickSound);

    chuseHint = false;
    // Получаем элементы карт и подсказок
    const cards = document.querySelectorAll('.chuse-card');
    const hintCardsContainers = document.querySelectorAll('.container-hint-card');
    const hintCards = document.querySelectorAll('.hint-card');
    const confirmButton = document.querySelector('.container-btn-confirm');
    const buttonClose = document.querySelector('.container-btn-cancel');

    // Убираем класс deleted с карты
    cards[selectedCardIndex].classList.remove('deleted');
    cards[selectedCardIndex].classList.add('selected');

    // Получаем индекс последней подсказки
    const lastHintIndex = openedHints.length - 1;

    // Проверяем, если есть хотя бы одна открытая подсказка
    if (lastHintIndex >= 0) {
        // Скрываем последнюю подсказку
        const hintCard = hintCardsContainers[lastHintIndex];
        hintCard.classList.add('hidden');

        // Удаляем индекс карты из массива открытых подсказок
        openedHints.pop();
    }
    // Скрываем кнопку отмены и показываем кнопку подтверждения
    buttonClose.classList.add('hidden');
    confirmButton.classList.remove('hidden');
}

function yesHints() {
    playSound(clickSound);

    // Получаем элементы карт и подсказок
    const cards = document.querySelectorAll('.chuse-card');

    // Убираем класс deleted с карты
    cards[selectedCardIndex].classList.remove('deleted');

    // Удаляем элемент из vedCards по индексу selectedCardIndex
    if (selectedCardIndex !== null) {
        vedCards.splice(selectedCardIndex, 1);
    }

    // Сбрасываем выбранную карту
    selectedCardIndex = null;
    chuseHint = false;

    const buttonClose = document.querySelector('.container-btn-cancel');
    buttonClose.classList.add('hidden');
    turne = "player";

    const textBtn = document.querySelector('.btn.end ');
    textBtn.textContent = "ПРОДОЛЖИТЬ";

    hideSecretCard(); // Скрываем секретную карту от игроков
    nextRound();
    openBack(numberDeck[1]); // Выполняем действия игрока
    NextTurnTable();
    scrollToTop();
}

function nextRound() {
    round++;
    chuseCardPlayer = round <= 5 ? round : 1;
    console.log(`Раунд ${round}: Можно выбрать до ${chuseCardPlayer} карт.`);
}

// Функция для воспроизведения звука
function playSound(sound) {
    // Перематываем аудио на начало (если требуется повторное воспроизведение)
    sound.currentTime = 0;
    // Воспроизводим звук
    sound.play();
}

function FinishClick() {
    // Находим кнопку по классу
    const button = document.querySelector('.btn.end');

    // Проверяем, что элемент существует, и добавляем событие
    if (button) {
        button.addEventListener('click', function () {
            NextTurnTable(); // Вызов функции при клике
        });
    }
}

function pause(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time); // Разрешаем Promise через указанное время
    });
}

window.onload = async function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker зарегистрирован с областью:', registration.scope);
            })
            .catch(error => {
                console.error('Ошибка при регистрации Service Worker:', error);
            });
    }

    // Создание карт для выбора колоды
    createDeckCards();
    createGameCards();
    createHintCards();

    const cardElements = document.querySelectorAll('.deck');

    for (let i = 0; i < urlImgsBack.length; i++) {
        cardElements[i].style.backgroundImage = `url(${urlImgsBack[i]})`;
    }

    const load = document.querySelector('.overlay.load');
    const menu = document.querySelector('.overlay.menu-overlay');

    await pause(1000);

    load.classList.add('hidden');
    menu.classList.remove('hidden');

    scrollToTop(); // Прокрутка к верхней части страницы
};
