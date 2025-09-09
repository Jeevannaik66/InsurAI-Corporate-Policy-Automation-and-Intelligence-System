# 👕 Product Table – Apparel Discount Filter

## 📜 Problem Statement  
The Product table stores information about items sold by Sports Craft Company. Your task is to **display product ID, description, category, and discount** for all products in the **Apparel** category with a **discount greater than 5 percent**.

## 🧩 Database Structure

### Product Table

| Column Name | Data Type     | Description                     |
|-------------|---------------|---------------------------------|
| `Prodid`    | `INTEGER`     | Unique Product ID               |
| `Pdesc`     | `VARCHAR`     | Product Description             |
| `Price`     | `DECIMAL`     | Product Price                   |
| `Category`  | `VARCHAR`     | Product Category                |
| `Discount`  | `DECIMAL`     | Discount Percentage (nullable)  |

### Other Tables (not used in this query)

- **Salesman (Sid, Sname, Location)**
- **Sale (Saleid, Sid, Sldate, Amount)**
- **Saledetail (Saleid, Prodid, Quantity)**

## 💡 Explanation  
- The query filters rows where the `Category` is `'Apparel'`.  
- It then checks if the `Discount` is greater than 5.  
- It selects and returns four columns: `Prodid`, `Pdesc`, `Category`, and `Discount`.

## ✅ SQL Solution  
```sql
SELECT Prodid, Pdesc, Category, Discount
FROM Product
WHERE Category = 'Apparel' AND Discount > 5;
```

## 🖥️ Sample Output  
```text
+--------+--------+----------+----------+
| Prodid | Pdesc  | Category | Discount |
+--------+--------+----------+----------+
| 102    | Shirt  | Apparel  | 10       |
+--------+--------+----------+----------+
1 row(s) selected
```
