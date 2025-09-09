# 📦 Product Table – Select Clause

## 📜 Problem Statement  
Write a query to **list all products** from the `Product` table.

## 🧩 Table Structure

| Column Name | Data Type | Description                     |
|-------------|-----------|---------------------------------|
| `Prodid`    | `INT`     | Unique Product ID               |
| `Pdesc`     | `VARCHAR` | Product Description             |
| `Price`     | `DECIMAL` | Product Price                   |
| `Category`  | `VARCHAR` | Product Category                |
| `Discount`  | `DECIMAL` | Discount Percentage (nullable)  |

## 🧾 Sample Data

| PRODID | PDESC        | PRICE | CATEGORY     | DISCOUNT |
|--------|--------------|-------|--------------|----------|
| 101    | Basketball   | 10    | Sports       | 5        |
| 102    | Shirt        | 20    | Apparel      | 10       |
| 103    | NULL         | 30    | Electronics  | 15       |
| 104    | Cricket Bat  | 20    | Sports       | 20       |
| 105    | Trouser      | 10    | Apparel      | 5        |
| 106    | Television   | 40    | ELECTRONICS  | 20       |

## ✅ SQL Solution  
```sql
SELECT * FROM Product;
