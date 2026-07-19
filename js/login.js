const API_URL = "http://localhost:3000/api/auth/login";

const form = document.getElementById("loginForm");

const message = document.getElementById("message");

document.getElementById("togglePassword")
.addEventListener("click",()=>{

const pwd=document.getElementById("password");

pwd.type=pwd.type==="password"?"text":"password";

});

form.addEventListener("submit",async(e)=>{
debugger
e.preventDefault();

const username=document
.getElementById("username").value;

const password=document
.getElementById("password").value;

try{

const response=await fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

username,
password

})

});

const data=await response.json();

if(response.ok){
debugger
localStorage.setItem("token",data.token);

localStorage.setItem("role",data.user.role);

localStorage.setItem("employeeId",data.user.Id);

message.style.color="green";

message.innerHTML="Login Successful...";

setTimeout(()=>{

if(data.role==="Admin"){

window.location.href="admin-dashboard.html";

}
else{

window.location.href="employee-dashboard.html";

}

},1000);

}
else{

message.style.color="red";

message.innerHTML=data.message;

}

}
catch(err){

message.style.color="red";

message.innerHTML="Server Connection Failed";

}

});