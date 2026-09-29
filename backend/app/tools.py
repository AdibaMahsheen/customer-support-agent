"""
Agent Tools Definition & Execution Engine.
Implements the 6 tools specified for the Customer Support AI Agent:
1. search_customer_memory
2. get_customer_profile
3. get_transactions
4. get_support_tickets
5. create_support_ticket
6. escalate_to_human
"""

import json
from typing import Dict, Any, List
from app.database import db
from app.hindsight_client import hindsight_client

# -------------------------------------------------------------
# Tool Execution Functions
# -------------------------------------------------------------

def tool_search_customer_memory(customer_id: str, query: str = "") -> Dict[str, Any]:
    """Search Hindsight and customer memory for historical conversations, past issues, and preferences."""
    result = hindsight_client.search_memories(customer_id=customer_id, query=query)
    return {
        "tool": "search_customer_memory",
        "customer_id": customer_id,
        "query": query,
        "hindsight_connected": result.get("hindsight_connected", False),
        "source": result.get("source"),
        "memories": result.get("memories", [])
    }

def tool_get_customer_profile(customer_id: str) -> Dict[str, Any]:
    """Retrieve full customer profile details including tier, contact, and account history."""
    customer = db.get_customer_by_id(customer_id)
    if not customer:
        return {"tool": "get_customer_profile", "error": f"Customer ID {customer_id} not found"}
    return {
        "tool": "get_customer_profile",
        "customer": customer
    }

def tool_get_transactions(customer_id: str) -> Dict[str, Any]:
    """Retrieve customer's recent orders, transaction history, payments, refunds, and bank status."""
    transactions = db.get_customer_transactions(customer_id)
    orders = db.get_customer_orders(customer_id)
    return {
        "tool": "get_transactions",
        "customer_id": customer_id,
        "transactions": transactions,
        "orders": orders
    }

def tool_get_support_tickets(customer_id: str) -> Dict[str, Any]:
    """Retrieve all current and historical support tickets for the customer."""
    tickets = db.get_customer_tickets(customer_id)
    return {
        "tool": "get_support_tickets",
        "customer_id": customer_id,
        "tickets": tickets
    }

def tool_create_support_ticket(
    customer_id: str,
    issue_type: str,
    subject: str,
    description: str,
    priority: str = "Medium"
) -> Dict[str, Any]:
    """Create a new official support ticket for the customer."""
    new_ticket = db.create_ticket(
        customer_id=customer_id,
        issue_type=issue_type,
        subject=subject,
        description=description,
        priority=priority
    )
    return {
        "tool": "create_support_ticket",
        "ticket": new_ticket,
        "message": f"Support Ticket {new_ticket['id']} created successfully."
    }

def tool_escalate_to_human(customer_id: str, reason: str, urgency: str = "High") -> Dict[str, Any]:
    """Escalate customer issue to a senior human support specialist."""
    escalation = db.create_escalation(
        customer_id=customer_id,
        reason=reason,
        urgency=urgency
    )
    return {
        "tool": "escalate_to_human",
        "escalation": escalation,
        "message": f"Issue escalated to Human Agent with priority {urgency}. Reference: {escalation['id']}."
    }

# -------------------------------------------------------------
# Tool Execution Registry
# -------------------------------------------------------------

TOOL_FUNCTIONS = {
    "search_customer_memory": tool_search_customer_memory,
    "get_customer_profile": tool_get_customer_profile,
    "get_transactions": tool_get_transactions,
    "get_support_tickets": tool_get_support_tickets,
    "create_support_ticket": tool_create_support_ticket,
    "escalate_to_human": tool_escalate_to_human,
}

def execute_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Safely dispatch tool call to registered function"""
    if tool_name not in TOOL_FUNCTIONS:
        return {"error": f"Unknown tool: {tool_name}"}
    try:
        fn = TOOL_FUNCTIONS[tool_name]
        return fn(**arguments)
    except Exception as e:
        return {"error": f"Error executing {tool_name}: {str(e)}"}

# -------------------------------------------------------------
# OpenAI Function / Tool Schemas
# -------------------------------------------------------------

OPENAI_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_customer_memory",
            "description": "Searches long-term customer memory in Hindsight and database for prior conversations, previous inquiries, and preferences.",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_id": {
                        "type": "string",
                        "description": "The customer ID, e.g. CUST1001"
                    },
                    "query": {
                        "type": "string",
                        "description": "Specific keywords or topic to search for, e.g., 'refund', 'order', 'complaint'"
                    }
                },
                "required": ["customer_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_customer_profile",
            "description": "Fetches verified customer account details, membership tier, contact details, and lifetime spending.",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_id": {
                        "type": "string",
                        "description": "The customer ID, e.g. CUST1001"
                    }
                },
                "required": ["customer_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_transactions",
            "description": "Retrieves the customer's orders, transactions, payment methods, refund statuses, and bank tracking references.",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_id": {
                        "type": "string",
                        "description": "The customer ID, e.g. CUST1001"
                    }
                },
                "required": ["customer_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_support_tickets",
            "description": "Retrieves open and historical support tickets for the customer, with resolution notes and status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_id": {
                        "type": "string",
                        "description": "The customer ID, e.g. CUST1001"
                    }
                },
                "required": ["customer_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_support_ticket",
            "description": "Creates an official support ticket when an issue requires ongoing investigation or operational tracking.",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_id": {
                        "type": "string",
                        "description": "The customer ID"
                    },
                    "issue_type": {
                        "type": "string",
                        "description": "Type of issue, e.g., 'Refund', 'Billing', 'Delivery', 'Account Security'"
                    },
                    "subject": {
                        "type": "string",
                        "description": "Concise summary of the issue"
                    },
                    "description": {
                        "type": "string",
                        "description": "Detailed explanation of the issue and context"
                    },
                    "priority": {
                        "type": "string",
                        "enum": ["Low", "Medium", "High", "Critical"],
                        "description": "Urgency level"
                    }
                },
                "required": ["customer_id", "issue_type", "subject", "description"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "escalate_to_human",
            "description": "Escalates the issue to a human support agent when the user is frustrated, requests human assistance, or reports account security breaches.",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_id": {
                        "type": "string",
                        "description": "The customer ID"
                    },
                    "reason": {
                        "type": "string",
                        "description": "Reason for human escalation"
                    },
                    "urgency": {
                        "type": "string",
                        "enum": ["Normal", "High", "Critical"],
                        "description": "Urgency level of the escalation"
                    }
                },
                "required": ["customer_id", "reason"]
            }
        }
    }
]
