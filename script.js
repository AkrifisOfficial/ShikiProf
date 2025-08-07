// DOM элементы
const profileHeader = document.getElementById('profile-header');
const animeStats = document.getElementById('anime-stats');
const animeContainer = document.getElementById('anime-container');
const favoritesSection = document.getElementById('favorites');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const updateDate = document.getElementById('update-date');

// Загрузка данных
Promise.all([
    fetch('user.json').then(res => res.json()),
    fetch('anime.json').then(res => res.json())
]).then(([userData, animeData]) => {
    renderProfile(userData);
    renderStats(animeData);
    renderFavorites(animeData.filter(a => a.score === 10).slice(0, 5));
    renderAnimeList(animeData);
    
    // Обновление даты
    updateDate.textContent = new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
});

// Рендеринг профиля
function renderProfile(user) {
    profileHeader.innerHTML = `
        <div class="profile-card">
            <img src="https://shikimori.one${user.avatar}" alt="Avatar" class="avatar">
            <div class="profile-info">
                <h1>${user.nickname}</h1>
                <p>${user.location || 'Не указано'}</p>
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-value">${user.stats.anime_rates}</div>
                        <div class="stat-label">Аниме</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${user.stats.manga_rates}</div>
                        <div class="stat-label">Манга</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${user.stats.comments}</div>
                        <div class="stat-label">Комментарии</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Рендеринг статистики
function renderStats(animeList) {
    const totalEpisodes = animeList.reduce((sum, anime) => sum + anime.episodes, 0);
    const avgScore = (animeList.reduce((sum, anime) => sum + anime.score, 0) / animeList.length).toFixed(2);
    
    animeStats.innerHTML = `
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${animeList.length}</div>
                <div class="stat-label">Завершено</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalEpisodes}</div>
                <div class="stat-label">Эпизодов</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgScore}</div>
                <div class="stat-label">Средняя оценка</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${animeList.filter(a => a.score === 10).length}</div>
                <div class="stat-label">Избранных</div>
            </div>
        </div>
    `;
}

// Рендеринг списка аниме
function renderAnimeList(animeList, sortBy = 'name') {
    let sortedList = [...animeList];
    
    if (sortBy === 'name') {
        sortedList.sort((a, b) => a.anime.russian.localeCompare(b.anime.russian));
    } else if (sortBy === 'score') {
        sortedList.sort((a, b) => b.score - a.score);
    }
    
    animeContainer.innerHTML = `
        <div class="anime-grid">
            ${sortedList.map(anime => `
                <div class="anime-card">
                    <img src="https://shikimori.one${anime.anime.image.original}" 
                         alt="${anime.anime.russian}" 
                         class="anime-poster">
                    <div class="anime-details">
                        <h3 class="anime-title">${anime.anime.russian}</h3>
                        <p>${anime.anime.episodes || '?'} эп. • ${anime.anime.kind === 'tv' ? 'TV' : 'Movie'}</p>
                        <div class="anime-meta">
                            <span>${anime.status === 'completed' ? 'Просмотрено' : 'Смотрю'}</span>
                            <span class="score">${anime.score}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Рендеринг избранного
function renderFavorites(favorites) {
    favoritesSection.innerHTML = `
        <div class="anime-grid">
            ${favorites.map(anime => `
                <div class="anime-card">
                    <img src="https://shikimori.one${anime.anime.image.original}" 
                         alt="${anime.anime.russian}" 
                         class="anime-poster">
                    <div class="anime-details">
                        <h3 class="anime-title">${anime.anime.russian}</h3>
                        <div class="score">${anime.score} ★</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Фильтрация и сортировка
searchInput.addEventListener('input', filterAnime);
sortSelect.addEventListener('change', () => renderAnimeList(currentAnimeList, sortSelect.value));

let currentAnimeList = [];

function filterAnime() {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = currentAnimeList.filter(anime => 
        anime.anime.russian.toLowerCase().includes(searchTerm)
    );
    renderAnimeList(filtered, sortSelect.value);
}

// Инициализация
function renderAnimeList(animeList, sortBy = 'name') {
    currentAnimeList = animeList;
    // ...остальной код рендеринга
}
