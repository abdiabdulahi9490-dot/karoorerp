MODERN ERP — NODE.JS + EXPRESS + MYSQL + PLESK

> Use this prompt as the final master specification.



Build a complete, modern, professional and production-ready ERP Web Application using:

Node.js 20+

Express.js

MySQL 8+

mysql2

HTML5

CSS3

Vanilla JavaScript

Fetch API

bcryptjs

express-session

dotenv

helmet


The application must be designed specifically for Plesk Node.js hosting.


---

1. IMPORTANT TECHNOLOGY RULES

Use:

Node.js
Express.js
MySQL
Vanilla JavaScript
HTML5
CSS3
REST API

Do NOT use:

PHP
Laravel
Symfony
Python
Django
React
Vue
Angular
Next.js
TypeScript
Drizzle
Prisma
MongoDB
Docker
GitHub

Use CommonJS JavaScript for maximum Plesk compatibility.

No compilation/build step should be required.

The application must run with:

npm install
npm start


---

2. PLESK REQUIREMENTS

The application must work directly on Plesk Node.js hosting.

Plesk configuration:

Application Root: erp
Application Startup File: app.js
Application Mode: production

Use:

const PORT = process.env.PORT || 3000;

Never hard-code the Plesk port.


---

3. PROJECT STRUCTURE

Use:

erp/
│
├── app.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── db.sql
├── README.md
│
├── public/
│   ├── login.html
│   ├── index.html
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   └── app.js
│   │   └── logo.png
│   │
│   └── modules/
│       ├── dashboard/
│       ├── inventory/
│       ├── customers/
│       ├── suppliers/
│       ├── sales/
│       ├── purchases/
│       ├── expenses/
│       ├── accounting/
│       ├── reports/
│       ├── users/
│       └── receipt/
│
└── server/
    ├── config/
    │   └── database.js
    │
    ├── middleware/
    │   ├── auth.js
    │   ├── permissions.js
    │   ├── csrf.js
    │   └── errorHandler.js
    │
    ├── routes/
    │   ├── auth.js
    │   ├── dashboard.js
    │   ├── inventory.js
    │   ├── customers.js
    │   ├── suppliers.js
    │   ├── sales.js
    │   ├── purchases.js
    │   ├── expenses.js
    │   ├── accounting.js
    │   ├── reports.js
    │   ├── users.js
    │   └── receipt.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── dashboardController.js
    │   ├── inventoryController.js
    │   ├── customerController.js
    │   ├── supplierController.js
    │   ├── salesController.js
    │   ├── purchaseController.js
    │   ├── expenseController.js
    │   ├── accountingController.js
    │   ├── reportController.js
    │   ├── userController.js
    │   └── receiptController.js
    │
    └── services/
        ├── inventoryService.js
        ├── accountingService.js
        ├── paymentService.js
        └── auditService.js

Keep the architecture simple.

Do not create unnecessary files.


---

4. AUTHENTICATION

Use secure session authentication.

Use:

express-session
bcryptjs

Roles:

Admin
Manager
Accountant
Sales
Storekeeper

Passwords must use:

bcrypt.hash(password, 12)
bcrypt.compare(password, hash)

Never store plain-text passwords.


---

5. ADMIN FULL ACCESS — IMPORTANT

ADMIN MUST HAVE FULL SYSTEM CONTROL

The Admin role is the highest-level role.

Admin must be able to:

Create

View

Edit

Activate

Deactivate

Cancel

Void

Reverse

Delete


records throughout the ERP.

Admin must have access to all modules:

Dashboard
Inventory
Customers
Suppliers
Sales
Purchases
Payments
Expenses
Accounting
Reports
Users
Settings
Audit Logs
Receipts

Admin must also be able to:

Create users

Edit users

Change user roles

Activate users

Deactivate users

Reset passwords

Manage permissions

Delete appropriate records

View audit logs

Manage system settings



---

6. DELETE PERMISSION RULE

This rule is extremely important.

ADMIN

Admin = FULL DELETE ACCESS

Admin can delete records when necessary.

Examples:

Products
Categories
Customers
Suppliers
Expenses
Users
Payments
Sales
Purchases
Other ERP records

However, deleting a record that affects accounting or inventory must trigger the appropriate cleanup/reversal process so that the database does not become inconsistent.


---

7. DELETE SECURITY

Every Delete operation must require:

Step 1

Show a confirmation dialog:

Are you sure you want to delete this record?

This action may affect related business data.

[Cancel] [Delete]

Step 2

Backend verifies:

Is the user authenticated?
Is the user Admin?
Does the record exist?
Is deletion allowed?

Step 3

Perform deletion safely.

Step 4

Create an audit log.

Store:

user_id
action = DELETE
module
record_id
record_data
ip_address
user_agent
created_at

The audit log must remain even after the original record has been deleted.


---

8. OTHER ROLES MUST NOT DELETE

The following roles must NOT have hard-delete permission:

Manager
Accountant
Sales
Storekeeper

They can only perform actions allowed by their permissions.

For example:

Sales
→ Create sales
→ View sales
→ Cannot delete

Storekeeper
→ Manage inventory
→ Cannot delete important records

Accountant
→ Manage accounting
→ Cannot delete financial records

Manager
→ View/manage operational data
→ Cannot hard-delete

Only:

ADMIN

has unrestricted delete permission.


---

9. DATABASE

Create:

db.sql

Minimum tables:

users
roles
permissions
categories
products
customers
suppliers
sales
sale_items
purchases
purchase_items
payments
expenses
accounts
transactions
settings
audit_logs
stock_movements

Use:

InnoDB
Primary Keys
Foreign Keys
Indexes
Unique Constraints
created_at
updated_at
status

Money must use:

DECIMAL

Never use floating-point values for financial amounts.


---

10. INVENTORY

Features:

Products

Categories

SKU

Barcode

Buying price

Selling price

Stock quantity

Minimum stock

Stock status

Search

Filter

Pagination

Add

Edit

View

Delete — Admin only

Stock movement history


Rules:

Completed Purchase
        ↓
Increase Stock

Completed Sale
        ↓
Decrease Stock

Inventory updates must use database transactions.


---

11. CUSTOMERS

Features:

Add

Edit

View

Delete — Admin only

Phone

Email

Address

Balance

Sales history

Payment history

Search

Filter

Pagination



---

12. SUPPLIERS

Features:

Add

Edit

View

Delete — Admin only

Phone

Email

Address

Balance

Purchase history

Payment history

Search

Filter

Pagination



---

13. SALES / POS

Create a modern professional POS.

Features:

Customer

Walk-in customer

Product search

Barcode

Cart

Quantity

Price

Discount

Subtotal

Total

Amount paid

Balance

Change

Payment method

Complete sale

Print receipt


When completing a sale:

BEGIN TRANSACTION

Create Sale
Create Sale Items
Decrease Stock
Create Payment
Create Accounting Transaction
Generate Receipt Number
Create Audit Log

COMMIT

If anything fails:

ROLLBACK

Admin must have the ability to delete a sale when required.

When deleting a completed sale, the system must safely:

Restore affected inventory
Remove/reverse related payment
Remove/reverse accounting entries
Mark/delete related sale items
Create DELETE audit log

Do not leave inconsistent stock or accounting balances.


---

14. PURCHASES

Features:

Supplier

Product

Quantity

Purchase price

Total

Payment

Balance

Payment method

Complete purchase

Edit

Delete — Admin only


When deleting a completed purchase:

Restore inventory correctly
Handle payment
Handle accounting entries
Delete/reverse related purchase items
Create audit log

Do not allow inconsistent inventory.


---

15. EXPENSES

Features:

Expense category

Description

Amount

Date

Payment method

Account

Save

Edit

Delete — Admin only

History

Search

Filter


Automatically create accounting entries.

When Admin deletes an expense, its accounting/payment effects must also be handled correctly.


---

16. ACCOUNTING

Implement basic double-entry accounting.

Sale

Debit  Cash / Receivable
Credit Sales Revenue

Purchase

Debit  Inventory
Credit Cash / Payable

Expense

Debit  Expense
Credit Cash / Bank

Show:

Chart of Accounts
Transactions
Cash
Bank
Receivables
Payables
Revenue
Expenses
Profit & Loss
Trial Balance

Admin may delete accounting records when necessary, but the system must maintain accounting consistency.


---

17. REPORTS

Create:

Sales Report
Purchase Report
Expense Report
Inventory Report
Profit & Loss
Customer Balance
Supplier Balance
Cash Report
Payment Report
Stock Movement Report

Filters:

Date From
Date To
Customer
Supplier
Product
Payment Method
User
Status
Search

Support:

View
Filter
Print


---

18. USERS

Features:

Add User
Edit User
Activate
Deactivate
Assign Role
Reset Password
Change Password
View Activity
Audit Logs
Delete User — Admin only

Admin must be protected from accidentally deleting the last active Admin account.

The system must prevent a situation where no Admin account remains.


---

19. RECEIPT PRINTING

Support:

58mm
80mm
A4

Use:

@media print

Receipt must contain real sale data.

Include:

Business Name
Receipt Number
Date
Cashier
Customer
Items
Quantity
Price
Discount
Subtotal
Total
Paid
Change
Payment Method
Thank You message

After sale:

Print Receipt


---

20. API

Use REST-style APIs:

POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

GET /api/dashboard

GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id

GET /api/customers
POST /api/customers
PUT /api/customers/:id
DELETE /api/customers/:id

GET /api/suppliers
POST /api/suppliers
PUT /api/suppliers/:id
DELETE /api/suppliers/:id

GET /api/sales
POST /api/sales
GET /api/sales/:id
DELETE /api/sales/:id

GET /api/purchases
POST /api/purchases
GET /api/purchases/:id
DELETE /api/purchases/:id

GET /api/expenses
POST /api/expenses
PUT /api/expenses/:id
DELETE /api/expenses/:id

GET /api/payments
POST /api/payments
DELETE /api/payments/:id

GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

GET /api/audit-logs

GET /api/receipt/:saleId

Every DELETE endpoint must enforce:

Authenticated user
        ↓
Admin role
        ↓
Permission check
        ↓
Confirmation from frontend
        ↓
Safe deletion
        ↓
Audit log

Never trust frontend permissions alone.


---

21. SECURITY

Use:

Prepared statements

bcrypt password hashing

Secure sessions

HTTP-only cookies

SameSite cookies

Helmet

CSRF protection

Input validation

Output escaping

Role-based authorization

Audit logs

Login rate limiting

Session expiration


Never expose:

Database password
Session secret
SQL errors
Stack traces
Sensitive server information


---

22. DATA RULES

No dummy data.

Never create:

Fake customers

Fake products

Fake sales

Fake purchases

Fake expenses

Fake statistics

Fake accounting


Everything must come from MySQL.

If there is no data:

No records found.


---

23. DELETE VS VOID

The system must support both:

DELETE
VOID
CANCEL
REVERSE

DELETE

Used by Admin when a record genuinely needs to be removed.

VOID

Used when a transaction should remain visible but become invalid.

CANCEL

Used when an operation is cancelled.

REVERSE

Used to correct a completed financial transaction while preserving history.

The Admin can choose the appropriate action depending on the situation.


---

24. AUDIT LOG

Every important operation must be recorded:

LOGIN
LOGOUT
CREATE
UPDATE
DELETE
VOID
CANCEL
REVERSE
SALE
PURCHASE
PAYMENT
EXPENSE
USER_CHANGE
PERMISSION_CHANGE

For DELETE specifically, preserve:

Deleted By
Deleted Record ID
Deleted Module
Deleted Record Data
Date
Time
IP Address
User Agent

This means an Admin can delete a record while the system still maintains an audit history showing who deleted it and what was deleted.


---

25. UI

Create a premium ERP interface with:

White/neutral background

Blue/green accent

Sidebar

Top navigation

Cards

Tables

Modals

Toasts

Search

Filters

Dropdowns

Charts

Loading states

Empty states

Confirmation dialogs

Responsive design

Mobile navigation

Touch-friendly controls


Delete buttons must only appear for Admin users.

Example:

[Edit] [View] [Delete]

For non-admin:

[Edit] [View]

But remember: the backend must also enforce this permission.


---

26. AI DEVELOPMENT RULES

When modifying this project:

1. Do not rewrite the whole project.


2. Do not change the architecture unnecessarily.


3. Do not rename files unnecessarily.


4. Do not create duplicate modules.


5. Do not introduce frameworks.


6. Do not remove working features.


7. Inspect existing files before modifying them.


8. Make the smallest safe change.


9. Preserve database integrity.


10. Preserve inventory integrity.


11. Preserve accounting integrity.


12. Preserve authentication.


13. Preserve Admin permissions.


14. Do not remove Admin DELETE capability.


15. Do not create dummy data.


16. Do not create TODO placeholders.


17. Test the affected module after changes.




---

27. FINAL ACCEPTANCE REQUIREMENTS

The ERP is complete only when:

Node.js starts successfully

MySQL connects

Login works

Logout works

Sessions work

Roles work

Permissions work

Admin has full access

Admin can delete records

Non-admin users cannot hard-delete

Delete confirmation works

Delete audit logging works

Inventory works

Customers work

Suppliers work

Sales/POS works

Purchases work

Payments work

Expenses work

Accounting works

Reports work

Receipt printing works

58mm receipt works

80mm receipt works

A4 receipt works

Mobile UI works

Desktop UI works

Database transactions work

No dummy data exists

No hard-coded statistics exist

Security protections work

The application runs directly on Plesk



---

28. FINAL DEPLOYMENT

The final application must run on:

Plesk
+
Node.js
+
Express.js
+
MySQL
+
Custom Domain

Startup:

app.js

Installation:

npm install
npm start

No GitHub is required.

No Docker is required.

No TypeScript compilation is required.

No React build is required.

No PHP is required.

The final result must be a modern, beautiful, secure and fully functional ERP suitable for real business use, with Admin having full control including DELETE permissions.
