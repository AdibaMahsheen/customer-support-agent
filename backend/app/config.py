import os
from pathlib import Path
from dotenv import load_dotenv

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

# Load environment variables
load_dotenv(dotenv_path=ENV_PATH, override=True)

class Settings:
    @property
    def openai_api_key(self) -> str:
        load_dotenv(dotenv_path=ENV_PATH, override=True)
        return os.getenv("OPENAI_API_KEY", "").strip()

    @property
    def hindsight_api_key(self) -> str:
        load_dotenv(dotenv_path=ENV_PATH, override=True)
        return os.getenv("HINDSIGHT_API_KEY", "").strip()

    @property
    def hindsight_base_url(self) -> str:
        load_dotenv(dotenv_path=ENV_PATH, override=True)
        return os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io").strip()

    @property
    def openai_model(self) -> str:
        return os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()

    @property
    def host(self) -> str:
        return os.getenv("HOST", "127.0.0.1")

    @property
    def port(self) -> int:
        return int(os.getenv("PORT", "8000"))

    def update_keys(self, openai_api_key: str = None, hindsight_api_key: str = None, hindsight_base_url: str = None):
        """Update environment variables and persist to .env"""
        lines = []
        if ENV_PATH.exists():
            with open(ENV_PATH, "r", encoding="utf-8") as f:
                lines = f.readlines()

        env_dict = {}
        for line in lines:
            line_str = line.strip()
            if line_str and not line_str.startswith("#") and "=" in line_str:
                k, v = line_str.split("=", 1)
                env_dict[k.strip()] = v.strip()

        if openai_api_key is not None:
            env_dict["OPENAI_API_KEY"] = openai_api_key.strip()
            os.environ["OPENAI_API_KEY"] = openai_api_key.strip()

        if hindsight_api_key is not None:
            env_dict["HINDSIGHT_API_KEY"] = hindsight_api_key.strip()
            os.environ["HINDSIGHT_API_KEY"] = hindsight_api_key.strip()

        if hindsight_base_url is not None:
            env_dict["HINDSIGHT_BASE_URL"] = hindsight_base_url.strip()
            os.environ["HINDSIGHT_BASE_URL"] = hindsight_base_url.strip()

        with open(ENV_PATH, "w", encoding="utf-8") as f:
            for k, v in env_dict.items():
                f.write(f"{k}={v}\n")

settings = Settings()
