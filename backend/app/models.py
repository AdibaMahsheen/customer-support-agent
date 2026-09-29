from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class LoginResponse(BaseModel):
    success: bool
    token: str
    user: Dict[str, Any]
    message: str

class ChatMessage(BaseModel):
    role: str # "user" or "assistant" or "system"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message content")
    customer_id: str = Field("CUST1001", description="Identifier of the customer chatting")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Recent conversation turns")

class ChatResponse(BaseModel):
    response: str
    customer_id: str
    customer_name: str
    sentiment: str # Positive / Neutral / Frustrated
    context_used: List[str] # ["Hindsight Memory", "Previous Conversation", "Customer Profile", "Transaction History"]
    quick_actions: List[str]
    tools_executed: List[str]
    ticket_created: Optional[Dict[str, Any]] = None
    escalated: bool = False
    openai_connected: bool
    hindsight_connected: bool
    hindsight_memory_stored: bool = False
    warning: Optional[str] = None

class TicketCreateRequest(BaseModel):
    customer_id: str
    issue_type: str
    subject: str
    description: str
    priority: Optional[str] = "Medium"

class EscalateRequest(BaseModel):
    customer_id: str
    reason: str
    urgency: Optional[str] = "High"

class ConfigUpdateRequest(BaseModel):
    openai_api_key: Optional[str] = None
    hindsight_api_key: Optional[str] = None
    hindsight_base_url: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    openai_connected: bool
    hindsight_connected: bool
    hindsight_base_url: str
    database_records: Dict[str, int]
    timestamp: str
