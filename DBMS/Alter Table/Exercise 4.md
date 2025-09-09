# 🏅Update Player Table

## 📜 Problem Statement  
As the tournament progresses, Sports Craft Company needs to track how many matches each player has played and won. You are required to **add two new columns** — `MatchesPlayed` and `MatchesWon` — to the existing `Player` table using the appropriate SQL syntax.

## 🧩 Updated Table Structure

| Column Name     | Data Type     | Constraints    | Description                                      |
|-----------------|---------------|----------------|--------------------------------------------------|
| `PId`           | `INTEGER`     | `PRIMARY KEY`  | Unique player ID (mandatory for each player)     |
| `PName`         | `VARCHAR2(20)`| `NOT NULL`     | Player name                                      |
| `Ranking`       | `INTEGER`     |                | Player's ranking                                 |
| `ContactNo`     | `NUMBER(10)`  |                | Player's contact number                          |
| `MatchesPlayed` | `NUMBER`      |                | Number of matches the player has participated in |
| `MatchesWon`    | `NUMBER`      |                | Number of matches the player has won             |

## 💡 Explanation  
- These columns help analyze player performance throughout the tournament.  
- `NUMBER` type is suitable for counting match participation and wins.  
- No additional constraints are applied unless required in future enhancements.

## ✅ SQL Solution  
```sql
ALTER TABLE Player 
ADD (
    MatchesPlayed NUMBER,
    MatchesWon NUMBER
);
