let currentPageIndex = [0]
let adminData = []
let filteredData = []

async function fetchAdminData(index) {
    try {
        const response = await fetch(`https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`);
        const data = await response.json();
        adminData = data
        populateAdminData(data,index)
    } catch (error) {
        console.log(error);
    }
}

function populateAdminData(adminData,currentPageIndex) {
    const container = document.getElementById("container")
    container.innerHTML=""
    for (i=currentPageIndex[0]; i<=Math.min(currentPageIndex[0]+9,adminData.length-1); i++){
        const div = document.createElement("div");
        div.className = "flex-container data"
        div.id = `flx${i}`

        const input = document.createElement("input")
        input.className=`chk`
        input.type="checkbox"
        input.id=`${adminData[i].name}`
        input.setAttribute("onclick", `check(${i})`)

        const name = document.createElement("div")
        name.className = "item name"
        name.innerHTML=`${adminData[i].name}`
        name.id=`name${i}`

        const email = document.createElement("div")
        email.className="item"
        email.innerHTML=`${adminData[i].email}`
        email.id=`email${i}`

        const role = document.createElement("div")
        role.className="item"
        role.innerHTML=`${adminData[i].role.charAt(0).toUpperCase() + adminData[i].role.slice(1)}`
        role.id=`role${i}`

        const actions = document.createElement("div")
        actions.className="item"

        const hiddenSubmit = document.createElement("button")
        hiddenSubmit.innerHTML="Submit"
        hiddenSubmit.type="submit"
        hiddenSubmit.style="display: none"
        hiddenSubmit.id=`sub${i}`
        hiddenSubmit.setAttribute("onclick", `hiddenSubmit(${i})`)

        const editButton = document.createElement("button")
        editButton.setAttribute("onclick", `edit(${i})`)

        const deleteButton = document.createElement("button")
        deleteButton.setAttribute("onclick", `individualDelete(${i})`)

        const editIcon = document.createElement("i") 
        editIcon.className="fa fa-edit"
        editIcon.style="font-size:20px"

        const deleteIcon = document.createElement("i")
        deleteIcon.className="fa fa-trash-o"
        deleteIcon.style="font-size:20px;color:red"

        editButton.appendChild(editIcon)
        deleteButton.appendChild(deleteIcon)

        actions.appendChild(editButton)
        actions.appendChild(deleteButton)
        actions.appendChild(hiddenSubmit)

        hr = document.createElement("hr")

        div.appendChild(input)
        div.appendChild(name)
        div.appendChild(email)
        div.appendChild(role)
        div.appendChild(actions)
        container.appendChild(div)
        container.appendChild(hr)
    }
    const uncheck = document.getElementsByClassName("chk")
    const checkAll = document.getElementById("selectAll")
    checkAll.checked = uncheck.checked

    const pagination = document.getElementById("pagination")
    pagination.innerHTML=""

    const first = document.createElement("button")
    first.className="controlButton"
    first.innerHTML="<<"
    first.setAttribute("onclick", `firstPage()`)

    const prev = document.createElement("button")
    prev.className="controlButton"
    prev.innerHTML="<"
    prev.setAttribute("onclick", `prev()`)

    pagination.append(first,prev)

    for(i=0; i<Math.ceil(adminData.length/10); i++){
        pageNumber = document.createElement("button")
        pageNumber.className="controlButton"
        pageNumber.innerHTML=`${i+1}`
        pageNumber.id=`pg${i+1}`
        pageNumber.setAttribute("onclick", `pageNum(${i})`)
        pagination.appendChild(pageNumber)
    }

    const next = document.createElement("button")
    next.className="controlButton"
    next.innerHTML=">"
    next.setAttribute("onclick", `next()`)

    const last = document.createElement("button")
    last.className="controlButton"
    last.innerHTML=">>"
    last.setAttribute("onclick", `lastPage()`)

    pagination.append(next,last)
}


function pageNum(i) {
    if (filteredData.length !== 0) {
        currentPageIndex[0] = i*10
        populateAdminData(filteredData,currentPageIndex)
        return
    }
    currentPageIndex[0] = i*10
    populateAdminData(adminData,currentPageIndex)
}

function firstPage () {
    if(filteredData.length !== 0) {
        currentPageIndex[0] = 0
        populateAdminData(filteredData,currentPageIndex)
        return
    }
    currentPageIndex[0] = 0
    populateAdminData(adminData,currentPageIndex)
}


function lastPage() {
    if (filteredData.length !== 0) {
        currentPageIndex[0] = (filteredData.length) - (filteredData.length%10)
        populateAdminData(filteredData,currentPageIndex)
        return
    }
    currentPageIndex[0]= (adminData.length) - (adminData.length%10)
    populateAdminData(adminData,currentPageIndex)
}

function prev() {
    if(filteredData.length !==0) {
        if (currentPageIndex[0]-9 >= 0){
            currentPageIndex[0] = currentPageIndex[0] - 10
            populateAdminData(filteredData,currentPageIndex)
        }
        return
    }
    if (currentPageIndex[0]-9 >= 0){
        currentPageIndex[0] = currentPageIndex[0] - 10
        populateAdminData(adminData,currentPageIndex)
    }
}

function next() {

    if(filteredData.length !== 0 ){
        if (currentPageIndex[0]+9 <= filteredData.length){
            currentPageIndex[0] = currentPageIndex[0] + 10
            populateAdminData(filteredData,currentPageIndex)
        }
        return
    }
    if (currentPageIndex[0]+9 <= adminData.length){
        currentPageIndex[0] = currentPageIndex[0] + 10
        populateAdminData(adminData,currentPageIndex)
    }
}

function deleteSelected() {
    const checkboxes = document.querySelectorAll(`.chk`);
    const emptySearchbar = document.getElementById("searchBar")
    emptySearchbar.value = ""
    for (const chk of checkboxes) {
        if (chk.checked) {
            let x = adminData.findIndex(ele => ele.name === chk.id)
            adminData.splice(x,1)
            if (filteredData.length !== 0 ) {
                let y = filteredData.findIndex(ele => ele.name === chk.id)
                filteredData.splice(y,1)
            }
        }
    }

    populateAdminData(adminData,currentPageIndex)
}


function selectAll(){
    const checkboxes = document.querySelectorAll(`.chk`);
    const selectAll = document.getElementById("selectAll")
    const flx = document.querySelectorAll(".data")
    for (let i=0; i<=checkboxes.length-1; i++) {
        checkboxes[i].checked = selectAll.checked
        if (selectAll.checked) {
            flx[i].style.cssText=`background-color: lightgrey`
        }
        else {
            flx[i].style.cssText=``
        }
        
    }
}

function individualDelete(index) {
    adminData.splice(index,1)
    populateAdminData(adminData, currentPageIndex)
}

function searchBar() {
    currentPageIndex[0] = 0
    const value = document.getElementById("searchBar").value.toLowerCase()
    filteredData = adminData.filter((item) => item.name.toLowerCase().includes(value));
    populateAdminData(filteredData,currentPageIndex)
}

function edit(i) {
    nam = document.getElementById(`name${i}`)
    email = document.getElementById(`email${i}`)
    role = document.getElementById(`role${i}`)
    submit = document.getElementById(`sub${i}`)

    if (nam.innerHTML == adminData[i].name){
        nam.innerHTML=`<input type="text" id=nam${i} placeholder="${nam.innerHTML}">`
        email.innerHTML=`<input type="email" id=eml${i} placeholder="${email.innerHTML}">`
        role.innerHTML=`  
        <label for="roles">Choose a role:</label>
        <select name="role" id="rl${i}">
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
        <br>`
        submit.style="margin-left: 10%"
    }
}

function hiddenSubmit(i,role) {
    nam = document.getElementById(`nam${i}`).value
    email=document.getElementById(`eml${i}`).value
    role=document.getElementById(`rl${i}`).value

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(co\.in|com)$/;
        return emailPattern.test(email);
      }

    if (nam !== "") {
        adminData[i].name = nam
    }
    if (email !== "" ) {
        if (isValidEmail(email)) {
            adminData[i].email = email
        }
        else {
            alert("Please enter valid Email")
            return
        }
        adminData[i].email = email
    }
    if(role !== "") {
        adminData[i].role = role
    }

    populateAdminData(adminData,currentPageIndex)
}

function check(i) {
    flxCont = document.getElementById(`flx${i}`)

    if (flxCont.style.cssText == "") {
        flxCont.style=`background-color: lightgrey`
    }
    else {
        flxCont.style=""
    }
}

fetchAdminData(currentPageIndex)
