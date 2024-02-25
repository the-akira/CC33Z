let h1 = document.getElementById('myid');
let h2 = document.getElementsByTagName('h2')
let p = document.getElementsByClassName("myclass")
let li = document.querySelector("li")
console.log(h1, typeof h1);
console.log(h2, typeof h2);
console.log(p);
console.log(li);

btn = document.querySelector('button');
btn.addEventListener('click', function(){
    alert('Alerta!');
});

function bgChange() {
    const rndCol = 'rgb(' + Math.random()*256 + ',' + Math.random()*256 + ',' + Math.random()*256 + ')';
    document.body.style.backgroundColor = rndCol;
}