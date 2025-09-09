# Assignment 2 

This assignment focuses on creating a Java class `Restaurant` with instance variables and a method to display details. It is part of the Infosys Springboard course on Java – Methods.

## 📝 Problem Statement  
Create a class `Restaurant` in the **SwiftFood** project with:  
- Instance variables to store restaurant details  
- A method `displayRestaurantDetails()` to print all details in a readable format  
- A tester class to create an object, assign values, and display them  

## 🧩 Class Specification  

| Variable Name       | Data Type | Description                      |
|---------------------|-----------|----------------------------------|
| `restaurantName`    | `String`  | Name of the restaurant           |
| `restaurantContact` | `long`    | Contact number of the restaurant |
| `restaurantAddress` | `String`  | Address of the restaurant        |
| `rating`            | `float`   | Rating of the restaurant         |

## 🔹 Method  

```java
void displayRestaurantDetails()
````

Prints all instance variable values in a user-friendly format.

## 💻 Java Code

```java
// Restaurant.java
public class Restaurant {
    String restaurantName;
    long restaurantContact;
    String restaurantAddress;
    float rating;
    void displayRestaurantDetails() {
        System.out.println("Restaurant Name: " + restaurantName);
        System.out.println("Contact Number: " + restaurantContact);
        System.out.println("Address: " + restaurantAddress);
        System.out.println("Rating: " + rating);
    }
}

// Tester.java
public class Tester {
    public static void main(String[] args) {
        Restaurant restaurant = new Restaurant();
        restaurant.restaurantName = "Spice Garden";
        restaurant.restaurantContact = 9876543210L;
        restaurant.restaurantAddress = "MG Road, Bengaluru";
        restaurant.rating = 4.3f;

        restaurant.displayRestaurantDetails();
    }
}
```

## 📊 Expected Output

```
Restaurant Name: Spice Garden
Contact Number: 9876543210
Address: MG Road, Bengaluru
Rating: 4.3
```

