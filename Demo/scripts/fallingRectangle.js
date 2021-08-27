//TODO:
//add date to the information
//make ticks pop out when hovering over when greyed
//show number of books (count)

let paneHeight = 0;
let commonWords = ['using', 'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with',
'again', 'to', 'and', 'its', 'also', 'then', 'equally', 'identically', 'uniquely', 'like', 'as', 'moreover', 'likewise', 'comparatively', 'similarly', 'for', 'thus', 'then', 'hence', 'but', 'unlike', 'or', 'yet', 'besides', 'while', 'even', 'though', 'notably', 'including', 'namely', 'if', 'then', 'unless', 'whenever', 'since', 'while', 'because', 'here', 'there', 'next', 'from', 'over', 'near', 'above', 'below', 'under', 'between', 'about', 'summary', 'conclusion', 'short', 'all', 'have'];
let searchCount = 0;
var searchContent = document.getElementById("SearchContent");
let totalBooks = 10;
let floors = ["Floor", "B1", "B2", "B3", "B4", "Floor", "B6", "B7", "B8", "B9", "N/A"];
var subjectCount = {};
var sortedSubjectCounts = [];
var punctuation = [".", ",", ":", ";", "-", "/", "\/"]

var bookHeights = [];
var bookHeightPercentage = [];
var bookHeightsSum = [];
var bookData = [];
var filters = [];
var removed = [];
var filteredBookData = [];
let filterCount = 0;
var excludedIndex = -1;


let bookClickedId = "";

var bookTitlePanel = document.getElementById("BT");
var bookFullTitlePanel = document.getElementById("BFT");
var bookDescriptionPanel = document.getElementById("BD");
var bookSubjectPanel = document.getElementById("BS");
var bookLinkPanel = document.getElementById("BL");

let infoPanels = [bookTitlePanel, bookFullTitlePanel, bookDescriptionPanel, bookSubjectPanel, bookLinkPanel];
let defaultHTML = ["", "<h1>Full Title</h1>","<h1>Description</h1>","<h1>Subject</h1>", ""];
function vf(u, a, t)
{
  return u + a*t;
}

function bounce(v)
{
  return -v*0.4;
}

function move(v, u, xi, t)
{
  return ((v + u)/2)*t + xi;
}


function makeBookFall(num, f)
{
  let time = performance.now();
  let startTime = performance.now();
  let book = document.getElementById("B" + num);
  let floor = document.getElementById(f + "");
  let bookHeight = book.offsetHeight;
  let floorPos = floor.offsetTop - bookHeight;
  let pos = book.offsetTop;
  let v = 1;
  let u = 0;
  let a = 0.01;
  let t = 0;
  let bounces = 0;
  let endPos = document.getElementById("Floor").offsetTop - bookHeightsSum[num-1];

  requestAnimationFrame(function animate() 
  {
    if (num > totalBooks)
    {
      return;
    }
    t = performance.now() - time;
    floorPos = floor.offsetTop - bookHeight;
    floorPos = Math.min(floorPos, endPos);
    if (bounces >= 1)
    {
      floorPos = endPos;
    }
    v = vf(u,a,t);
    pos = move(v,u,pos,t);
    pos = Math.min(pos, floorPos);
    
    book.style.top = Math.round(pos) + "px";

    
    if(bounces >= 1 && pos == endPos)
    {
      //console.log("Finished " + num)
      return;
    }


    if (pos >= floorPos && bounces < 1 && (time-startTime) > 200)
    {
      
      //console.log(num + " has bounced with time of " + (time-startTime) + " and velocity of " + v);
      v = bounce(v);
      bounces++;
    }

    time = performance.now();
    u = v;
    
    requestAnimationFrame(animate);
    

  });
}



function wow(num)
{
  
  bookClickedId = "B" + num;
  let title = document.getElementById("T" + num);
  infoPanels[0].innerHTML = "<h3>" + title.innerText + "</h3>";
  infoPanels[1].innerHTML = "<h1>Full Title</h1><h2>" + filteredBookData[num-1 + (searchCount)].title + "</h2>";
  infoPanels[2].innerHTML = "<h1>Description</h1><p>" + filteredBookData[num-1 + (searchCount)].description + "</p>";
  infoPanels[3].innerHTML = "<h1>Subject</h1><h2>" + getGenreName(filteredBookData[num-1 + (searchCount)].subject[0].substring(0,2)) + ":</h2><p>"
  + getFullSubjectName(filteredBookData[num-1 + (searchCount)].subject[0].substring(0,3))+ "</p>";
  infoPanels[4].innerHTML = "<p>An <a href='" + filteredBookData[num-1 + (searchCount)].urls + "' target='_blank'>"
  + "ETD</a> by:</p><h2>" + filteredBookData[num-1 + (searchCount)].creator + ".</h2>";

  for (let i = 0; i < totalBooks; i++)
  {
    let book = document.getElementById("B" + (i+1));
    
    if (num-1 === i)
    {
      book.style.boxShadow = "0px 0px 0px 4px #E0FEFD";
      book.style.opacity = 1;
    }
    else{
      book.style.boxShadow = "none";
      book.style.opacity = 0.3;
    }
  }

  infoPanels[0].style.color = title.style.color;
  infoPanels[0].style.backgroundColor = title.style.backgroundColor;
  infoPanels[0].style.textShadow = "-1px 1px 2px black, 1px 1px 2px black, 1px -1px 0 black,-1px -1px 0 black";
  setInfoTitleFontSize();
}

function pxToInt(str)
{
  return parseInt(str.split("px")[0]);
}


function makeBooksFall(){
  floors = ["Floor", "B1", "B2", "B3", "B4", "Floor", "B6", "B7", "B8", "B9", "N/A"];
  for (let i = 0; i < totalBooks; i++)
  {
    makeBookFall("" + (i+1), floors[i]);
  }
}

function setBookPos()
{
  let sep = 0;
  let previousX = 0;
  let x = 0;
  for (let i = 1; i < 11; i++)
  {
    let n = (i-1)%5;
    let book = document.getElementById("B" + i);
    book.style.top = -200*(n+1) + "px";
    if (i >= 6)
    {
      sep = 1;
    }
    x = Math.floor(Math.random()*9 + 1) + sep*50;
    while(x == previousX)
    {
      x = Math.floor(Math.random()*9 + 1) + sep*50;
    }
    book.style.left = x + "%";
    previousX = x;
  }

}

function initBookPos()
{
  for (let i = 1; i < totalBooks+1; i++)
  {
    let book = document.getElementById("B" + i);
    book.style.top = -1000 + "px";
  }
}

function bookSizeFunction(num)
{
  if (num <= 5)
  {
    return 12;
  }
  else if (num <= 8)
  {
    return 13;
  }
  else if (num <= 12)
  {
    return 14;
  }
  else if (num <= 15){
    return 15;
  }
  else{
    return 16;
  }
  
}


function setBookHeights()
{
  let sum = 0;
  bookHeights = [];
  bookHeightsSum = [];
  for (let i = 0; i < totalBooks; i++)
  {
    let titleText = document.getElementById("T" + (i+1)).innerText;
    let book = document.getElementById("B" + (i+1));
    let n = bookSizeFunction(titleText.split(" ").length);
    if (i == 5)
    {
      sum = 0;
    }
    bookHeightPercentage.push(n);
    bookHeights.push(Math.round(n*paneHeight/100));
    sum = sum + bookHeights[i];
    bookHeightsSum.push(sum);
    book.style.height = (bookHeights[i]-2) +  "px";
  }
}

function setBooksColor()
{
  for (let i = 0; i < totalBooks; i++)
  {
    setBookColor(i);
  }
}

function setBookFont(i)
{
  
  let title = document.getElementById("T" + (i+1));
  let author = document.getElementById("A" + (i+1));
  //let label = document.getElementById("L" + (i+1));
  let size = 300;
  
  title.style.fontSize =  size + "%";
  
  let tH = title.offsetHeight - 8;
  let p = title.getElementsByTagName("p")[0];
  while(p.offsetHeight > tH)
  {
    size-=5;
    title.style.fontSize =  size + "%";
  }
  let margin = (title.offsetHeight - p.offsetHeight)/2 - 4;
  p.style.marginTop = margin + "px";


  let authorSize = 160;
  author.style.fontSize = authorSize + "%";
  let aH = author.offsetHeight - 9;
  let aP = author.getElementsByTagName("p")[0];

  while(aP.offsetHeight > aH)
  {
    authorSize-=5;
    author.style.fontSize =  authorSize + "%";
  }
  margin = (author.offsetHeight - aP.offsetHeight)/2 - 2;
  aP.style.marginTop = margin + "px";
}

function setFilterFont(num)
{
  
  let info = document.getElementById("FI" + num);
  let size = 140;
  
  info.style.fontSize =  size + "%";
  
  let iH = info.offsetHeight - 4;
  let p = info.getElementsByTagName("p")[0];

  while(p.offsetHeight > iH)
  {
    size-=5;
    info.style.fontSize =  size + "%";
  }
  let margin = (info.offsetHeight - p.offsetHeight)/2;
  p.style.marginTop = margin + "px";
}

function setBookColor(i)
{

  let book = document.getElementById("B" + (i+1));
  let title = document.getElementById("T" + (i+1));
  let author = document.getElementById("A" + (i+1));
  //let label = document.getElementById("L" + (i+1));
  let stripe = document.getElementById("S" + (i+1));
  let numStr = filteredBookData[i + searchCount].subject[0];
  numStr = numStr.substring(0, 2);
  let colourStr = getColourScheme(numStr);


  let titleColour = colourStr.substring(0, 7);
  let bookColour = colourStr.substring(7, 14);
  let outLineColour = "black";
  let fontColour = colourStr.substring(21, 28);
  let stripeColour = colourStr.substring(14, 21);;
  let authorColour = titleColour;
  //let labelColour = titleColour;

  book.style.backgroundColor = bookColour;
  title.style.backgroundColor = titleColour;
  author.style.backgroundColor = authorColour;
  stripe.style.backgroundColor = stripeColour;

  //label.style.backgroundColor = labelColour;

  stripe.style.borderLeftColor = fontColour;
  stripe.style.borderRightColor = fontColour;

  title.style.color = fontColour;
  author.style.color = fontColour;
  title.style.borderColor = stripeColour;
  author.style.borderColor = stripeColour;
  //label.style.color = fontColour;
  //label.style.borderColor = stripeColour;

  title.style.textShadow = "-1px 1px 2px " + outLineColour + ", 1px 1px 2px " + outLineColour + ", 1px -1px 0 " + outLineColour + ",-1px -1px 0 " + outLineColour;
  

  stripe.innerHTML = '<img style="height: 100%; width: 100%; object-fit: contain; opacity: 0.6;" src="../assets/' + getGenreName(numStr) + '.png"></img>';

}


function setFilterColor(num)
{
  let filterBlock = document.getElementById("F" + num);
  let filterButton = document.getElementById("FB" + num);
  let filterInfo = document.getElementById("FI" + num);

  let colorString = getColourSchemeFromName(sortedSubjectCounts[num-1][0]);
  let titleColor = colorString.substring(0, 7);
  let bookColor = colorString.substring(7, 14);
  let stripeColor = colorString.substring(14, 21);
  let fontColor = colorString.substring(21, 28);

  filterBlock.style.backgroundColor = bookColor;
  filterButton.style.backgroundColor = stripeColor;
  filterInfo.style.color = fontColor;
  filterInfo.style.backgroundColor = titleColor;

  filterButton.style.boxShadow = "0px 0px 0px 2px "  + fontColor + " inset";
  filterInfo.style.boxShadow = "0px 0px 0px 2px "  + stripeColor + " inset";

}

function setBookData(i)
{
  let title = document.getElementById("T" + (i+1));
  let author = document.getElementById("A" + (i+1));
  title.innerHTML = makeTitle("" + filteredBookData[i + searchCount].title);
  author.innerHTML = makeAuthor("" + filteredBookData[i + searchCount].creator);
}

function setFilterText(num)
{
  let info = document.getElementById("FI" + num);
  info.innerHTML = makeTitle("" + sortedSubjectCounts[num-1][0]);
}

function setBooksFont()
{
  for (let i = 0; i < totalBooks; i++)
  {
    setBookFont(i);
  }
}



function initBooks()
{
  paneHeight = document.getElementById("Pane").offsetHeight;
  initBookPos();
  resetInfoPane();
}

function makeTitle(text)
{
  text = text.replaceAll("' ", " ");
  text = text.replaceAll("'- ", " - ");
  text = text.replaceAll(" '", " ");
  text = text.replaceAll('"', '');
  text = text.replaceAll("&quot", "");
  text = text.replaceAll(" :", ":");
  text = text.replaceAll(":  ", ": ");
  text = text.replaceAll(";", "");
  text = text.replace(/ *\([^)]*\) */g, "");
  if (text.indexOf("=") >= 0)
  {
    text = text.substring(text.indexOf("=")+1,text.length);
  }
  let words = text.split(" ");
  let done = false;
  let start = true;
  let title = "<p>";
  let w = "";
  let spacing = " ";
  if (words[0].indexOf("'") == 0)
  {
    words[0] = words[0].substring(1);
  }
  for(let i = 0; i < words.length; i++)
  {
    if (words[i] === " ")
    {
      continue;
    }
    if (words[i] === "/")
    {
      continue;
    }
    if (words[i].indexOf("'") === words[i].length-1 && words[i].indexOf("s") !== words[i].length-2)
    {
      words[i] = words[i].substring(0, words[i].length-1);
    }
    if (i === words.length - 1)
    {
      spacing = "";
    }
    if (i >= 3 && words[i].indexOf(":") >= 0)
    {
      words[i] = words[i].replace(":", "");
      done = true;
      //title += "<a>" + words[i] + "</a>";
      //break;
    }
    else if (words[i].indexOf(":") >= 0)
    {
      title = "<p>";
      start = true;
      continue;
    }


    w = words[i].toLowerCase();
    if (!commonWords.includes(w) && isNaN(w))
    {
      let rest = "";
      if (words[i].length > 1)
      {
        rest = words[i].substring(1);
      }
      title += "<a>" + words[i][0].toUpperCase() + rest + spacing + "</a>";
      start = false;
    }
    else{
      if(start)
      {
        //start = false;
        continue;
      }
      else{
        title += w + "<a>" + spacing + "</a>";
        start = false;
      }
      
    }
    if (done)
    {
      break;
    }
  }

  return title + "</p>";
}

function makeAuthor(author)
{
  let s = author + "";
  let words = s.split(", ");
  let surnames = words[0].split(" "); 
  let surname = "";
  let name = ""
  if (surnames.length > 1)
  {
    for (let i = 0; i < surnames.length; i++)
    {
      surname += surnames[i].substring(0,1) + ". ";
    }
    surname = surname.trim();
  }
  else{
    surname = words[0];
  }

  if (surname.length >= 12)
  {
    surname = surname.substring(0,1) + ". ";
  }
  if (words.length > 1)
  {
    name = words[1].split(" ")[0];
  }
  return "<p>" + name + " " + surname  + "</p>";
}
//44 numstrs when searching computer
function search(args)
{
  subjectCount = {};
  sortedSubjectCounts = [];
  console.log("search");
  let query = "";
  for (i = 0; i < args.length; i++)
  {
    if (commonWords.includes(args[i]) || punctuation.includes(args[i]))
    {
      continue;
    }
    query += "(" + args[i] + "+OR+" + args[i] + "s)+AND+";
  }
  searchCount = 0;
  bookData = [];
  filteredBookData = [];
  sortedSubjectCounts = [];
  
  let queryURL = "http://20.87.26.56:8983/solr/collection1/select?q=" + query + "subject%3A%5B*+TO+*%5D+AND+source_set_names%3A%22Ethos+UK%22+AND+date%3A%5B2000-01-01T00%3A00%3A00Z+TO+NOW%5D&start=" + 0 + "&rows=" + 2000 + "&wt=json&indent=true";
  $.getJSON(queryURL, function(data) {
    let docs = data.response.docs;
    
    for (let i = 0; i < docs.length; i++)
    {

      bookData.push(docs[i]);
      filteredBookData.push(docs[i]);
    }

    bookData = bookData.filter(function(item)
    {
      return ! isNaN(item.subject[0]);
    });

    filteredBookData = filteredBookData.filter(function(item)
    {
      return ! isNaN(item.subject[0]);
    });

    for (let i = 0; i < bookData.length; i++)
    {
      let sub = getGenreName(bookData[i].subject[0].substring(0,2));

      if (!subjectCount[sub])
      {
        subjectCount[sub] = 1;
      }
      else{
        subjectCount[sub] +=1 ;
      }
      
    }
    console.log(subjectCount);

    for (var subject in subjectCount)
    {
      sortedSubjectCounts.push([subject, subjectCount[subject]]);
    }

    sortedSubjectCounts.sort(function(a,b){
      return b[1] - a[1];
    });
    console.log(sortedSubjectCounts);
    setFiltersInPanel();
    setBooks();
  });
}

function setBooks()
{
  setBooksData();
  setBookPos();
  setBookHeights(); 
  setBooksColor();
  setBooksFont();
  makeBooksFall();
  resetInfoPane();
}

function resetFilter()
{
  filters = [];
  filteredBookData = [];
  excludedIndex = -1;
}


function makeSearch()
{
  let s = searchContent.value;
  if (s)
  {
    resetInfoPane();
    resetFilter();
    search(s.split(" "));
    searchContent.value = "";
    searchContent.placeholder = s + "...";
  }
  
}

function next()
{
  resetInfoPane();
  searchCount+=10;
  console.log("next");
  console.log(filteredBookData.length);
  console.log(searchCount);
  if (searchCount < filteredBookData.length)
  {
    setBooks();
  }
  else{
    
    searchCount = (Math.floor((filteredBookData.length - 1)/10))*10;
    console.log("Reached the end: " + searchCount);
  }
}

function previous()
{
  resetInfoPane();
  searchCount-=10;
  console.log("Previous");
  console.log(filteredBookData.length);
  
  if (searchCount >= 0)
  {
    setBooks();
  }
  else{
    console.log("Reached the beginning: ");
    searchCount = 0;
  }
  console.log(searchCount);
}



searchContent.addEventListener("keydown", function (e) {
    if (e.code === "Enter" && searchContent.value) { 
        makeSearch();
    }
});

function setBooksData()
{
  searchCount = Math.min((Math.floor(filteredBookData.length/10))*10, searchCount);
  totalBooks = Math.min(filteredBookData.length - searchCount, 10);
  for (let i = 0; i < totalBooks; i++)
  {
    setBookData(i);
  }
}

function filter(genreName)
{
  if (filters.includes(genreName))
  {
    return;
  }
  filters.push(genreName);
  filteredBookData = bookData.filter(function(val)
  {
    return !filters.includes(getGenreName(val.subject[0].substring(0,2)));
  });

  
  
}

function reFilter(genreName)
{
  if (!filters.includes(genreName))
  {
    return;
  }
  filters = filters.filter(function(val)
  {
    return val !== genreName;
  });

  filteredBookData = bookData.filter(function(val)
  {
    return !filters.includes(getGenreName(val.subject[0].substring(0,2)));
  });
  
}

function toggleFilter(element, num, genreName)
{
  resetInfoPane();
  console.log("Before: " + filters);
  if (!filters.includes(genreName))
  {
    filter(genreName);
    hover(element, genreName);
    document.getElementById("F" + num).style.opacity = 0.3;
    setBooks();
  }
  else{
    reFilter(genreName);
    hover(element, genreName);
    document.getElementById("F" + num).style.opacity = 1;
    setBooks();
  }
  console.log("After: " + filters);
}


function setFiltersInPanel()
{
  let totalFilters = sortedSubjectCounts.length;
  let filterPane = document.getElementById("FilterPane");
  filterPane.innerHTML = "";
  let innerH = "";
  for (let i = 0; i < totalFilters; i++)
  {
    let num = i+1;
    innerH += "<div id = 'F" + num + "' class='Filter'>";

    innerH += "<div id = 'FI" + num +  "' class = 'FilterInfo'></div>"
    + "<div class = 'Shading2'></div>"
    + "<div class = 'ClickA' onclick = 'toggleFilterAll(" + i + ")'></div>"
    + "<button id = 'FB" + num  + "' class= 'FilterButton' >"
    + "<img id = 'FBI" + num + "' src='../assets/" + sortedSubjectCounts[i][0] + ".png' alt='' onmouseover='hover(this, " + '"' +  sortedSubjectCounts[i][0] + '"' + ")' onmouseout='unhover(this, " + '"' + sortedSubjectCounts[i][0] + '"' + ")' onclick='toggleFilter(this, " + num + ', "' + sortedSubjectCounts[i][0] + '"' + ")'>"
   + "</button></div>";
  }
  filterPane.innerHTML = innerH;


  for (let i = 0; i < totalFilters; i++)
  {
    setFilterText((i+1));
    setFilterFont((i+1));
    setFilterColor((i+1));
  }
  
}

function toggleFilterAll(index)
{
  
  if (excludedIndex !== index)
  {
    filterAllExcept(index);
    excludedIndex = index;
    setBooks();
  }
  else{
    filters = [];
    filteredBookData = bookData;
    excludedIndex = -1;
    for (let i = 0; i < sortedSubjectCounts.length; i++)
    {
      document.getElementById("F" + (i+1)).style.opacity = 1;
    }
    setBooks();
  }
}


function filterAllExcept(index)
{
  console.log("FILTERING ALL EXCEPT: " + sortedSubjectCounts[index][0]);
  filters = []
  for (let i = 0; i < sortedSubjectCounts.length; i++)
  {
    if (i===index)
    {
      document.getElementById("F" + (i+1)).style.opacity = 1;
      continue;
    }
    filter(sortedSubjectCounts[i][0]);
    document.getElementById("F" + (i+1)).style.opacity = 0.3;
  }
  
  
}

function hover(element, genreName)
{
  if (filters.includes(genreName))
  {
    element.setAttribute('src', '../assets/Tick.png');
  }
  else
  {
    element.setAttribute('src', '../assets/X.png');
  }
}

function unhover(element, genreName)
{
  element.setAttribute('src', '../assets/'+ genreName +'.png');
}

function hoverBook(element)
{
  element.style.boxShadow = "0px 0px 0px 4px #E0FEFD";
  return;
}

function unhoverBook(element)
{
  console.log(element.id);
  if (bookClickedId === element.id)
  {
    return;
  }
  element.style.boxShadow = "none";
  return;
}

function resetInfoPane()
{
  let cnt = 0;
  bookClickedId = 0;
  infoPanels.forEach(function(info)
  {
    info.style.backgroundColor = "#E0FEFD";
    info.innerHTML = defaultHTML[cnt];
    cnt++;
  });

  for (let i = 0; i < totalBooks; i++)
  {
    let book = document.getElementById("B" + (i+1));
    book.style.opacity = 1;
    book.style.boxShadow = "none";
  }
}


function setInfoTitleFontSize()
{
  let info = document.getElementById("BT");
  let size = 100;
  
  info.style.fontSize =  size + "%";
  
  let iH = info.offsetHeight - 4;
  let h3 = info.getElementsByTagName("h3")[0];
  h3.style.marginTop = 0;
  while(h3.offsetHeight > iH)
  {
    size-=5;
    info.style.fontSize =  size + "%";
  }
  let margin = (info.offsetHeight - h3.offsetHeight)/2;
  h3.style.marginTop = margin + "px";
}

