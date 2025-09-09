# 📘 Assignment 1

This assignment involves creating a relational database table named `Article` with specific constraints and data types as part of the Infosys Springboard course on RDBMS.

## 📝 Table Specification

| Column Name | Data Type     | Constraints & Description                                                                 |
|-------------|---------------|-------------------------------------------------------------------------------------------|
| `ArCode`    | `CHAR(5)`     | **Primary Key**. Must begin with `'A'`. Unique identifier for each article (e.g., A1001). |
| `ArName`    | `VARCHAR2(30)`| **NOT NULL**. Name of the article.                                                       |
| `Rate`      | `NUMBER(8,2)` | Price of the article (e.g., 5000.00).                                                    |
| `Quantity`  | `NUMBER(4)`   | Must be ≥ 0. **Default value is 0**. Represents stock availability.                      |
| `Class`     | `CHAR(1)`     | Can only be `'A'`, `'B'`, or `'C'`. Represents the classification of the article.        |

## 💡 Explanation

- `ArCode` must start with 'A' and be unique.
- `ArName` must always be provided.
- `Quantity` must not be negative and defaults to 0 if not specified.
- `Class` restricts entries to one of the allowed values: A, B, or C.

## 💻 SQL Query

```sql
CREATE TABLE Article (
    ArCode CHAR(5) PRIMARY KEY CHECK (ArCode LIKE 'A%'),
    ArName VARCHAR2(30) NOT NULL,
    Rate NUMBER(8,2),
    Quantity NUMBER(4) DEFAULT 0 CHECK (Quantity >= 0),
    Class CHAR(1) CHECK (Class IN ('A', 'B', 'C'))
);
```
