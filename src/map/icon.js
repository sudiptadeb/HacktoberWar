var context = require.context('!raw-loader!./icons', true, /\.(svg)$/); // No I18N
let temp ={};
context.keys().forEach((filename)=>{
    let name =filename.substring(2,filename.length-4)
    temp[name] = context(filename).default;
});

let icons = {};

for(var name in temp){
    let element = document.createElement('div');  // No I18N
    element.innerHTML = temp[name];
    let svg = element.firstElementChild;
    let symbol = {
        html : svg.innerHTML
    };

    let viewBox = svg.getAttribute('viewBox').replace(/\s[\s]+/g,' ').trim().split(' ');
    // let width = viewBox[2];
    // let height = viewBox[3];
    // console.log(name,viewBox,width,height)
    symbol.viewBox=viewBox;
    symbol.id=`symbol-icon-${name}`;
    // while (svg.hasChildNodes()) {
    //   symbol.appendChild(svg.removeChild(svg.firstChild));
    // }
    // symbol.setAttribute('width',width);
    // symbol.setAttribute('height',height);
    icons[name]=symbol;
}

export default  function(name){
    return icons[name];
}