# Assignment 6 – Constructors  

This assignment focuses on enhancing the `Restaurant` class by adding a parameterized constructor and demonstrating its use. It is part of the Infosys Springboard course on Java – Constructors and `this` keyword.

## 📝 Problem Statement  
Modify the existing `Restaurant` class in the **SwiftFood** project to include:  
- A constructor that initializes all instance variables  
- A tester class to create an object using the constructor and invoke `displayRestaurantDetails()`  

## 🧩 Class Specification  

| Variable Name       | Data Type | Description                      |
|---------------------|-----------|----------------------------------|
| `restaurantName`    | `String`  | Name of the restaurant           |
| `restaurantContact` | `long`    | Contact number of the restaurant |
| `restaurantAddress` | `String`  | Address of the restaurant        |
| `rating`            | `float`   | Rating of the restaurant         |

## 🔹 Constructor  

```java
Restaurant(String name, long restaurantContact, String restaurantAddress, float rating)
````

Initializes all instance variables with the values passed to the constructor.

## 💻 Java Code

```java
// Restaurant.java
public class Restaurant {
    String restaurantName;
    long restaurantContact;
    String restaurantAddress;
    float rating;

    Restaurant(String name, long restaurantContact, String restaurantAddress, float rating) {
        this.restaurantName = name;
        this.restaurantContact = restaurantContact;
        this.restaurantAddress = restaurantAddress;
        this.rating = rating;
    }
    void displayRestaurantDetails() {
        System.out.println("Restaurant Details");
        System.out.println("******************");
        System.out.println("Restaurant Name : " + restaurantName);
        System.out.println("Restaurant Rating : " + rating);
        System.out.println("Restaurant Contact : " + restaurantContact);
        System.out.println("Restaurant Address : " + restaurantAddress);
    }
}

// Tester.java
public class Tester {
    public static void main(String[] args) {
        Restaurant restaurant = new Restaurant("McDonald's", 9988787878L, "D089, St. Louis Street, Springfield", 4.1f);
        restaurant.displayRestaurantDetails();
    }
}
```

## 📊 Expected Output

```
Restaurant Details
******************
Restaurant Name : McDonald's
Restaurant Rating : 4.1
Restaurant Contact : 9988787878
Restaurant Address : D089, St. Louis Street, Springfield
```

