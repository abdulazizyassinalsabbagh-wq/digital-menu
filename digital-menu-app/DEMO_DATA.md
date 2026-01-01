# Demo Data Setup

To test the app, you can add a demo restaurant directly in Supabase.

## Step 1: Add a Restaurant

Go to Supabase Table Editor > restaurants table > Insert row

Add this data:
- **name**: Demo Restaurant
- **password**: demo123
- **slug**: demo-restaurant

## Step 2: Login to Admin Panel

1. Go to http://localhost:3000/admin/login
2. Restaurant ID: `demo-restaurant`
3. Password: `demo123`

## Step 3: Add Sample Categories

In the admin panel, go to Categories and add:
- Appetizers
- Main Courses
- Desserts
- Beverages

## Step 4: Add Sample Menu Items

Here are some sample items you can add:

### Appetizers
- **Bruschetta** - $8.99 - Fresh tomatoes, basil, and mozzarella on toasted bread
- **Chicken Wings** - $12.99 - Spicy buffalo wings with ranch dressing
- **Caesar Salad** - $9.99 - Romaine lettuce, parmesan, croutons, caesar dressing

### Main Courses
- **Grilled Salmon** - $24.99 - Atlantic salmon with seasonal vegetables
- **Ribeye Steak** - $32.99 - 12oz ribeye with garlic mashed potatoes
- **Chicken Parmesan** - $18.99 - Breaded chicken with marinara and mozzarella
- **Vegetable Pasta** - $16.99 - Fresh vegetables in garlic olive oil sauce

### Desserts
- **Chocolate Cake** - $7.99 - Rich chocolate layer cake
- **Tiramisu** - $8.99 - Classic Italian dessert
- **Ice Cream** - $5.99 - Vanilla, chocolate, or strawberry

### Beverages
- **Soft Drinks** - $2.99 - Coke, Sprite, Fanta
- **Coffee** - $3.99 - Espresso, cappuccino, latte
- **Fresh Juice** - $4.99 - Orange, apple, or mixed berry

## Step 5: View the Customer Menu

Open: http://localhost:3000/menu/demo-restaurant

## Step 6: Get the QR Code

In the admin panel, go to "QR Code" tab and download your menu QR code.

You can print it and scan it with your phone to test the customer experience!
