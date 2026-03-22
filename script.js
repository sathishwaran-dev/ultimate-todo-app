/* ELEMENTS */
const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const forgotPage = document.getElementById("forgotPage");
const appPage = document.getElementById("appPage");
const welcome = document.getElementById("welcome");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let filter = "all";

/* PAGE SWITCH */
function showLogin(){
  loginPage.style.display="block";
  registerPage.style.display="none";
  forgotPage.style.display="none";
  appPage.style.display="none";
}

function showRegister(){
  loginPage.style.display="none";
  registerPage.style.display="block";
  forgotPage.style.display="none";
  appPage.style.display="none";
}

function showForgot(){
  loginPage.style.display="none";
  registerPage.style.display="none";
  forgotPage.style.display="block";
  appPage.style.display="none";
}

function showApp(user){
  loginPage.style.display="none";
  registerPage.style.display="none";
  forgotPage.style.display="none";
  appPage.style.display="block";
  welcome.innerText="👋 " + user;
}

/* AUTH */
function register(){
  let u = regUser.value.trim();
  let p = regPass.value.trim();

  if(!u || !p){
    toast("Fill all fields");
    return;
  }

  localStorage.setItem("user_"+u, p);
  toast("Registered");
  showLogin();
}

function login()
{
  let u = loginUser.value.trim();
  let p = loginPass.value.trim();

  if(!u || !p){
    toast("Please enter username and password");
    return;
  }

  let saved = localStorage.getItem("user_" + u);

  if(!saved){
  toast("Invalid username", "error");
  return;
}

if(saved !== p){
  toast("Invalid password", "error");
  return;
}

localStorage.setItem("currentUser", u);
showApp(u);
toast("Login successful", "success");
}

function resetPass(){
  let u = forgotUser.value.trim();
  let p = newPass.value.trim();

  if(localStorage.getItem("user_"+u)){
    localStorage.setItem("user_"+u, p);
    toast("Password updated");
    showLogin();
  } else {
    toast("User not found");
  }
}

function logout(){
  localStorage.removeItem("currentUser");
  location.reload();
}

/* TODO */
function addTask(){
  let text = taskInput.value.trim();
  let date = dueDate.value;
  let pr = priority.value;

  if(!text){
    toast("Enter task");
    return;
  }

  tasks.push({text, completed:false, date, pr});
  history.push("Added: " + text);

  taskInput.value="";
  render();
}

function render(){
  taskList.innerHTML="";
  let search = searchInput.value.toLowerCase();

  tasks
  .filter(t=>{
    if(filter==="completed") return t.completed;
    return true;
  })
  .filter(t=>t.text.toLowerCase().includes(search))
  .forEach((t,i)=>{

    let li = document.createElement("li");
    li.className = t.pr.toLowerCase();

    li.innerHTML=`
      <div onclick="toggle(${i})" class="${t.completed?'completed':''}">
        ${t.text}
      </div>
      <small>${t.date || ""}</small>
      <button onclick="edit(${i})">Edit</button>
      <button onclick="del(${i})">Delete</button>
    `;

    taskList.appendChild(li);
  });

  updateStats();
  renderHistory();

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("history", JSON.stringify(history));
}

/* ACTIONS */
function toggle(i){
  tasks[i].completed = !tasks[i].completed;
  history.push("Completed: " + tasks[i].text);
  render();
}

function del(i){
  if(confirm("Delete?")){
    history.push("Deleted: " + tasks[i].text);
    tasks.splice(i,1);
    render();
  }
}

function edit(i){
  let n = prompt("Edit", tasks[i].text);
  if(n){
    history.push("Edited: " + tasks[i].text);
    tasks[i].text = n;
    render();
  }
}

function setFilter(f){
  filter = f;
  render();
}

/* STATS */
function updateStats(){
  let total = tasks.length;
  let comp = tasks.filter(t=>t.completed).length;
  stats.innerText = `Total:${total} | Completed:${comp} | Pending:${total-comp}`;
}

/* HISTORY */
function renderHistory(){
  historyList.innerHTML="";
  history.forEach(h=>{
    let li=document.createElement("li");
    li.innerText=h;
    historyList.appendChild(li);
  });
}

/* TOAST */
function toast(msg, type){
  let t = document.getElementById("toast");
  t.innerText = msg;

  t.className = "show"; // reset

  if(type === "success"){
    t.style.background = "green";
  } else if(type === "error"){
    t.style.background = "red";
  } else {
    t.style.background = "#333";
  }

  setTimeout(() => {
    t.classList.remove("show");
  }, 2000);
}

/* DARK */
function toggleDark(){
  document.body.classList.toggle("dark");
}

/* AUTO LOGIN */
let user = localStorage.getItem("currentUser");
if(user){
  showApp(user);
} else {
  showLogin();
}
