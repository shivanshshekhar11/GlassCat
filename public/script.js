function validateForm(){
    var num=document.getElementById("contact-phone").value
    if(isNaN(num)){
        document.getElementById("error").innerText="Enter Numbers Only"
        return false
    }

    if(num.length <10){
        document.getElementById("error").innerText="Enter Valid Number"
        return false
    }
    if(num.length > 10){
        document.getElementById("error").innerText="Enter Valid Number"
        return false
    }
    
}

let pre=document.getElementById("preloader");
window.addEventListener("load",()=>{
    pre.style.display="none";
})