# 🧢 Product Table – Apparel Filter

## 📜 Problem Statement  
The Product table stores information about items sold by Sports Craft Company. Your task is to **display product ID, description, category, and discount** for all products that belong to the **Apparel** category.

## 🧩 Table Structure

| Column Name | Data Type     | Description                     |
|-------------|---------------|---------------------------------|
| `Prodid`    | `INTEGER`     | Unique Product ID               |
| `Pdesc`     | `VARCHAR`     | Product Description             |
| `Price`     | `DECIMAL`     | Product Price                   |
| `Category`  | `VARCHAR`     | Product Category                |
| `Discount`  | `DECIMAL`     | Discount Percentage (nullable)  |

## 💡 Explanation  
- The query filters rows where the `Category` is `'Apparel'`.  
- It selects four columns: `Prodid`, `Pdesc`, `Category`, and `Discount`.  
- This ensures only Apparel products are displayed, along with their discount details.  
- `Discount` may contain `NULL` values, which are still shown in the result.

## ✅ SQL Solution  
```sql
SELECT Prodid, Pdesc, Category, Discount 
FROM Product 
WHERE Category = 'Apparel';
```

## 🖥️ Sample Output  
```text
+--------+------------------+----------+----------+
| Prodid | Pdesc            | Category | Discount |
+--------+------------------+----------+----------+
| 101    | Sports T-Shirt   | Apparel  | 10.00    |
| 102    | Running Shorts   | Apparel  | 5.00     |
| 103    | Windbreaker      | Apparel  | NULL     |
| 104    | Gym Leggings     | Apparel  | 15.00    |
+--------+------------------+----------+----------+
```

