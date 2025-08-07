import requests
import json

USER_ID = "Akrifis"
USER_AGENT = "ShikimoriStaticProfile/1.0 (contact@example.com)"
BASE_URL = "https://shikimori.one/api"

def fetch_data():
    # Получение данных пользователя
    user_url = f"{BASE_URL}/users/{USER_ID}"
    user_data = requests.get(user_url, headers={"User-Agent": USER_AGENT}).json()
    
    # Получение списка аниме
    anime_url = f"{BASE_URL}/users/{USER_ID}/anime_rates"
    anime_data = requests.get(
        anime_url,
        headers={"User-Agent": USER_AGENT},
        params={"limit": 5000, "status": "completed"}
    ).json()
    
    return user_data, anime_data

if __name__ == "__main__":
    user, anime = fetch_data()
    with open("user.json", "w") as f:
        json.dump(user, f, ensure_ascii=False)
    with open("anime.json", "w") as f:
        json.dump(anime, f, ensure_ascii=False)
