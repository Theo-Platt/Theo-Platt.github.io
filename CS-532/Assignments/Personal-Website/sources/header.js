pages={
    "index.html":"Home",
    "contact.html":"Contact Info",
    "doodles.html":"Drawing",
    "games.html":"Gaming",
    "research.html":"Research"
}
function generate_navbar(current_page = 'n/a', parentID = 'body'){
    const root = document.getElementById(parentID)
    // Dropdown menu w3schools guide: https://www.w3schools.com/howto/howto_css_dropdown.asp

    // open the header, setup dropdown menu div
    const nav = document.createElement(`nav`)
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
        if(key == current_page){
            menu_item.id="nav-menu-current"
        }
        div.appendChild(menu_item)
        
        
    }
    
    // close the div and header
    button.appendChild(div)
    nav.appendChild(button)
    root.appendChild(nav)

}


function toggle_darkmode(){
    const root = document.body;
    root.classList.toggle("dark-mode")
}