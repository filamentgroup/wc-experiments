// // a couple example classes
function log(text){
  document.querySelector("#log").innerHTML += '<p>' + text + '</p>';
}
document.addEventListener("create.two",function(e){
    log(e.type + " event fired on " + e.target.nodeName );
})
document.addEventListener("destroy.two",function(e){
    log(e.type + " event fired on " + e.target.nodeName );
})
export class two {
  constructor(elem){
    this.elem = elem;
    log("create two")  
  }
  destructor(){
    log("destroy two") 
  }
}