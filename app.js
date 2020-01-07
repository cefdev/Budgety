/*
 * Budget Controller
*/
const budgetController = (function(){

})()


/*
 * User Interface Controller
*/
const UIController = (function(){

    let DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
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
const controller = (function(budgetCtrl, UICtrl){

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
        // 1. Get the field input data
        let input = UICtrl.getInput();

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

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