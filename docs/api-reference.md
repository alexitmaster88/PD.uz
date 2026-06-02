# API Reference

## tRPC Endpoints

Base URL: `/api/trpc`  
Transport: HTTP batch POST with superjson transformer  
Client: `trpc` from `lib/trpc-client.ts` via `TelcProvider`

---

### `examLevels`

#### `examLevels.list`
- Type: Query
- Auth: Public
- Returns: `ExamLevel[]` — `{ id, level, price, createdAt, updatedAt }`

#### `examLevels.update`
- Type: Mutation
- Auth: Admin
- Input: `{ levelId: number, price: string }`
- Returns: Updated `ExamLevel`

---

### `exams`

#### `exams.list`
- Type: Query
- Auth: Public
- Returns: `Exam[]` with joined `exam_levels`

#### `exams.getByRegionAndLevel`
- Type: Query
- Auth: Public
- Input: `{ region: string, levelId: number }`
- Returns: `Exam[]` for that region/level with joined `exam_levels`

#### `exams.get`
- Type: Query
- Auth: Public
- Input: `{ examId: number }`
- Returns: Single `Exam` with joined `exam_levels`

#### `exams.create`
- Type: Mutation
- Auth: Admin
- Input: `{ levelId: number, region: string, address?: string, examDate: Date, startTime: string, endTime: string, capacity?: number }`
- Returns: Created exam `{ id }`

#### `exams.update`
- Type: Mutation
- Auth: Admin
- Input: `{ examId: number, data: Record<string, unknown> }`

#### `exams.delete`
- Type: Mutation
- Auth: Admin
- Input: `{ examId: number }`

---

### `registrations`

#### `registrations.listAll`
- Type: Query
- Auth: Admin
- Returns: `Registration[]` with joined exam and exam_level data

#### `registrations.getById`
- Type: Query
- Auth: Admin
- Input: `{ registrationId: number }`
- Returns: Single `Registration` with full joins

#### `registrations.create`
- Type: Mutation
- Auth: Public
- Input: `{ examId: number, firstName: string, lastName: string, phoneNumber: string, email: string, passportNumber: string }`
- Returns: `{ id: number }` — new registration ID
- Note: Registration created with `pending` status; unique constraint on `(passport_number, exam_id)`

#### `registrations.updateStatus`
- Type: Mutation
- Auth: Admin
- Input: `{ registrationId: number, status: "pending" | "verified" | "paid" | "completed" | "cancelled" }`

---

### `otp`

#### `otp.send`
- Type: Mutation
- Auth: Public
- Input: `{ email: string }`
- Returns: `{ success: boolean }`
- Side effect: Creates OTP record in `otp_verifications` (expires in 10 min). Currently logs to console — no real email delivery.

#### `otp.verify`
- Type: Mutation
- Auth: Public
- Input: `{ email: string, otp: string }`
- Returns: `{ success: boolean }`
- Note: Demo OTP `"123456"` always passes regardless of email.

---

### `payments`

#### `payments.create`
- Type: Mutation
- Auth: Public
- Input: `{ registrationId: number, amount: string, paymentMethod: string }`
- Returns: `{ id: number }`

#### `payments.getByRegistration`
- Type: Query
- Auth: Public
- Input: `{ registrationId: number }`
- Returns: `Payment | null`

---

## REST Endpoints

### `POST /api/paynet`

Paynet JSON-RPC 2.0 inbound billing endpoint. Paynet's servers call this — do not call it from the frontend.

**Auth:** HTTP Basic (`Authorization: Basic <base64(user:pass)>`)  
**IP restriction:** Production only accepts `213.230.106.112/28` and `213.230.65.80/28`  
**Content-Type:** `application/json`  
**Timezone:** All timestamps in GMT+5 (Asia/Tashkent), format `YYYY-MM-DD HH:MM:SS`

#### Request format (JSON-RPC 2.0)

```json
{
  "jsonrpc": "2.0",
  "method": "MethodName",
  "id": 1,
  "params": { ... }
}
```

#### Methods

**`GetInformation`**  
Look up a booking before charging.
```json
// params
{ "fields": { "client_id": "<booking_id>" } }

// result
{
  "status": 0,
  "timestamp": "2026-05-15 14:30:00",
  "fields": { "balance": 500000, "name": "John Doe" }
}
```

**`PerformTransaction`**  
Charge the user and confirm the booking (idempotent — duplicate `transactionId` → error 201).
```json
// params
{ "amount": 500000, "transactionId": 12345, "serviceId": 1, "fields": { "client_id": "<booking_id>" } }

// result
{
  "providerTrnId": 99,
  "timestamp": "2026-05-15 14:30:00",
  "fields": { "client_id": "<booking_id>" }
}
```

**`CheckTransaction`**  
Check transaction state: `1` = completed, `2` = cancelled, `3` = unknown.
```json
// params
{ "transactionId": 12345 }

// result
{ "providerTrnId": 99, "timestamp": "...", "transactionState": 1 }
```

**`CancelTransaction`**  
Cancel a transaction and revert booking to `pending_payment`.
```json
// params
{ "transactionId": 12345 }

// result
{ "providerTrnId": 99, "timestamp": "...", "transactionState": 2 }
```

**`GetStatement`**  
List all Paynet transactions within a date range.
```json
// params
{ "serviceId": 1, "dateFrom": "2026-05-01 00:00:00", "dateTo": "2026-05-31 23:59:59" }

// result
{
  "statements": [
    { "amount": 500000, "transactionId": 12345, "providerTrnId": 99, "timestamp": "..." }
  ]
}
```

**`ChangePassword`**  
Optional. Always returns `"success"` — password changes are handled out-of-band.

#### Error codes

| Code | Meaning |
|------|---------|
| 201 | Transaction already exists (idempotency) |
| 202 | Transaction already cancelled |
| 203 | Transaction not found |
| 302 | Client (booking) not found |
| 413 | Invalid amount |
| -32600 | Invalid JSON-RPC request |
| -32601 | Method not found |
| -32602 | Invalid params |
| -32603 | Internal error |
| -32700 | Parse error |
| -32300 | Non-POST request (GET returns this with HTTP 405) |

---

### `GET /api/paynet`

Returns HTTP 405 with:
```json
{ "jsonrpc": "2.0", "id": null, "error": { "code": -32300, "message": "Use POST" } }
```

---

### `POST /api/payme`

Payme (Paycom) Merchant API — JSON-RPC 2.0 inbound endpoint. Payme's servers call this when a user initiates or completes a payment via QR code or Payme app. Do not call this from the frontend.

**Auth:** HTTP Basic (`Authorization: Basic base64(MERCHANT_ID:PAYME_MERCHANT_KEY)`)  
**Content-Type:** `application/json`  
**Always returns HTTP 200** — Payme retries on non-200 responses  
**Sandbox:** Set `NEXT_PUBLIC_PAYME_ENV=test` — checkout form posts to `https://test.paycom.uz`  
**Production:** Checkout form posts to `https://checkout.paycom.uz`

#### Request format (JSON-RPC 2.0)

```json
{
  "jsonrpc": "2.0",
  "method": "MethodName",
  "id": 1,
  "params": { ... }
}
```

#### Methods

**`CheckPerformTransaction`**  
Payme asks whether it can charge this order. Called before creating a transaction.
```json
// params
{ "amount": 50000000, "account": { "order_id": "42" } }

// result (allow)
{ "allow": true, "additional": null }

// error (already paid)
{ "code": -31003, "message": { "ru": "...", "uz": "...", "en": "Order already paid" }, "data": "order_id" }
```

**`CreateTransaction`**  
Payme creates a transaction on their side. We store their `id` and return our internal payment record ID.
```json
// params
{ "id": "payme-txn-uuid", "time": 1748000000000, "amount": 50000000, "account": { "order_id": "42" } }

// result
{ "create_time": 1748000000000, "transaction": "99", "state": 1, "receivers": null }
```

**`PerformTransaction`**  
User completed payment. We mark the payment as `completed` and registration as `paid`.
```json
// params
{ "id": "payme-txn-uuid" }

// result
{ "perform_time": 1748000005000, "transaction": "99", "state": 2 }
```

**`CancelTransaction`**  
User cancelled or timed out. Reverts payment to `cancelled`, registration to `pending`.
```json
// params
{ "id": "payme-txn-uuid", "reason": 3 }

// result
{ "cancel_time": 1748000005000, "transaction": "99", "state": -1 }
```
Note: Cannot cancel a `completed` (state 2) transaction — returns error `-31007`.

**`CheckTransaction`**  
Payme reconciliation query. Returns current state and timestamps.
```json
// params
{ "id": "payme-txn-uuid" }

// result
{
  "create_time": 1748000000000,
  "perform_time": 1748000005000,
  "cancel_time": 0,
  "transaction": "99",
  "state": 2,
  "reason": null
}
```

#### Transaction states

| State | Meaning |
|-------|---------|
| `1` | Created / pending |
| `2` | Completed (payment done) |
| `-1` | Cancelled |

#### Error codes

| Code | Meaning |
|------|---------|
| -31001 | Order not found |
| -31003 | Wrong amount or order already paid |
| -31007 | Cannot cancel completed transaction |
| -31008 | Transaction already cancelled |
| -31009 | Transaction not found |
| -31099 | System error |
| -32504 | Auth failed (wrong merchant ID or key) |
| -32600 | Invalid JSON-RPC request |
| -32601 | Method not found |
| -32602 | Invalid params |
| -32700 | Parse error |
| -32300 | Non-POST request (GET returns HTTP 405) |

#### Cancellation reason codes

| Code | Meaning |
|------|---------|
| 1 | Receiver declined the order |
| 2 | Processing failed |
| 3 | Transaction timed out |
| 4 | Receiver rejected the order |
| 5 | Refund requested by receiver |
| 10 | Timed out during checkout |

---

### `GET /api/payme`

Returns HTTP 405 with:
```json
{ "jsonrpc": "2.0", "id": null, "error": { "code": -32300, "message": "Use POST" } }
```

---

### REST routes used by TELC frontend (legacy pattern)

These exist as Next.js API routes consumed directly by `StepExamSelection` via `fetch()`. New TELC components should use tRPC instead.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/telc/exam-levels` | GET | List all exam levels |
| `/api/telc/exams` | GET | `?region=&levelId=` — exams by region + level |
| `/api/telc/registrations` | POST | Create registration (mirrors `registrations.create` tRPC) |
