let date = new Date();

const renderCalender = () => {
  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth();

  document.querySelector(".year-month").textContent = `${viewYear}년 ${
    viewMonth + 1
  }월`;

  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);

  const PLDate = prevLast.getDate();
  const PLDay = prevLast.getDay();

  const TLDate = thisLast.getDate();
  const TLDay = thisLast.getDay();

  const prevDates = [];
  const thisDates = [...Array(TLDate + 1).keys()].slice(1);
  const nextDates = [];

  if (PLDay !== 6) {
    for (let i = 0; i < PLDay + 1; i++) {
      prevDates.unshift(PLDate - i);
    }
  }

  for (let i = 1; i < 7 - TLDay; i++) {
    nextDates.push(i);
  }

  const dates = prevDates.concat(thisDates, nextDates);
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(TLDate);

  dates.forEach((date, i) => {
    const condition =
      i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
    dates[
      i
    ] = `<div class="date" data-date="${date}"><span class=${condition}>${date}</span></div>`;
  });

  document.querySelector(".dates").innerHTML = dates.join("");

  const today = new Date();
  if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
    for (let date of document.querySelectorAll(".this")) {
      if (+date.innerText == today.getDate()) {
        date.classList.add("today");
        break;
      }
    }
  }
};

renderCalender();

const preMonth = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalender();
};

const nextMonth = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalender();
};

const goToday = () => {
  date = new Date();
  renderCalender();
};

const handleDateClick = (event) => {
  const clickedDate = event.target.closest(".date").getAttribute("data-date");
  if (clickedDate) {
    alert(`Clicked on date: ${clickedDate}`);
    // 클릭한 날짜동작 여기에 추가
    event.target.closest(".date").classList.add("clicked");
  }
};

// 달력이 렌더링 된 후에 날짜 클릭 이벤트 설정
document.addEventListener("DOMContentLoaded", () => {
  renderCalender();
  const dateElements = document.querySelectorAll(".date");
  dateElements.forEach((dateElement) => {
    dateElement.addEventListener("click", handleDateClick);
  });
});
