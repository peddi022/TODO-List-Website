//Task class: represents each task
class Task{
    constructor(name, deadline){
        this.name = name;
        this.deadline = deadline;
    }
}

//UI Class: Handle UI tasks
class UI{
    static showTasks(){
        const tasks = Store.getTasks();
        tasks.forEach((task) => UI.addTaskToList(task));
    }

    static addTaskToList(task){
        const list = document.querySelector('#task-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input class="form-check-input checkbox" type="checkbox" value="" id="flexCheckDefault"></td>
            <td>${task.name}</td>
            <td>${task.deadline}</td>
            <td><a href="#" class="btn btn-danger delete">Remove</a></td>
        `
        list.appendChild(row);
    }

    static deleteTask(element){
        if (element.classList.contains('delete')){
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#task-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#task-name').value = '';
        document.querySelector('#deadline').value = '';
    }

    static resetUI(){
        document.getElementById('task-list').innerHTML = '';

    }
}

//Store Class: Handles storage
class Store{
    static getTasks(){
        let tasks;
        if (localStorage.getItem('tasks') == null){
            tasks = []
        } else{
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        return tasks;
    }

    static addTask(task){
        const tasks = Store.getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static removeTask(name){
        const tasks = Store.getTasks();

        tasks.forEach((task, index) => {
            if (task.name === name){
                UI.showAlert('Task removed', "danger");
                tasks.splice(index, 1);
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    //Delete all tasks from storage
    static deleteAll(){
        localStorage.setItem('tasks', JSON.stringify([]));
        UI.resetUI();
    }
}

//Event: Display tasks
document.addEventListener('DOMContentLoaded', UI.showTasks);

//Event: Add a task
document.querySelector('#task-form').addEventListener('submit', (e) => {
    e.preventDefault();

    //Get form values
    const name = document.querySelector('#task-name').value;
    const deadline = document.querySelector('#deadline').value;

    //Validate
    if (name == '' || deadline == ''){
        UI.showAlert('Please fill in all fields', "danger");
    } else{
        const task = new Task(name, deadline);

        UI.addTaskToList(task);

        Store.addTask(task);

        // UI.showAlert('Task added', "success");

        UI.clearFields();
    }
});


//Event: Remove a task
document.querySelector('#task-list').addEventListener('click', (e) => {
    UI.deleteTask(e.target);
    Store.removeTask(e.target.parentElement.previousElementSibling.previousElementSibling.innerText);

    
})

//Event: Completed a task
document.querySelector('#task-list').addEventListener('click', (e) =>{
    const selectedRow = e.target.parentElement.parentElement
    if (e.target.classList.contains("checkbox")){
        if (e.target.checked == true){
            selectedRow.classList.add("table-success");
        } else{
            selectedRow.classList.remove("table-success");
        }
}
})

//TODO
//Event: Reset list
document.querySelector('#reset-button').addEventListener('click', (e) => {
        Store.deleteAll();
})
