"""
In-memory and persistent storage for Customer Support AI Agent.
Pre-populated with realistic demo data.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

from app.data.demo_data import CUSTOMERS, TRANSACTIONS, ORDERS, SUPPORT_TICKETS, INITIAL_MEMORIES

class Database:
    def __init__(self):
        # Deep copy datasets so modifications don't mutate module originals
        self.customers: List[Dict[str, Any]] = [dict(c) for c in CUSTOMERS]
        self.transactions: List[Dict[str, Any]] = [dict(t) for t in TRANSACTIONS]
        self.orders: List[Dict[str, Any]] = [dict(o) for o in ORDERS]
        self.tickets: List[Dict[str, Any]] = [dict(tk) for tk in SUPPORT_TICKETS]
        self.memories: List[Dict[str, Any]] = [dict(m) for m in INITIAL_MEMORIES]
        self.escalations: List[Dict[str, Any]] = []
        self.conversations: Dict[str, List[Dict[str, Any]]] = {}

    def get_customers(self) -> List[Dict[str, Any]]:
        return self.customers

    def get_customer_by_id(self, customer_id: str) -> Optional[Dict[str, Any]]:
        for c in self.customers:
            if c["id"].lower() == customer_id.lower():
                return c
        return None

    def get_customer_orders(self, customer_id: str) -> List[Dict[str, Any]]:
        return [o for o in self.orders if o["customer_id"].lower() == customer_id.lower()]

    def get_customer_transactions(self, customer_id: str) -> List[Dict[str, Any]]:
        return [t for t in self.transactions if t["customer_id"].lower() == customer_id.lower()]

    def get_customer_tickets(self, customer_id: str) -> List[Dict[str, Any]]:
        return [tk for tk in self.tickets if tk["customer_id"].lower() == customer_id.lower()]

    def get_customer_memories(self, customer_id: str) -> List[Dict[str, Any]]:
        return [m for m in self.memories if m["customer_id"].lower() == customer_id.lower()]

    def create_ticket(
        self,
        customer_id: str,
        issue_type: str,
        subject: str,
        description: str,
        priority: str = "Medium"
    ) -> Dict[str, Any]:
        ticket_id = f"TIK-{len(self.tickets) + 8042}"
        new_ticket = {
            "id": ticket_id,
            "customer_id": customer_id,
            "issue_type": issue_type,
            "subject": subject,
            "status": "Open",
            "priority": priority,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "description": description,
            "resolution_notes": "Ticket automatically created by Customer Support AI Agent."
        }
        self.tickets.insert(0, new_ticket)
        return new_ticket

    def create_escalation(
        self,
        customer_id: str,
        reason: str,
        urgency: str = "High",
        conversation_summary: str = ""
    ) -> Dict[str, Any]:
        esc_id = f"ESC-{len(self.escalations) + 101}"
        escalation = {
            "id": esc_id,
            "customer_id": customer_id,
            "reason": reason,
            "urgency": urgency,
            "status": "Escalated to Human Agent",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "summary": conversation_summary
        }
        self.escalations.insert(0, escalation)
        return escalation

    def add_memory(
        self,
        customer_id: str,
        topic: str,
        summary: str,
        sentiment: str = "Neutral",
        source: str = "AI Support Chat"
    ) -> Dict[str, Any]:
        memory_id = f"MEM-{len(self.memories) + 101}"
        new_memory = {
            "id": memory_id,
            "customer_id": customer_id,
            "topic": topic,
            "summary": summary,
            "sentiment": sentiment,
            "source": source,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.memories.insert(0, new_memory)
        return new_memory

    def get_dashboard_stats(self) -> Dict[str, Any]:
        total_customers = len(self.customers)
        active_conversations = max(1, len([c for c in self.customers if self.get_customer_tickets(c["id"])]))
        resolved_tickets = len([tk for tk in self.tickets if tk["status"].lower() == "resolved"])
        pending_tickets = len([tk for tk in self.tickets if tk["status"].lower() in ["open", "in progress"]])
        total_escalations = len(self.escalations)

        return {
            "total_customers": total_customers,
            "active_conversations": active_conversations,
            "resolved_tickets": resolved_tickets,
            "pending_tickets": pending_tickets,
            "escalations": total_escalations
        }

db = Database()
