from expense import Expense


def main():
    #Ask for user input for expense
    expense = get_user_expense()
    print(expense)

    #write to file
    save_expense_to_file()



    #read file and summarize expenses
    summarize_expense()

def get_user_expense():
    expense_name = input("Enter expense name: ")
    expense_amount = input("Enter expense amount: ")
    expense_categories = [
        "Food", 
        "Home", 
        "Work", 
        "Fun", 
        "Misc"
    ]

    while True:
        print("Select a category:")
        for i, category_name in enumerate(expense_categories):
             print(f"{i + 1}. {category_name}")

        value_range = f"[1 - {len(expense_categories)}]"
        selected_index = int(input(f"Enter a category number: {value_range} ")) - 1

        if selected_index in range(len(expense_categories)):
            selected_category = expense_categories[selected_index]
            new_expense = Expense(name=expense_name, category=selected_category, amount=expense_amount)
            return new_expense
        else:
            print("Invalid category. Please try again")   
            



def save_expense_to_file():
    print("Saving expense to file...")

def summarize_expense():
        print("Summarizing expenses...")

if __name__ == "__main__":
    main()