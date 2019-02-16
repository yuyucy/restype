const typeStart = () => {
  const resourceArr = ["hoge", "alert(1)", "piyo"];

  const categoryTitleSection = document.querySelector("#categoryTitle");
  const resourceSection = document.querySelector("#resourceSection");
  const numeratorSection = document.querySelector("#numerator");
  const denominatorSection = document.querySelector("#denominator");
  const onKeyViewSection = document.querySelector("#onKeyView");
  const timerSection = document.querySelector("#timerSection");

  const categoryTitle = "javaScript";

  let currentIndex = 0;
  let currentStr = resourceArr[currentIndex];

  let minutes = 0;
  let second = 0;
  let miliSecond = 0;

  numeratorSection.textContent = currentIndex + 1;
  resourceSection.innerHTML = currentStr;
  denominatorSection.textContent = resourceArr.length;
  categoryTitleSection.textContent = categoryTitle;

  let typeTimer = setInterval(() => {
    timeCount();
  }, 10);

  document.addEventListener("keydown", event => {
    let correctStr = getTopStr();
    if (correctStr === event.key) {
      deleteStrTop();
      reloadStr();
      onKeyViewSection.className = "correct";
    } else {
      onKeyViewSection.className = "wrong";
    }
    onKeyViewSection.textContent = event.key;
  });

  const getTopStr = () => {
    return currentStr[0];
  };

  const deleteStrTop = () => {
    currentStr = currentStr.slice(1);
  };

  const reloadStr = () => {
    if (currentStr === "") {
      if (currentIndex === resourceArr.length - 1) {
        resourceSection.innerHTML = "終了";
        clearInterval(typeTimer);
        return;
      }
      currentIndex++;
      currentStr = resourceArr[currentIndex];
      numeratorSection.textContent = currentIndex + 1;
    }
    resourceSection.innerHTML = currentStr;
  };

  const timeCount = () => {
    miliSecond++;
    if (miliSecond >= 100) {
      miliSecond = 0;
      second++;
    }
    if (second >= 60) {
      second = 0;
      minutes++;
    }
    timerSection.textContent = `${String(minutes).padStart(2, "0")}:${String(
      second
    ).padStart(2, "0")}:${String(miliSecond).padStart(2, "0")}`;
  };
};

window.onload = () => {
  const php = document.getElementById("php");
  const javascript = document.getElementById("javascript");
  const git = document.getElementById("git");
  const page1 = document.getElementById("page1");
  const page2 = document.getElementById("page2");


  let categoryTitle = "javaScript";
  let resourceArr = ["hoge", "alert(1)", "piyo"];

  function getSpredSheet(sheetName){
    var drId = "ya29.GluyBuOa9CrqHNFidTgi73yeQfYITDfveEgb18W_S09XkCY9tMJkyepafSH3AK7jKFzYIK7i24sFjY2xwAuzn_m1vyJr0eSKMgD34l_jWzowY2uRLIqkmCo4oc04";
    var id = "1l_NHPgWRPn3SW3sISYduJlNtuCZ_hwEpCz0KEPxs7EM";
    var key = "AIzaSyAoAq0sWyXejYc-eYv9fOm162Z7hoXudmc";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheetName}!A:A`, false);
    xhr.setRequestHeader('Authorization', `Bearer ${drId}`);
    xhr.send();
    res = (JSON.parse(xhr.response));
    var wordArr = [];
    for (var key in res.values) {
        if(res.values[key].length){
            wordArr.push(res.values[key][0]);
        }
    }
    console.log(wordArr)
    resourceArr = wordArr;
    typeStart();
}

  function changePage() {
    page1.style = "display:none;";
    page2.style = "display:;";
  }
  php.addEventListener(
    "click",
    function() {
      console.log("php");
      categoryTitle = "PHP";
      changePage();
      getSpredSheet("php");
    },
    false
  );
  javascript.addEventListener(
    "click",
    function() {
      console.log("js");
      categoryTitle = "JavaScript";
      changePage();
      getSpredSheet("JavaScript");
    },
    false
  );
  git.addEventListener(
    "click",
    function() {
      console.log("git");
      categoryTitle = "git";
      changePage();
      getSpredSheet("git");
    },
    false
  );

  const typeStart = () => {  
    const categoryTitleSection = document.querySelector("#categoryTitle");
    const resourceSection = document.querySelector("#resourceSection");
    const numeratorSection = document.querySelector("#numerator");
    const denominatorSection = document.querySelector("#denominator");
    const onKeyViewSection = document.querySelector("#onKeyView");
    const timerSection = document.querySelector("#timerSection");
  
  
    let currentIndex = 0;
    let currentStr = resourceArr[currentIndex];
  
    let minutes = 0;
    let second = 0;
    let miliSecond = 0;
  
    numeratorSection.textContent = currentIndex + 1;
    resourceSection.innerHTML = currentStr;
    denominatorSection.textContent = resourceArr.length;
    categoryTitleSection.textContent = categoryTitle;
  
    let typeTimer = setInterval(() => {
      timeCount();
    }, 10);
  
    document.addEventListener("keydown", event => {
      let correctStr = getTopStr();
      if (correctStr === event.key) {
        deleteStrTop();
        reloadStr();
        onKeyViewSection.className = "correct";
      } else {
        onKeyViewSection.className = "wrong";
      }
      onKeyViewSection.textContent = event.key;
    });
  
    const getTopStr = () => {
      return currentStr[0];
    };
  
    const deleteStrTop = () => {
      currentStr = currentStr.slice(1);
    };
  
    const reloadStr = () => {
      if (currentStr === "") {
        if (currentIndex === resourceArr.length - 1) {
          resourceSection.innerHTML = "終了";
          clearInterval(typeTimer);
          return;
        }
        currentIndex++;
        currentStr = resourceArr[currentIndex];
        numeratorSection.textContent = currentIndex + 1;
      }
      resourceSection.innerHTML = currentStr;
    };
  
    const timeCount = () => {
      miliSecond++;
      if (miliSecond >= 100) {
        miliSecond = 0;
        second++;
      }
      if (second >= 60) {
        second = 0;
        minutes++;
      }
      timerSection.textContent = `${String(minutes).padStart(2, "0")}:${String(
        second
      ).padStart(2, "0")}:${String(miliSecond).padStart(2, "0")}`;
    };
  };
};
