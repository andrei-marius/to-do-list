function get() {
    fetch("https://tasks-5caa.restdb.io/rest/tasks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=uf-8",
                "x-apikey": "5d90bb6a1ce70f6379855135",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(tasks => {
            console.log(tasks)
            tasks.forEach(addTaskToTheDOM)
        });
}

function addTaskToTheDOM(task) {
    const template = document.querySelector("template").content;
    const copy = template.cloneNode(true);
    copy.querySelector("article.task").dataset.taskid = task._id;
    copy.querySelector("h3").textContent = task.task;
    copy.querySelector(".remove").addEventListener("click", () => {
        console.log(task._id)
        remove(task._id);
    });
    copy.querySelector(".edit").addEventListener("click", e => {
        fetchAndPopulate(task._id)
    });
    document.querySelector("#container").appendChild(copy);
}
get();

function fetchAndPopulate(id) {
    fetch(`https://tasks-5caa.restdb.io/rest/tasks/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=uf-8",
                "x-apikey": "5d90bb6a1ce70f6379855135",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(tasks => {
            console.log(tasks)
            editForm.elements.task.value = tasks.task;
            editForm.elements.id.value = tasks._id;
        });
}

const editForm = document.querySelector(".editForm");
const addForm = document.querySelector(".addForm");

function post() {
    let newTask = {
        task: addForm.elements.task.value,
    }

    let postData = JSON.stringify(newTask);

    fetch("https://tasks-5caa.restdb.io/rest/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "5d90bb6a1ce70f6379855135",
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            addTaskToTheDOM(data);
        });
}

function remove(id) {
    fetch("https://tasks-5caa.restdb.io/rest/tasks/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "5d90bb6a1ce70f6379855135",
                "cache-control": "no-cache"
            }
        })
        .then(res => res.json())
        .then(data => {
            document.querySelector(`.task[data-taskid="${id}"]`).remove()
        })
}

function put() {
    let newTask = {
        task: editForm.elements.task.value,
    }

    let postData = JSON.stringify(newTask);
    const superId = editForm.elements.id.value;

    fetch("https://tasks-5caa.restdb.io/rest/tasks/" + superId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "5d90bb6a1ce70f6379855135",
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(d => d.json())
        .then(updatedTask => {
            const parentElement = document.querySelector(`.task[data-taskid="${updatedTask._id}"]`);
            parentElement.querySelector("h3").textContent = updatedTask.task;
        });
}

addForm.addEventListener("submit", e => {
    e.preventDefault();
    post();
});

editForm.addEventListener("submit", e => {
    e.preventDefault();
    put();
});