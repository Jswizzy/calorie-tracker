// Storage Controller
const StorageCtrl = (function () {
    return {
        storeItem(item) {
            let items = localStorage.getItem('items');

            if (items === null) {
                items = [item]
            } else {
                items = JSON.parse(items);
                items.push(item);
            }

            localStorage.setItem('items', JSON.stringify(items))
        },
        removeItem(item) {
            let items = localStorage.getItem('items');
            items = JSON.parse(items)
                .filter(it => it.id !== item.id);
            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItem(item) {
            let items = localStorage.getItem('items');
            items = JSON.parse(items)
                .map(it => (it.id === item.id) ? item : it);
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItems() {
            localStorage.removeItem('items')
        },
        getItems() {
            return (localStorage.getItem('items') === null ? [] : JSON.parse(localStorage.getItem('items')));
        }
    }
})();


// Item Controller
const ItemCtrl = (function (StorageCtrl) {
    class Item {
        constructor(id, name, calorie) {
            this.id = id;
            this.name = name;
            this.calories = calorie;
        }
    }

    const data = {
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'cookie', calories: 400},
        //     // {id: 2, name: 'eggs', calories: 300}
        // ],
        items: StorageCtrl.getItems(),
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
        getTotalCalories() {
            return data.items.reduce((sum, n) => sum + n.calories, 0)
        },
        getItemById(id) {
            return data.items.find(item => item.id === id);
        },
        setCurrentItem(item) {
            data.currentItem = item;
        },
        getCurrentItem() {
            return data.currentItem;
        },
        updateItem(name, calories) {
            calories = parseInt(calories);

            const item = data.items.find(item => item.id === data.currentItem.id);
            item.name = name;
            item.calories = calories;

            return item;
        },
        deleteItem(currentItem) {
            data.items = data.items.filter(item => currentItem.id !== item.id);
        },
        clearItems() {
            data.items = [];
        }
    }
})(StorageCtrl);

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '#add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '#update-btn',
        backBtn: '#back-btn',
        deleteBtn: '#delete-btn',
        clearAllBtn: '#clear-btn',
    };

    function selectItems(selectedItem) {
        let listItems = document.querySelectorAll(UISelectors.listItems);

        listItems = Array.from(listItems);

        return listItems
            .filter(item => item.getAttribute('id') === `item-${selectedItem.id}`)
    }

    return {
        populateItemList(items) {
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
        getItemInput() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            };
        },
        addListItem(item) {
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> 
                <em>${item.calories} ${(item.calories !== 1) ? "Calories" : "Calorie"}</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item material-icons">edit</i>
                    </a>`;

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        addItemToForm() {
            const item = ItemCtrl.getCurrentItem();
            document.querySelector(UISelectors.itemNameInput).value = item.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = item.calories;
            this.showEditState();
        },
        hideList() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        clearInput() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        getUISelectors() {
            return UISelectors
        },
        updateListItem(updateItem) {

            const items = selectItems(updateItem);

            items
                .map(item => {
                    item.innerHTML = `<strong>${updateItem.name}: </strong> 
                <em>${updateItem.calories} ${(updateItem.calories !== 1) ? "Calories" : "Calorie"}</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item material-icons">edit</i>
                    </a>`;
                });
        },
        deleteListItem(currentItem) {
            const items = selectItems(currentItem);
            items.map(item => item.remove());
        },
        clearItems() {
            document.querySelector(UISelectors.itemList).innerHTML = '';
            this.hideList();
        }
    }
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    function itemAddSubmit(e) {
        const input = UICtrl.getItemInput();

        if (input.name !== '' && input.calories !== '') {
            const item = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(item);

            updateTotalCalories();

            StorageCtrl.storeItem(item);

            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    function updateTotalCalories() {
        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);
    }

    function itemDeleteSubmit(e) {
        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem);

        UICtrl.deleteListItem(currentItem);

        StorageCtrl.removeItem(currentItem);

        updateTotalCalories();

        UICtrl.clearEditState();

        e.preventDefault();
    }

    function clearAllSubmit(e) {

        ItemCtrl.clearItems();

        UICtrl.clearItems();

        UICtrl.clearEditState();

        StorageCtrl.clearItems();

        updateTotalCalories();

        e.preventDefault();
    }

    function loadEventListeners() {
        const UISelectors = UICtrl.getUISelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        document.addEventListener('keypress', e => {
            if (e.key === "Enter") {
                e.preventDefault();
                return false;
            }
        });

        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemEditSubmit);

        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        document.querySelector(UISelectors.clearAllBtn).addEventListener('click', clearAllSubmit)
    }

    function itemEditSubmit(e) {

        const {name, calories} = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(name, calories);

        UICtrl.updateListItem(updatedItem);

        updateTotalCalories();

        StorageCtrl.updateItem(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    function itemEditClick(e) {
        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;

            const listIdArr = listId.split('-');

            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    return {
        init() {
            UICtrl.clearEditState();

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
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();