# 🛒 Product Table – Sports Craft Inventory

## 📜 Problem Statement  
Sports Craft Company maintains a catalog of products across various categories. Your task is to **insert a new product record** into the `Product` table with the following values:
- `Prodid`: 110  
- `Pdesc`: Bat  
- `Price`: 50  
- `Category`: Sports  
- `Discount`: NULL

## 🧩 Table Structure

| Column Name | Data Type | Description                     |
|-------------|-----------|---------------------------------|
| `Prodid`    | `INT`     | Unique Product ID               |
| `Pdesc`     | `VARCHAR` | Product Description             |
| `Price`     | `DECIMAL` | Product Price                   |
| `Category`  | `VARCHAR` | Product Category                |
| `Discount`  | `DECIMAL` | Discount Percentage (nullable)  |

## 💡 Explanation  
- Each product is uniquely identified by `Prodid`.  
- `Pdesc` describes the item (e.g., Bat, Shirt, Television).  
- `Price` is stored as a numeric value.  
- `Category` helps group products (e.g., Sports, Apparel).  
- `Discount` is optional and can be `NULL`.

## ✅ SQL Solution  
```sql
INSERT INTO Product VALUES(110, 'Bat', 50, 'Sports', NULL);
