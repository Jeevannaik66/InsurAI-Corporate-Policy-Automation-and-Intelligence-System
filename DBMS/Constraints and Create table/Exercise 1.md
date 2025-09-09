# 🏆 Player Table – Sports Craft Tournament

## 📜 Problem Statement  
Sports Craft Company has organized tournaments in multiple individual sports and invited top-ranked players to participate. Each tournament follows a knockout format, with matches played between two players.

Your task is to **create the `Player` table** based on the specifications provided.

## 🧩 Table Structure

| Column Name | Data Type     | Constraints    | Description                                |
|-------------|---------------|----------------|--------------------------------------------|
| `PId`       | `INTEGER`     | `PRIMARY KEY`  | Unique player ID (mandatory for each player) |
| `PName`     | `VARCHAR2(20)`| `NOT NULL`     | Player name                                |
| `Ranking`   | `INTEGER`     |                | Player's ranking                           |

## 💡 Explanation  
- Each player is assigned a unique `PId` to track tournament records.  
- Names are mandatory to register in the system (`NOT NULL`).  
- Ranking helps determine seeding and match order during knockout rounds.

## ✅ SQL Solution  
```sql
CREATE TABLE Player (
    PId INTEGER PRIMARY KEY,
    PName VARCHAR2(20) NOT NULL,
    Ranking INTEGER
);
