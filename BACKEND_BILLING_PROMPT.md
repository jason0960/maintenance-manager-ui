# Backend Billing Feature — Prompt for Claude

Use this prompt in your backend project (Spring Boot / Java) to have Claude Opus 4.6 implement the server-side billing/invoicing feature that matches the frontend already built.

---

## Prompt

```
I need you to implement a complete Billing / Invoicing feature in my Spring Boot REST API. The frontend is already built and expects the following contract. Please create everything needed: entity classes, repository, service, controller, DTO request/response classes, and any DB migration scripts.

## API Endpoints Required

All endpoints are under `/api/invoices` and require JWT authentication (Bearer token). The existing auth/security setup should be reused.

### GET /api/invoices
- Returns `List<InvoiceResponse>` for the authenticated user's company
- ADMIN sees all invoices in their company
- PROPERTY_MANAGER sees invoices for properties they manage
- TECH role should NOT have access (return 403)

### GET /api/invoices/{id}
- Returns a single `InvoiceResponse` with full line item details
- Same role-based visibility rules as the list endpoint

### POST /api/invoices
- Creates a new invoice from an `InvoiceRequest` body
- Only ADMIN and PROPERTY_MANAGER can create invoices
- Auto-generates an invoice number (e.g., "INV-2026-00001")
- Server calculates subtotal, taxAmount, and total from line items + taxRate
- Initial status should be DRAFT

### PATCH /api/invoices/{id}
- Accepts an `InvoiceUpdateRequest` body
- Only ADMIN and PROPERTY_MANAGER can update
- Can update: status, notes, dueDate, taxRate, lineItems
- When status changes to PAID, set paidAt = now
- When lineItems are provided, replace all existing line items and recalculate totals

### DELETE /api/invoices/{id}
- Only ADMIN can delete
- Only invoices in DRAFT status can be deleted

## Data Models

### Invoice entity
| Column          | Type          | Notes                                        |
|-----------------|---------------|----------------------------------------------|
| id              | Long (PK)     | Auto-generated                               |
| invoice_number  | String        | Unique, auto-generated (e.g., "INV-2026-00001") |
| work_order_id   | Long (FK)     | References WorkOrder                         |
| company_id      | Long (FK)     | References Company (from work order's property) |
| created_by_id   | Long (FK)     | References User (authenticated user)         |
| status          | Enum          | DRAFT, SENT, PAID, OVERDUE, CANCELLED        |
| subtotal        | Long          | In cents (sum of line item totals)           |
| tax_rate        | BigDecimal    | Percentage (e.g., 8.25)                      |
| tax_amount      | Long          | In cents (subtotal * taxRate / 100, rounded) |
| total           | Long          | In cents (subtotal + taxAmount)              |
| notes           | String        | Nullable                                     |
| due_date        | LocalDate     |                                              |
| paid_at         | LocalDateTime | Nullable, set when status → PAID             |
| created_at      | LocalDateTime | Auto-set                                     |
| updated_at      | LocalDateTime | Auto-set                                     |

### InvoiceLineItem entity
| Column      | Type      | Notes                           |
|-------------|-----------|----------------------------------|
| id          | Long (PK) | Auto-generated                   |
| invoice_id  | Long (FK) | References Invoice, cascade delete |
| description | String    | Not blank                        |
| quantity    | Integer   | Min 1                            |
| unit_price  | Long      | In cents                         |
| total       | Long      | In cents (quantity * unitPrice)  |

### InvoiceStatus enum
```java
public enum InvoiceStatus {
    DRAFT, SENT, PAID, OVERDUE, CANCELLED
}
```

## DTO Classes

### InvoiceResponse (returned by all endpoints)
```json
{
  "id": 1,
  "invoiceNumber": "INV-2026-00001",
  "workOrderId": 5,
  "workOrderTitle": "Fix leaking faucet",
  "propertyId": 2,
  "propertyName": "Sunset Apartments",
  "unitNumber": "101",
  "companyId": 1,
  "companyName": "S&E Texas Services",
  "createdById": 3,
  "createdByName": "John Doe",
  "status": "DRAFT",
  "subtotal": 15000,
  "taxRate": 8.25,
  "taxAmount": 1238,
  "total": 16238,
  "notes": null,
  "dueDate": "2026-03-18",
  "paidAt": null,
  "lineItems": [
    {
      "id": 1,
      "invoiceId": 1,
      "description": "Labor - 2 hours",
      "quantity": 2,
      "unitPrice": 5000,
      "total": 10000
    },
    {
      "id": 2,
      "invoiceId": 1,
      "description": "Replacement faucet",
      "quantity": 1,
      "unitPrice": 5000,
      "total": 5000
    }
  ],
  "createdAt": "2026-02-16T10:30:00",
  "updatedAt": "2026-02-16T10:30:00"
}
```

### InvoiceRequest (POST body)
```json
{
  "workOrderId": 5,
  "lineItems": [
    { "description": "Labor - 2 hours", "quantity": 2, "unitPrice": 5000 },
    { "description": "Replacement faucet", "quantity": 1, "unitPrice": 5000 }
  ],
  "taxRate": 8.25,
  "notes": "Net 30",
  "dueDate": "2026-03-18"
}
```

### InvoiceUpdateRequest (PATCH body — all fields optional)
```json
{
  "status": "SENT",
  "notes": "Updated notes",
  "dueDate": "2026-04-01",
  "taxRate": 8.25,
  "lineItems": [
    { "description": "Updated labor", "quantity": 3, "unitPrice": 5000 }
  ]
}
```

## Business Rules
1. All money values are in CENTS (Long) to avoid floating-point issues
2. taxRate is a percentage stored as BigDecimal (e.g., 8.25 means 8.25%)
3. Server always recalculates subtotal/taxAmount/total — never trust client
4. Invoice number format: "INV-{YEAR}-{ZERO_PADDED_SEQUENCE}" (e.g., INV-2026-00001)
5. An invoice can only be created for a work order that has status COMPLETED
6. When status transitions to PAID, automatically set paidAt timestamp
7. Only DRAFT invoices can be deleted
8. Validation: line items must have non-blank description, quantity >= 1, unitPrice >= 0

## Existing Patterns to Follow
- Use the same patterns as the existing WorkOrder entity/service/controller
- Use @PreAuthorize or manual role checks consistent with existing security setup
- Return proper error responses matching the existing ErrorResponse format:
  ```json
  { "status": 400, "message": "...", "timestamp": "...", "errors": {} }
  ```
- Use the existing Company, User, WorkOrder, and Property entities for relationships
- Follow the same package structure (entity, repository, service, controller, dto)
```
