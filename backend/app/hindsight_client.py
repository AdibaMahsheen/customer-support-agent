"""
Real Hindsight API Client for Long-Term Customer Memory.
Connects to HINDSIGHT_BASE_URL using HINDSIGHT_API_KEY.
If the API key is missing, reports genuine configuration status without simulating.
"""

import httpx
from typing import Dict, Any, List, Optional
from app.config import settings
from app.database import db

class HindsightClient:
    def __init__(self):
        pass

    @property
    def api_key(self) -> str:
        return settings.hindsight_api_key

    @property
    def base_url(self) -> str:
        url = settings.hindsight_base_url.rstrip("/")
        return url

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 3)

    def test_connection(self) -> Dict[str, Any]:
        """Test real connectivity to Hindsight API"""
        if not self.is_configured():
            return {
                "connected": False,
                "status": "missing_api_key",
                "message": "HINDSIGHT_API_KEY is not configured in .env or Settings."
            }

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "X-API-Key": self.api_key,
                "Content-Type": "application/json"
            }
            # Attempt a health / ping endpoint
            with httpx.Client(timeout=4.0) as client:
                resp = client.get(f"{self.base_url}/health", headers=headers)
                if resp.status_code in [200, 204]:
                    return {"connected": True, "status": "connected", "message": "Hindsight API reachable and authorized."}
                elif resp.status_code in [401, 403]:
                    return {"connected": False, "status": "auth_failed", "message": f"Hindsight API Key rejected ({resp.status_code})."}
                else:
                    return {"connected": False, "status": "http_error", "message": f"Hindsight returned HTTP {resp.status_code}."}
        except Exception as e:
            return {"connected": False, "status": "unreachable", "message": f"Could not reach Hindsight API at {self.base_url}: {str(e)}"}

    def search_memories(self, customer_id: str, query: str = "") -> Dict[str, Any]:
        """
        Query Hindsight memory for a customer.
        If live Hindsight API is configured, calls the remote endpoint.
        Always retrieves local database historical memories as well.
        """
        local_memories = db.get_customer_memories(customer_id)

        # Filter local memories if query is provided
        matched_local = []
        q_lower = query.lower() if query else ""
        for m in local_memories:
            if not q_lower or (q_lower in m["topic"].lower() or q_lower in m["summary"].lower()):
                matched_local.append(m)
        if not matched_local and local_memories:
            matched_local = local_memories

        if not self.is_configured():
            return {
                "source": "local_database",
                "hindsight_connected": False,
                "status": "hindsight_key_not_configured",
                "message": "HINDSIGHT_API_KEY not configured. Retrieved verified historical memory from database store.",
                "memories": matched_local
            }

        # Real Hindsight API call
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "X-API-Key": self.api_key,
                "Content-Type": "application/json"
            }
            payload = {
                "customer_id": customer_id,
                "query": query,
                "top_k": 5
            }
            with httpx.Client(timeout=5.0) as client:
                resp = client.post(f"{self.base_url}/v1/memories/search", json=payload, headers=headers)
                if resp.status_code == 200:
                    api_data = resp.json()
                    remote_memories = api_data.get("memories", api_data.get("data", []))
                    combined = remote_memories + matched_local
                    return {
                        "source": "hindsight_api",
                        "hindsight_connected": True,
                        "status": "success",
                        "memories": combined
                    }
                else:
                    return {
                        "source": "local_fallback",
                        "hindsight_connected": False,
                        "status": f"hindsight_http_{resp.status_code}",
                        "message": f"Hindsight API call failed with status {resp.status_code}",
                        "memories": matched_local
                    }
        except Exception as e:
            return {
                "source": "local_fallback",
                "hindsight_connected": False,
                "status": "hindsight_network_error",
                "message": f"Hindsight API request error: {str(e)}",
                "memories": matched_local
            }

    def store_memory(
        self,
        customer_id: str,
        topic: str,
        summary: str,
        sentiment: str = "Neutral",
        source: str = "AI Support Chat"
    ) -> Dict[str, Any]:
        """
        Store a new memory item.
        Always records in local database, and attempts to forward to Hindsight API if configured.
        """
        # Always persist in local database
        db_mem = db.add_memory(
            customer_id=customer_id,
            topic=topic,
            summary=summary,
            sentiment=sentiment,
            source=source
        )

        if not self.is_configured():
            return {
                "stored_locally": True,
                "stored_hindsight": False,
                "status": "hindsight_not_configured",
                "memory": db_mem
            }

        # Real Hindsight API call
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "X-API-Key": self.api_key,
                "Content-Type": "application/json"
            }
            payload = {
                "customer_id": customer_id,
                "topic": topic,
                "content": summary,
                "metadata": {
                    "sentiment": sentiment,
                    "source": source
                }
            }
            with httpx.Client(timeout=5.0) as client:
                resp = client.post(f"{self.base_url}/v1/memories", json=payload, headers=headers)
                stored_hindsight = resp.status_code in [200, 201]
                return {
                    "stored_locally": True,
                    "stored_hindsight": stored_hindsight,
                    "status": "success" if stored_hindsight else f"hindsight_http_{resp.status_code}",
                    "memory": db_mem
                }
        except Exception as e:
            return {
                "stored_locally": True,
                "stored_hindsight": False,
                "status": f"hindsight_error: {str(e)}",
                "memory": db_mem
            }

hindsight_client = HindsightClient()
