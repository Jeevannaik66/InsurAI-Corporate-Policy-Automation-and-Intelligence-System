# 🧾 Product Table – Missing Descriptions Filter

## 📜 Problem Statement  
The Product table stores information about items sold by Sports Craft Company. Your task is to **display product ID, description, category, and discount** for all products that **do not have any description**.

## 🧩 Table Structure

| Column Name | Data Type     | Description                     |
|-------------|---------------|---------------------------------|
| `Prodid`    | `INTEGER`     | Unique Product ID               |
| `Pdesc`     | `VARCHAR`     | Product Description             |
| `Price`     | `DECIMAL`     | Product Price                   |
| `Category`  | `VARCHAR`     | Product Category                |
| `Discount`  | `DECIMAL`     | Discount Percentage (nullable)  |

## 💡 Explanation  
- The query filters rows where `Pdesc` is `NULL`, indicating missing product descriptions.  
- It selects four columns: `Prodid`, `Pdesc`, `Category`, and `Discount`.  
- This helps identify incomplete product records for data cleanup or review.

## ✅ SQL Solution  
```sql
SELECT Prodid, Pdesc, Category, Discount 
FROM Product 
WHERE Pdesc IS NULL;
```

## 🖥️ Sample Output  
```text
+--------+--------+----------+----------+
| Prodid | Pdesc  | Category | Discount |
+--------+--------+----------+----------+
| 105    | NULL   | Apparel  | 10.00    |
| 109    | NULL   | Footwear | 5.00     |
| 112    | NULL   | Outdoor  | NULL     |
+--------+--------+----------+----------+
```
