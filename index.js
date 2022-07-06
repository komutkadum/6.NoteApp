// for time ago function
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// button
let goBackHomeButton = document.getElementById('back-home'); //done
let submitNoteButton = document.getElementById('submit-note'); //done
let createNoteButton = document.getElementById('create-note');  //done
// input
let noteTitleInput = document.getElementById('note-title-input');  //done
let noteBodyInput = document.getElementById('note-body-input');  //done
let actionSelectInput = document.getElementById('action-select');
let filterInput = document.getElementById('filter-input');
let editOrCreateInput = document.getElementById('editOrCreate');
// error message
let titleErrorMessage = document.getElementById('title-error-message')  //done
let bodyErrorMessage = document.getElementById('body-error-message')  //done
// main block
let actionBlock = document.getElementsByClassName('action');
let noteBlock = document.getElementsByClassName('notes');
let createBlock = document.getElementsByClassName('create');  //done
// to show or not to show based on the availability of the notes
let noNoteShow = document.getElementsByClassName('temp-notes'); //done
let noteList = document.getElementById('note-list');

// storing the notes as an array which is stored in localstorage
let noteArray = JSON.parse(localStorage.getItem('notes') || "[]");

// print the array items into screen
const printNoteList = () => {
    if(noteArray.length!=0){
        noNoteShow[0].style.display = 'none';
        noteBlock[0].style.display = 'block';
        let list = "";
        noteArray.forEach((val,index)=> {
            list += `<li><p>${val.title}</p>
            <p>${val.body}</p>
            <p>last edited ${timeAgo(val.lastEdited)}</p>
            <button onclick="editListItem(${index})" class="edit">&#9988; Edit</button>
            <button onclick="deleteListItem(${index})" class="delete">&#10005; Delete</button></li>`;
        })
        noteList.innerHTML = list;
    }else {
        noNoteShow[0].style.display = 'block';
        noteList.style.display = 'none'
    }
}
printNoteList();

// navigate to the edit view of the respective notes
const editListItem = (editIndex) => {
    noteTitleInput.value = noteArray[editIndex].title;
    noteBodyInput.value = noteArray[editIndex].body;
    createNoteFunction(editIndex)
}

// deleting the notes
const deleteList = (removeIndex) => {
    let tempFilter = noteArray.filter((item,index)=>index!==removeIndex);
    localStorage.setItem('notes',JSON.stringify(tempFilter));
    noteArray = [...tempFilter];
}
const deleteListItem = (removeIndex) => {
    if(!confirm('Are you sure want to delete?')) return;
    deleteList(removeIndex);
    printNoteList();
}

// filtering notes in the action 
const filterList = () => {
    let filter = filterInput.value.toUpperCase();
    let li = noteList.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
        let p = li[i].getElementsByTagName("p")[0];
        let txtValue = p.textContent || p.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// sort list  ---------------------------------------
const sortListBy = () => {
    let temp = actionSelectInput.value;
    if(temp==='sort-rc') {
        sortByRecentlyCreated();
    }else if(temp==='sort-le'){
        sortByLastEdited();
    }else if(temp==='sort-al'){
        sortAlphabetically();
    }
}
const sortAlphabetically = () => {
    noteArray.sort((a, b) => {
        let fa = a.title.toLowerCase(),
            fb = b.title.toLowerCase();
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
    printNoteList();
}

const sortByLastEdited = () => {
    noteArray.sort((a, b) => {
        let da = new Date(a.lastEdited),
            db = new Date(b.lastEdited);
        return db - da;
    });
    printNoteList();
}

const sortByRecentlyCreated = () => {
    noteArray.sort((a, b) => {
        let da = new Date(a.createAt),
            db = new Date(b.createAt);
        return db - da;
    });
    printNoteList();
}
// sort list end xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// submitting or updating the notes based on their nature
submitNoteButton.addEventListener('click',()=>{
    if(noteTitleInput.value===''){
        errorMessage('missing input value',titleErrorMessage)
        return;
    }
    if(noteBodyInput.value===''){
        errorMessage('missing input value',bodyErrorMessage)
        return;
    }
    let temp = {};
    if(editOrCreateInput.value!=='-1'){
        temp = {
            id : noteArray[parseInt(editOrCreateInput.value)].id,
            title : noteTitleInput.value,
            body : noteBodyInput.value,
            createAt : noteArray[parseInt(editOrCreateInput.value)].createAt,
            lastEdited : Date.now()
        }
        deleteList(parseInt(editOrCreateInput.value));
    }else {
        temp = {
            id : uuidv4(),
            title : noteTitleInput.value,
            body : noteBodyInput.value,
            createAt : Date.now(),
            lastEdited : Date.now()
        }
    }
    noteArray.unshift(temp);
    localStorage.setItem('notes',JSON.stringify(noteArray));
    goHomeFunction();
})
// going back to home
const goHomeFunction = () => {
    document.location.reload();
}

const createNoteFunction = (val) => {
    if(val!=='-1') {
        submitNoteButton.innerHTML = "&#9998; Update";
    }else {
        submitNoteButton.innerHTML = "Submit &#10148;";
    }
    actionBlock[0].style.display = 'none'
    noteBlock[0].style.display = 'none'
    createBlock[0].style.display = 'block'
    editOrCreateInput.value = val
}

// if any error message occurs while filling in the input field
const errorMessage = (text,ele) => {
    ele.style.display = 'block'         
    ele.innerText = text;
    setInterval(() => {
        ele.style.display = 'none';
    }, 3000);
}

// creating unique id for the each note item
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
// time ago funciton
  function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
  
    if (minutes < 10) {
      // Adding leading zero to minutes
      minutes = `0${ minutes }`;
    }
  
    if (prefomattedDate) {
      // Today at 10:20
      // Yesterday at 10:20
      return `${ prefomattedDate } at ${ hours }:${ minutes }`;
    }
  
    if (hideYear) {
      // 10. January at 10:20
      return `${ day }. ${ month } at ${ hours }:${ minutes }`;
    }
  
    // 10. January 2017. at 10:20
    return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
  }
  // --- Main function
  function timeAgo(dateParam) {
    if (!dateParam) {
      return null;
    }
  
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();
  
  
    if (seconds < 5) {
      return 'just now';
    } else if (seconds < 60) {
      return `${ seconds } seconds ago`;
    } else if (seconds < 90) {
      return 'about a minute ago';
    } else if (minutes < 60) {
      return `${ minutes } minutes ago`;
    } else if (isToday) {
      return getFormattedDate(date, 'Today'); // Today at 10:20
    } else if (isYesterday) {
      return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } else if (isThisYear) {
      return getFormattedDate(date, false, true); // 10. January at 10:20
    }
  
    return getFormattedDate(date); // 10. January 2017. at 10:20
  }