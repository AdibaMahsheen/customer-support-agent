"""
Realistic Demo Data for Customer Support AI Agent
Includes customers, orders, transactions, support tickets, and memories.
"""

CUSTOMERS = [
    {
        "id": "CUST1001",
        "name": "Aisha Khan",
        "email": "aisha.khan@example.com",
        "phone": "+91 98765 43210",
        "tier": "Gold Member",
        "join_date": "2023-04-12",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "address": "402, Lotus Enclave, Banjara Hills, Hyderabad, Telangana 500034",
        "lifetime_spend": 28450,
        "satisfaction_rating": 4.8
    },
    {
        "id": "CUST1002",
        "name": "Vikram Malhotra",
        "email": "vikram.m@example.com",
        "phone": "+91 98112 34567",
        "tier": "Platinum Member",
        "join_date": "2022-08-19",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "address": "Flat 12B, Skyline Towers, Hitec City, Hyderabad, Telangana 500081",
        "lifetime_spend": 64200,
        "satisfaction_rating": 4.9
    },
    {
        "id": "CUST1003",
        "name": "Sneha Patel",
        "email": "sneha.patel@example.com",
        "phone": "+91 97234 56789",
        "tier": "Silver Member",
        "join_date": "2024-01-10",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "address": "78, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103",
        "lifetime_spend": 14990,
        "satisfaction_rating": 4.2
    },
    {
        "id": "CUST1004",
        "name": "Rahul Verma",
        "email": "rahul.verma@example.com",
        "phone": "+91 99887 76655",
        "tier": "Standard Member",
        "join_date": "2024-05-02",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "address": "A-304, Cyber Heights, Gachibowli, Hyderabad, Telangana 500032",
        "lifetime_spend": 8200,
        "satisfaction_rating": 3.9
    }
]

TRANSACTIONS = [
    # Aisha Khan (CUST1001) transactions
    {
        "id": "TXN-5541",
        "customer_id": "CUST1001",
        "order_id": "ORD1024",
        "amount": 1299.0,
        "currency": "INR",
        "type": "Debit",
        "status": "Completed",
        "date": "2026-09-20 14:22:10",
        "payment_method": "UPI (Google Pay - aisha@okaxis)",
        "description": "Purchase of Wireless Earbuds Pro (Active Noise Cancellation)"
    },
    {
        "id": "TXN-5542",
        "customer_id": "CUST1001",
        "order_id": "ORD1024",
        "amount": 1299.0,
        "currency": "INR",
        "type": "Credit Refund",
        "status": "Pending Banking Processing",
        "date": "2026-09-26 11:15:00",
        "payment_method": "UPI Reversal to aisha@okaxis",
        "description": "Refund initiated for return of ORD1024 (Earbuds sound issue). Approved on Sept 26. Bank reference ARN: 42998810231. Processing SLA: 5 to 7 business days."
    },
    {
        "id": "TXN-5120",
        "customer_id": "CUST1001",
        "order_id": "ORD1019",
        "amount": 2499.0,
        "currency": "INR",
        "type": "Debit",
        "status": "Completed",
        "date": "2026-08-15 09:40:15",
        "payment_method": "HDFC Credit Card ending 8812",
        "description": "Purchase of Ergonomic Office Chair Mat & Desk Lamp"
    },

    # Vikram Malhotra (CUST1002) transactions
    {
        "id": "TXN-6101",
        "customer_id": "CUST1002",
        "order_id": "ORD1088",
        "amount": 4999.0,
        "currency": "INR",
        "type": "Debit",
        "status": "Completed",
        "date": "2026-09-27 16:05:42",
        "payment_method": "ICICI Net Banking",
        "description": "Purchase of Smartwatch Series 5 (Midnight Black, GPS)"
    },
    {
        "id": "TXN-5890",
        "customer_id": "CUST1002",
        "order_id": "ORD1045",
        "amount": 899.0,
        "currency": "INR",
        "type": "Debit",
        "status": "Completed",
        "date": "2026-07-22 18:30:00",
        "payment_method": "ICICI Net Banking",
        "description": "Purchase of Braided Fast-Charging Cable 2M"
    },

    # Sneha Patel (CUST1003) transactions - Double Charge Scenario
    {
        "id": "TXN-6601",
        "customer_id": "CUST1003",
        "order_id": "ORD1099",
        "amount": 3499.0,
        "currency": "INR",
        "type": "Debit",
        "status": "Completed",
        "date": "2026-09-28 10:14:02",
        "payment_method": "SBI Credit Card ending 3309",
        "description": "Order ORD1099: Mechanical Keyboard RGB (Brown Switches)"
    },
    {
        "id": "TXN-6602",
        "customer_id": "CUST1003",
        "order_id": "ORD1099",
        "amount": 3499.0,
        "currency": "INR",
        "type": "Debit (Duplicate)",
        "status": "Flagged Duplicate - Auto Reversal Pending",
        "date": "2026-09-28 10:14:05",
        "payment_method": "SBI Credit Card ending 3309",
        "description": "Duplicate gateway transaction capture for ORD1099. Automatic reversal request submitted to payment gateway on Sept 28."
    },

    # Rahul Verma (CUST1004) transactions
    {
        "id": "TXN-7001",
        "customer_id": "CUST1004",
        "order_id": "ORD1105",
        "amount": 5499.0,
        "currency": "INR",
        "type": "Debit",
        "status": "Flagged Suspicious",
        "date": "2026-09-29 02:18:22",
        "payment_method": "Axis Bank Debit Card",
        "description": "Suspicious late-night purchase of Gaming Headset Pro from unrecognized IP (185.220.101.4). Account lock pending customer confirmation."
    }
]

ORDERS = [
    {
        "id": "ORD1024",
        "customer_id": "CUST1001",
        "item_name": "Wireless Earbuds Pro (Active Noise Cancellation)",
        "amount": 1299.0,
        "status": "Refund Pending",
        "order_date": "2026-09-20",
        "return_date": "2026-09-24",
        "refund_initiated_date": "2026-09-26",
        "expected_refund_date": "2026-10-03",
        "tracking_number": "RET-DEL-99102",
        "carrier": "Delhivery Express",
        "details": "Returned item received at warehouse on Sept 25. Quality inspection passed on Sept 26. Refund of INR 1,299 approved and sent to bank via UPI reference ARN 42998810231. Typical bank clearance takes 5 to 7 working days."
    },
    {
        "id": "ORD1019",
        "customer_id": "CUST1001",
        "item_name": "Ergonomic Office Chair Mat & Desk Lamp",
        "amount": 2499.0,
        "status": "Delivered",
        "order_date": "2026-08-15",
        "delivery_date": "2026-08-18",
        "tracking_number": "BD-8812301",
        "carrier": "BlueDart",
        "details": "Delivered in good condition to Aisha Khan."
    },
    {
        "id": "ORD1088",
        "customer_id": "CUST1002",
        "item_name": "Smartwatch Series 5 (Midnight Black, GPS)",
        "amount": 4999.0,
        "status": "In Transit",
        "order_date": "2026-09-27",
        "estimated_delivery": "Today by 7:00 PM (2026-09-29)",
        "tracking_number": "BD992144",
        "carrier": "BlueDart Express",
        "details": "Out for delivery with courier agent Ramesh Kumar (Ph: +91 98480 11223). OTP required at delivery."
    },
    {
        "id": "ORD1099",
        "customer_id": "CUST1003",
        "item_name": "Mechanical Keyboard RGB (Brown Switches)",
        "amount": 3499.0,
        "status": "Delivered",
        "order_date": "2026-09-28",
        "delivery_date": "2026-09-29",
        "tracking_number": "EXP-772109",
        "carrier": "XpressBees",
        "details": "Delivered today. Duplicate payment incident flagged for TXN-6602."
    },
    {
        "id": "ORD1105",
        "customer_id": "CUST1004",
        "item_name": "Gaming Headset Pro",
        "amount": 5499.0,
        "status": "On Hold - Security Review",
        "order_date": "2026-09-29",
        "tracking_number": "HOLD-SEC-01",
        "carrier": "Internal Fraud Desk",
        "details": "Placed from unfamiliar IP at 2:18 AM. Order withheld until customer validates identity."
    }
]

SUPPORT_TICKETS = [
    {
        "id": "TIK-8041",
        "customer_id": "CUST1001",
        "issue_type": "Refund",
        "subject": "Inquiry regarding refund for returned Wireless Earbuds (ORD1024)",
        "status": "In Progress",
        "priority": "Medium",
        "created_at": "2026-09-26 11:30:00",
        "updated_at": "2026-09-28 15:45:00",
        "description": "Customer Aisha Khan contacted support to ask when the INR 1,299 refund will reflect in her bank account after returning ORD1024.",
        "resolution_notes": "Support verified ARN 42998810231 was dispatched to beneficiary bank on Sept 26. Customer was informed standard bank settlement window is 5-7 business days (expected by Oct 3)."
    },
    {
        "id": "TIK-7910",
        "customer_id": "CUST1001",
        "issue_type": "Delivery",
        "subject": "Delivery address modification for ORD1019",
        "status": "Resolved",
        "priority": "Low",
        "created_at": "2026-08-15 11:00:00",
        "updated_at": "2026-08-16 10:00:00",
        "description": "Customer requested updating flat number from 401 to 402.",
        "resolution_notes": "Address updated before package dispatch. Item successfully delivered."
    },
    {
        "id": "TIK-8102",
        "customer_id": "CUST1002",
        "issue_type": "Tracking",
        "subject": "Shipment tracking inquiry for ORD1088",
        "status": "Open",
        "priority": "Normal",
        "created_at": "2026-09-28 19:10:00",
        "updated_at": "2026-09-29 08:30:00",
        "description": "Vikram asked about estimated delivery time for Smartwatch.",
        "resolution_notes": "BlueDart tracking BD992144 indicates out for delivery today."
    },
    {
        "id": "TIK-8115",
        "customer_id": "CUST1003",
        "issue_type": "Billing",
        "subject": "Duplicate deduction reported for ORD1099",
        "status": "Open",
        "priority": "High",
        "created_at": "2026-09-28 14:20:00",
        "updated_at": "2026-09-28 16:00:00",
        "description": "Customer Sneha Patel reported SBI card was charged twice (₹3,499 x 2).",
        "resolution_notes": "Payment gateway escalation opened with reference GW-DUP-9912. Reversal expected in 48 hours."
    }
]

# Initial memories simulating previous interactions (synced to Hindsight memory)
INITIAL_MEMORIES = [
    {
        "id": "MEM-101",
        "customer_id": "CUST1001",
        "topic": "Refund Inquiry for ORD1024",
        "summary": "Customer Aisha Khan returned Wireless Earbuds Pro (ORD1024) due to low audio volume. Refund of INR 1,299 was initiated on September 26, 2026 via UPI (aisha@okaxis) with ARN 42998810231. Customer was notified that bank processing takes 5 to 7 business days, so funds should arrive by October 2-3.",
        "sentiment": "Neutral/Patient",
        "source": "Support Ticket TIK-8041",
        "created_at": "2026-09-26 11:35:00"
    },
    {
        "id": "MEM-102",
        "customer_id": "CUST1001",
        "topic": "Customer Profile & Preferences",
        "summary": "Gold Member customer since April 2023. Prefers instant UPI refunds over store credits. High satisfaction rating history. Always communicates politely.",
        "sentiment": "Positive",
        "source": "Account Profile",
        "created_at": "2026-08-16 10:15:00"
    },
    {
        "id": "MEM-201",
        "customer_id": "CUST1002",
        "topic": "Delivery Coordination for ORD1088",
        "summary": "Customer Vikram requested evening delivery window (post 5 PM) for high-value Smartwatch ORD1088 because of office hours.",
        "sentiment": "Positive",
        "source": "Chat Interaction",
        "created_at": "2026-09-28 19:15:00"
    },
    {
        "id": "MEM-301",
        "customer_id": "CUST1003",
        "topic": "Billing Double Charge Issue",
        "summary": "Customer Sneha Patel experienced a duplicate charge on SBI card for Mechanical Keyboard ORD1099. Notified that gateway reversal is scheduled within 48 business hours.",
        "sentiment": "Frustrated",
        "source": "Support Ticket TIK-8115",
        "created_at": "2026-09-28 14:30:00"
    }
]
