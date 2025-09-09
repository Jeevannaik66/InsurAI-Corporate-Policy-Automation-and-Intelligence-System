# Assignment 04 – findHighestOccurrence

## 📝 Problem Statement

**Method Description:**

`findHighestOccurrence(String str)`

Find the count of the highest occurring character in the string passed to the method and return the count.

Test the functionality using the `main()` method of the `Tester` class.

---

## 🖼️ Sample Input and Output


<img width="394" height="118" alt="stringext3" src="https://github.com/user-attachments/assets/b45f9f21-6572-43c2-9c54-6a782965a64f" />

---

## 💡 How It Works

Loop through each character and count how many times it occurs using a nested loop. Track the maximum count found.

---

## ✅ Solution – `Tester.java`

```java
class Tester {

    public static int findHighestOccurrence(String str) {
        int maxCount = 0;

        for (int i = 0; i < str.length(); i++) {
            char current = str.charAt(i);
            int count = 0;

            for (int j = 0; j < str.length(); j++) {
                if (str.charAt(j) == current) {
                    count++;
                }
            }

            if (count > maxCount) {
                maxCount = count;
            }
        }

        return maxCount;
    }

    public static void main(String args[]) {
        String str = "success";
        System.out.println(findHighestOccurrence(str));  // Output: 3
    }
}
