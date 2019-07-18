// Storage Controller


// Item Controller
const ItemCtrl = (function () {
    const Item = function (id, name, calorie) {
        this.id = id;
        this.name = name;
        this.calories = calorie;
    };

    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'cookie', calories: 400},
            // {id: 2, name: 'eggs', calories: 300}
        ],
        currentItem: null
    };

    return {
        getItems: function () {
            return data.items;
        },
        logData: function () {
            return data;
        },
        addItem: function (name, calories) {
            let id;
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1
            } else {
                id = 0;
            }
            calories = parseInt(calories);
            let newItem = new Item(id, name, calories);

            data.items.push(newItem);
            return newItem;
        },
        getTotalCalories: function () {
            return data.items.reduce((sum, n) => sum + n.calories, 0)
        }
    }
})();

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '#add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    };

    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} ${(item.calories !== 1) ? "Calories" : "Calorie"}</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item material-icons">edit</i>
                    </a>
                    </li>`
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getUISelectors: function () {
            return UISelectors
        },
        getItemInput() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            };
        },
        addListItem: function (item) {
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = ` <strong>${item.name}: </strong> 
                <em>${item.calories} ${(item.calories !== 1) ? "Calories" : "Calorie"}</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item material-icons">edit</i>
                    </a>`;

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        }
    }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
    function itemAddSubmit(e) {
        const input = UICtrl.getItemInput();

        if (input.name !== '' && input.calories !== '') {
            const item = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(item);

            updateTotalCalories();

            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const updateTotalCalories = function() {
        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);
    };

    const loadEventListeners = function () {
        const UISelectors = UICtrl.getUISelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
    };

    return {
        init: function () {
            const items = ItemCtrl.getItems();

            if (items.length === 0) {
                UICtrl.hideList()
            } else {
                UICtrl.populateItemList(items);
            }

            updateTotalCalories();

            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

App.init();