/*
 * Budget Controller
*/
const budgetController = (() => {

    // Expense Fuction construction
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value; 
        }
    }

    // Income Fuction construction
    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value; 
        }
    }

    // Here is where we'll save incomes and expenses data
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: (type, des, val) => {
            let newItem, ID;

            // Create new ID
            data.allItems[type].length > 0 ?
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1 :
            ID = 0;

            // Create new item based o 'inc' or 'exp' type
            if ( type === "exp") {
                newItem = new Expense(ID, des, val)
            } else if (type === "inc") {
                newItem = new Income(ID, des, val)
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        testing: () => {
            return data;
        }
    }

})()


/*
 * User Interface Controller
*/
const UIController = (() =>{

    let DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },

        addListItem: (obj, type) => {
            let html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === "exp") {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },

        getDOMStrings : () => {
            return DOMStrings;
        }
    }

})()


/*
 * The Controller
*/
const controller = ((budgetCtrl, UICtrl) => {

    let setupEventListeners = () => {
        // Get DOMStrings from UI Controller
        let DOM = UICtrl.getDOMStrings();

        // Run ctrlAddItem() if ENTER key or Submit button is clicked
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", e => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

    

    // Add new item
    let ctrlAddItem = () => {
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. calculate the budget

        // 5. Display the budget on the UI

    }

    return {
        init: () => {
            setupEventListeners();
        }
    }

})(budgetController, UIController)

controller.init();