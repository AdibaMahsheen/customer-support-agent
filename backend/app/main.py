"""
FastAPI Server for Customer Support AI Agent.
Hack With Hyderabad 3.0.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Dict, Any

from app.config import settings
from app.database import db
from app.hindsight_client import hindsight_client
from app.agent import agent
from app.models import (
    LoginRequest, LoginResponse,
    ChatRequest, ChatResponse,
    TicketCreateRequest, EscalateRequest,
    ConfigUpdateRequest, HealthResponse
)

app = FastAPI(
    title="Customer Support AI Agent API",
    description="Agentic Customer Support Backend with Hindsight Memory and OpenAI Tool Calling",
    version="1.0.0"
)

# Enable CORS for frontend web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Authentication
# -------------------------------------------------------------

@app.post("/api/login", response_model=LoginResponse)
def login(req: LoginRequest):
    # Modern SaaS Demo authentication
    if not req.email or "@" not in req.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid email address is required"
        )
    
    return LoginResponse(
        success=True,
        token="demo_jwt_token_agentic_customer_support_hwh3",
        user={
            "name": "Support Lead",
            "email": req.email,
            "role": "Agent Operations Admin",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
        },
        message="Login successful"
    )

# -------------------------------------------------------------
# Real AI Support Chat
# -------------------------------------------------------------

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chat message cannot be empty"
        )

    # Convert Pydantic history objects to dicts
    history_dicts = [h.dict() for h in req.history] if req.history else []

    # Run agent execution flow
    result = agent.run(
        customer_id=req.customer_id,
        message=req.message.strip(),
        history=history_dicts
    )

    return ChatResponse(**result)

# -------------------------------------------------------------
# Customer Data Endpoints
# -------------------------------------------------------------

@app.get("/api/customers", response_model=List[Dict[str, Any]])
def get_customers():
    return db.get_customers()

@app.get("/api/customers/{customer_id}", response_model=Dict[str, Any])
def get_customer(customer_id: str):
    cust = db.get_customer_by_id(customer_id)
    if not cust:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID '{customer_id}' not found"
        )
    return cust

@app.get("/api/customers/{customer_id}/transactions", response_model=List[Dict[str, Any]])
def get_customer_transactions(customer_id: str):
    return db.get_customer_transactions(customer_id)

@app.get("/api/customers/{customer_id}/tickets", response_model=List[Dict[str, Any]])
def get_customer_tickets(customer_id: str):
    return db.get_customer_tickets(customer_id)

@app.get("/api/customers/{customer_id}/memories", response_model=List[Dict[str, Any]])
def get_customer_memories(customer_id: str):
    # Query Hindsight memory
    res = hindsight_client.search_memories(customer_id=customer_id)
    return res.get("memories", [])

# -------------------------------------------------------------
# Support Tickets & Escalation Endpoints
# -------------------------------------------------------------

@app.post("/api/tickets", response_model=Dict[str, Any])
def create_ticket_endpoint(req: TicketCreateRequest):
    ticket = db.create_ticket(
        customer_id=req.customer_id,
        issue_type=req.issue_type,
        subject=req.subject,
        description=req.description,
        priority=req.priority or "Medium"
    )
    return {"success": True, "ticket": ticket}

@app.post("/api/escalate", response_model=Dict[str, Any])
def escalate_endpoint(req: EscalateRequest):
    escalation = db.create_escalation(
        customer_id=req.customer_id,
        reason=req.reason,
        urgency=req.urgency or "High"
    )
    return {"success": True, "escalation": escalation}

# -------------------------------------------------------------
# Dashboard Statistics & Health
# -------------------------------------------------------------

@app.get("/api/stats", response_model=Dict[str, Any])
def get_dashboard_stats():
    return db.get_dashboard_stats()

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    openai_key = settings.openai_api_key
    has_openai = bool(openai_key and len(openai_key) > 8 and not openai_key.startswith("sk-placeholder"))
    
    hindsight_status = hindsight_client.test_connection() if hindsight_client.is_configured() else {"connected": False}

    return HealthResponse(
        status="healthy",
        openai_connected=has_openai,
        hindsight_connected=hindsight_status.get("connected", False),
        hindsight_base_url=settings.hindsight_base_url,
        database_records={
            "customers": len(db.customers),
            "orders": len(db.orders),
            "transactions": len(db.transactions),
            "tickets": len(db.tickets),
            "memories": len(db.memories),
            "escalations": len(db.escalations)
        },
        timestamp=datetime.now().isoformat()
    )

# -------------------------------------------------------------
# Configuration & Settings Management
# -------------------------------------------------------------

@app.get("/api/config")
def get_config_status():
    openai_key = settings.openai_api_key
    h_key = settings.hindsight_api_key

    # Mask keys for security
    masked_openai = f"{openai_key[:6]}...{openai_key[-4:]}" if len(openai_key) > 10 else ("Configured" if openai_key else "Not Configured")
    masked_hindsight = f"{h_key[:6]}...{h_key[-4:]}" if len(h_key) > 10 else ("Configured" if h_key else "Not Configured")

    return {
        "openai_configured": bool(openai_key),
        "openai_key_preview": masked_openai,
        "openai_model": settings.openai_model,
        "hindsight_configured": bool(h_key),
        "hindsight_key_preview": masked_hindsight,
        "hindsight_base_url": settings.hindsight_base_url
    }

@app.post("/api/config")
def update_config(req: ConfigUpdateRequest):
    settings.update_keys(
        openai_api_key=req.openai_api_key,
        hindsight_api_key=req.hindsight_api_key,
        hindsight_base_url=req.hindsight_base_url
    )
    return {"success": True, "message": "API keys updated and saved to backend/.env successfully."}
