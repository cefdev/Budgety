/*
 * Budget Controller
*/
const budgetController = (() => {

    // Expense Class
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value; 
        }
    }

    // Income Class
    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value; 
        }
    }

    let calculateTotal = (type) => {
        let sum = 0;

        // Loop through all exp or inc and sum their values
        data.allItems[type].forEach((cur) => {
            sum += cur.value;
        });

        // Store sum in data's totals
        data.totals[type] = sum;
    }

    // Here is where all incomes and expenses will be saved
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: (type, des, val) => {
            let newItem, ID;

            // Create new ID
            data.allItems[type].length > 0 ?
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1 :
            ID = 0;

            // Create new item based on 'inc' or 'exp' type
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

        deleteItem: (type, id) => {
            let ids, index;

            // Get all (exps OR incs) items ids
            ids = data.allItems[type].map(current => {
                return current.id;
            });

            // Get the index of the item's id we want to delete
            index = ids.indexOf(id);

            // Delete the item based on its index
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: () => {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: ".expenses__list",
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: ".container"
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: (obj, type) => {
            let html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === "exp") {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },

        deleteListItem: (selectorID) => {
            // Get the item id's value (ex: inc-0, exp-9 ...)
            let el = document.getElementById(selectorID);

            // Delete the item from the UI
            el.parentNode.removeChild(el);
        },

        clearFields: () => {
            let fields, fieldsArr;

            // Get a NodeList of inputs
            fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);

            // Convert the NodeList to an array
            fieldsArr = Array.prototype.slice.call(fields);

            // Loop through each input field and clear it
            fieldsArr.forEach(current => {
                current.value = "";
            });

            // Set the focus back to the description field
            fieldsArr[0].focus();
        },

        displayBudget: (obj) => {
            
            // Update UI ( total budget, Income, Expenses)
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            
            // Udpate UI percentage
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---"
            }
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

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    };

    let updateBudget = () => {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    // Add new item
    let ctrlAddItem = () => {
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // Check if the input fields aren't empty and value's input is > 0
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            
            // 4. Clear input fields
            UICtrl.clearFields();
    
            // 5. Calculate and update budget
            updateBudget();
        }
    }

    // Delete an item
    let ctrlDeleteItem = (e) => {
        let itemID, splitID, type, ID;

        // Get the target item's id (ex: inc-0, inc-1, exp-5 ...)
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        // Only run this if the target element has an id ( The target element is an item)
        if (itemID) {

            // Split the itemID to an array containing the item's type and ID (ex: inc-1 => ["inc","1"])
            splitID = itemID.split("-");

            // Get the itemID's type
            type = splitID[0];

            // Get the itemID's ID
            ID = parseInt(splitID[1]);
             
            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Udpate and show the new budget
            updateBudget();
        }
    }

    // Initial parameters
    return {
        init: () => {
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    }

})(budgetController, UIController)

controller.init();