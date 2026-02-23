  ---
  Core Modules

  1. Authentication & Users

  - Email-based login/register (Laravel Breeze)
  - Roles: owner, admin, coach, staff, manager, employee
  - Profile management with password updates
  - All data scoped by organization_id (multi-tenant)

  ---
  2. Team Management (/team)

  - Create/edit/deactivate coaches and staff
  - Per-coach config: display color, head coach rate, helper rate, fixed salary, payment frequency (weekly/biweekly/monthly), start date, show-on-calendar toggle
  - Assign coaches to locations (many-to-many)
  - Assign coaches to martial arts (many-to-many)
  - Commission tier structure (min/max/rate per tier)

  ---
  3. Locations Management (/locations)

  - Create/edit/deactivate gym locations
  - Address, phone, email, operating hours
  - Martial arts offered per location

  ---
  4. Martial Arts Management (/martial-arts)

  - Create/edit/delete disciplines (BJJ, Muay Thai, etc.)
  - Color-coded, linked to coaches

  ---
  5. Class Templates (/classes)

  - Define recurring class types (not instances)
  - Per template: name, day of week, start/end time, location, coach, martial art, rate overrides
  - Create multi-day templates in one action

  ---
  6. Schedule Management (/schedule)

  - Weekly grid view filtered by location & martial art
  - Assign coaches to class templates per day (head coach or helper role)
  - Multi-assign an entire week to one coach
  - Lock/unlock weeks to prevent edits
  - Clone week assignments (with overwrite option, scoped or global)
  - Real-time payroll preview for the displayed week
  - Last week payroll total for comparison

  ---
  7. Private Classes (/private-classes)

  - One-off private lessons (not recurring)
  - Track student, coach, location, date/time, duration, price, payout
  - Status: scheduled, completed, cancelled, no_show
  - Filter by status, coach, location, date range
  - Stats: total, scheduled, completed, revenue

  ---
  8. Payroll System (/payroll, /my-payroll)

  - Multi-source calculation engine (calcCoachPay):
    - Regular class pay (from schedule assignments × duration × rate)
    - Private class payouts
    - Fixed salary
    - Tiered commission (based on conversion count)
    - Deductions
  - Period types: weekly, biweekly, monthly
  - Reports: all coaches, by location, individual coach, self-service (My Payroll with YTD)
  - Record payments (partial payments supported), auto-status: pending → partial → paid
  - Add deductions and conversion counts per period
  - Period locking: lock to prevent accidental edits, track who locked and when
  - Commission tier management per coach

  ---
  9. Misc Payouts (/misc-payouts)

  - Track non-coach vendor/staff payouts (cleaning, transport, other)
  - Filter by month & location
  - Mark as paid

  ---
  10. Inventory Management (/inventory)

  - Product catalog: name, SKU, price, stock quantity, low-stock threshold, category
  - Stock adjustments: sale, restock, adjustment, return (with audit trail)
  - Product categories
  - Low-stock alerts dashboard

  ---
  11. Analytics / BI Dashboard (/analytics)

  - Per location + network-wide rollup
  - Member metrics: active, on hold, new, cancellations, net growth, churn rate, retention rate
  - Financial metrics: revenue vs. prior period, ARM, LTV, 12-month revenue trend
  - Tenure & holds: avg tenure, hold rate, avg hold duration, hold reasons breakdown
  - Cancellation analysis: top reasons, timing buckets, cohort retention (last 6 months)
  - Trends: revenue & new members over 12 months

  ---
  12. ZenPlanner CSV Import (/import)

  - Import: members, revenue, cancellations, holds
  - Per-location scoped imports
  - Deduplication (by receipt number / source ID)
  - Transactional (rollback on error)
  - Import log with rows imported/skipped

  ---
  13. Main Dashboard (/dashboard)

  - Quick stats: active members, new leads, classes today, revenue this month, members expiring in 7 days

  ---
  Technical Highlights

  - Multi-tenancy: all queries scoped by organization_id
  - Payroll locking: prevents edits to closed periods
  - Soft deactivation: deactivate vs. hard delete
  - JSON fields: commission tiers, martial arts arrays stored in DB
  - Pivot tables: locations ↔ coaches, martial arts ↔ coaches
  - Inertia.js SPA: server-side routing with reactive Vue 3 frontend
