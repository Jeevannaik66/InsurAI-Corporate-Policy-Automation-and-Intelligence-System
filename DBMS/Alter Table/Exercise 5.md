## ALTER TABLE

### ❓ Task
Drop the column `ContactNo` from the table `Player`.

---

### 🧾 Table Structure Before Alteration

| Column Name | Data Type     | Constraint       | Description              |
|-------------|---------------|------------------|--------------------------|
| `PId`       | INTEGER       | PRIMARY KEY      | Unique Player ID         |
| `PName`     | VARCHAR2(20)  | NOT NULL         | Player Name              |
| `Ranking`   | INTEGER       | —                | Player's ranking         |
| `ContactNo` | NUMBER(10)    | —                | Player Contact Number    |

---

### ✅ Query Used
```sql
ALTER TABLE Player
DROP COLUMN ContactNo;
