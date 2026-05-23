## Project Prompt — CONSTRUX PRO Backend (Convex)

Build a complete Convex backend architecture for a SaaS web application called **CONSTRUX PRO**.

### Project Description

CONSTRUX PRO is a French construction management platform:

> **“Solution complète pour la gestion des chantiers.”**

The platform helps small and medium construction companies manage:

* Gestion du matériel
* Gestion du stock
* Gestion des demandes

The backend must be scalable, modular, production-ready, and fully connected to an existing Next.js frontend application using App Router.

---


# Main Features

## 1. Gestion du matériel

Create a full material management system.

### Requirements

* Create materials
* Edit materials
* Delete materials
* Material categories
* Material status:

  * Disponible
  * En utilisation
  * En maintenance
  * Hors service
* Track:

  * name
  * code
  * quantity
  * chantier/site
  * assigned employee
  * purchase date
  * supplier
  * notes
  * images/files

### Backend Logic

* Convex schema
* Mutations
* Queries
* Indexes
* Validation
* Real-time updates
* Search & filtering
* Pagination

### Frontend Integration

Generate:

* hooks
* API calls
* optimistic updates
* reusable services
* loading states
* error states

Routes:

* `/dashboard/materials`
* `/dashboard/materials/[id]`
* `/dashboard/materials/create`

---

# 2. Gestion du stock

Build a complete inventory/stock system.

### Requirements

* Add stock items
* Track stock quantity
* Low stock alerts
* Stock movement history
* Supplier management
* Warehouse/location management
* Import/export stock
* Unit tracking:

  * kg
  * unité
  * boîte
  * palette
* Automatic stock calculations

### Backend Logic

Create:

* stock tables
* stock transactions
* inventory history
* analytics queries
* aggregate calculations

### Frontend Integration

Routes:

* `/dashboard/stock`
* `/dashboard/stock/history`
* `/dashboard/stock/alerts`

Generate:

* charts-ready queries
* dashboard statistics
* reusable inventory hooks
* filtering system

---

# 3. Gestion des demandes

Build a request management module for chantier teams.

### Requirements

Workers/employees can:

* Create requests
* Request materials
* Request stock items
* Request maintenance
* Add urgency levels:

  * Faible
  * Moyenne
  * Urgente
* Upload files/images
* Add comments

Managers can:

* Approve requests
* Reject requests
* Change status

### Request Status

* En attente
* Approuvée
* Refusée
* En cours
* Terminée

### Backend Logic

Generate:

* request workflow
* role permissions
* notifications
* activity logs
* real-time updates

### Frontend Integration

Routes:

* `/dashboard/demandes`
* `/dashboard/demandes/[id]`
* `/dashboard/demandes/create`

---

# Authentication & Roles

Use Clerk auth.

### Roles

* admin
* manager
* employee

### Permissions

Admin:

* full access

Manager:

* manage chantier data
* approve requests

Employee:

* create requests
* view assigned materials

Implement:

* middleware protection
* Convex auth helpers
* role validation utilities

---

# Database Architecture

Design a scalable Convex schema including:

* users
* materials
* stockItems
* stockTransactions
* requests
* requestComments
* notifications
* chantierSites
* suppliers
* activityLogs

Include:

* indexes
* relations
* timestamps
* soft delete support

---

# Real-Time Features

Implement:

* live dashboard updates
* live request status changes
* live stock alerts
* live notifications

---

# Dashboard Analytics

Generate Convex queries for:

* total materials
* active chantier equipment
* stock alerts
* pending requests
* monthly activity
* recent movements

---

# Frontend Architecture

Generate:

* reusable hooks
* typed API layer
* folder structure
* Convex client setup
* provider configuration
* modular services
* reusable table architecture

Use:

* TanStack Table
* Server Components
* Client Components where necessary

---

# Expected Output

Generate:

1. Full Convex schema
2. Queries
3. Mutations
4. File structure
5. Reusable hooks
6. Role-based auth system
7. Real-time architecture
8. Example frontend integration
9. Dashboard examples
10. Clean scalable TypeScript code
11. Production-ready architecture

The code must be modular, scalable, maintainable, and optimized for a real SaaS product.
