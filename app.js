/*
 * Budget Controller
*/
const budgetController = (function(){

})()


/*
 * User Interface Controller
*/
const UIController = (function(){

})()


/*
 * The Controller
*/
const controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = () => {
        // Run ctrlAddItem() if ENTER key or Submit button is clicked
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", e => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

})(budgetController, UIController)

