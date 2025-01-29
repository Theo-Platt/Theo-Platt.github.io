pages={
    "index.html":"Home",
    "contact.html":"Contact Info",
    "doodles.html":"Drawing",
    "games.html":"Gaming",
    "research.html":"Research",
    "license.html":"Licensing"
}
function generate_navbar(parentID = 'body'){
    //get page so navbar has different color here
    const url = window.location.href;
    const filename = url.split('/').pop();
    if(filename==`undefined`){filename=`index.html`}
    
    const root = document.getElementById(parentID)
    // Dropdown menu w3schools guide: https://www.w3schools.com/howto/howto_css_dropdown.asp

    // open the header, setup dropdown menu div
    const nav = document.createElement(`div`)
    nav.className="dropdown"
    

    const button = document.createElement(`button`)
    button.className="navigation"
    button.innerHTML = "Navigation"

    const div    = document.createElement(`div`)
    div.className = "dropdown-content"
    
    // create entry for all pages except current page
    for(key of Object.keys(pages)){
        console.log(`key: '${key}', value: '${pages[key]}'`)
        const menu_item = document.createElement(`a`)
        menu_item.href = `./${key}`
        menu_item.innerHTML = pages[key]
        if(key == filename){
            menu_item.id="nav-menu-current"
        }
        div.appendChild(menu_item)
    }
    
    // close the div and header
    button.appendChild(div)
    nav.appendChild(button)
    root.appendChild(nav)

}


function generate_header(parentID=`body`){

    //get page so navbar has different color here
    const url = window.location.href;
    const filename = url.split('/').pop();

    const root = document.getElementById(parentID)
    const h1 = document.createElement(`h1`)
    h1.innerHTML=`CS-532 Personal Website - ${pages[filename]}`
    root.appendChild(h1)
}


function toggle_darkmode(OnOff=false){
    console.log(`toggle_darkmode(${OnOff})`)
    const root = document.body;
    const header=document.getElementById("header")
    const main=document.getElementById("main")
    const footer=document.getElementById("footer")

    root.classList.toggle("dark-mode",OnOff)
    header.classList.toggle("dark-mode",OnOff)
    main.classList.toggle("dark-mode",OnOff)
    footer.classList.toggle("dark-mode",OnOff)

    updateCookies("darkmode",String(OnOff))
    // look into local storage & session storage
}

function load_darkmode(){
    console.log(`Darkmode cookie:${getCookie("darkmode")}`)
    const dm = getCookie("darkmode") == "true"
    toggle_darkmode(dm)
    document.getElementById("darkmode").checked = dm
}

//from https://www.w3schools.com/js/js_cookies.asp
function getCookie(name) {
    const cookieArray = document.cookie.split(';'); // Split cookies into an array
    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim(); // Remove leading/trailing spaces
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1)); // Return the cookie value
        }
    }
    return null; // Return null if the cookie is not found
}

 function updateCookies(name,value){
    document.cookie = `${name}=${value}`
}