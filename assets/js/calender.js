let date = new Date();

const renderCalendar = () => {
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

  const calendarContainer = document.querySelector(".dates");
  calendarContainer.innerHTML = "";

  dates.forEach((date, i) => {
    const condition =
      i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
    const dateElement = document.createElement("div");
    dateElement.classList.add("date");
    dateElement.setAttribute("data-date", date);

    const spanElement = document.createElement("span");
    spanElement.classList.add(condition);
    spanElement.textContent = date;

    // 달력에 도장 이미지 넣기
    const stampImage = document.createElement("div");
    stampImage.classList.add("stamp-image");

    dateElement.appendChild(spanElement);
    dateElement.appendChild(stampImage);

    calendarContainer.appendChild(dateElement);
  });

  const today = new Date();
  if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
    const todayElement = calendarContainer.querySelector(
      `.date[data-date="${today.getDate()}"].today`
    );
    if (todayElement) {
      todayElement.classList.add("today");
    }
  }
};

renderCalendar();

const preMonth = (event) => {
  event.preventDefault();
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

const nextMonth = (event) => {
  event.preventDefault();
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

const goToday = (event) => {
  event.preventDefault();
  date = new Date();
  renderCalendar();
};

// 날짜 클릭 이벤트
const handleDateClick = async (event) => {
  const clickedDateElement = event.target.closest(".date");
  if (!clickedDateElement) {
    return;
  }

  const dateAttribute = clickedDateElement.getAttribute("data-date");
  const clickedYear = new Date().getFullYear();

  //년하고 월 분리하기
  const clickedMonth = document
    .querySelector(".year-month")
    .textContent.split(" ")[1];

  // 월을 받아올때 숫자말고 한글도 같이 받아와서 월 없애기
  const monthNumber = parseInt(clickedMonth.replace("월", ""), 10);

  const clickedDateObj = new Date(
    `${clickedYear}-${monthNumber}-${dateAttribute}`
  );

  const today = new Date();

  // 아직 지나지 않은 날짜 클릭시
  if (clickedDateObj > today) {
    alert(
      `오늘은 ${
        today.getMonth() + 1
      }월 ${today.getDate()}일 입니다. 아직 도장을 받을 수 없습니다.`
    );
  } else {
    handleChallengeClick(
      clickedDateElement,
      clickedYear,
      monthNumber,
      dateAttribute
    );
  }
};

const handleChallengeClick = async (
  clickedDateElement,
  clickedYear,
  monthNumber,
  dateAttribute
) => {
  const confirmation = confirm(
    `${clickedYear}년 ${monthNumber}월 ${dateAttribute}일 만원챌린지 도전하시겠습니까?`
  );

  if (confirmation) {
    try {
      // 서버에 해당 날짜의 price 값을 가져오는 요청
      const response = await fetch("/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: `${clickedYear}-${monthNumber}-${dateAttribute}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        let popupMessage = "";

        if (data.isOver10000) {
          popupMessage = "풉ㅋ 챌리지에 실패하셨습니다.";
        } else {
          // 여기에 챌린지 성공 날짜를 서버에 저장하는 요청 추가
          const successResponse = await fetch("/challenge/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              successDate: `${clickedYear}-${monthNumber}-${dateAttribute}`,
            }),
          });

          if (successResponse.ok) {
            const successData = await successResponse.json();
            // 성공한 경우의 추가적인 처리 또는 메시지 표시
            console.log(successData.message);
          } else {
            console.error(
              "서버에서 챌린지 성공 날짜를 저장하는 중에 오류가 발생했습니다."
            );
          }
          // 성공하면 도장 보이게 하기
          clickedDateElement.querySelector(".stamp-image").style.display =
            "block";
        }

        alert(popupMessage);
      } else {
        alert("서버에서 데이터를 가져오는 중에 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(
        "클라이언트에서 챌린지 도전을 처리하는 중에 오류가 발생했습니다.",
        error
      );
    }
  }
};

// 클릭 이벤트 리스너 설정
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  const dateElements = document.querySelectorAll(".date");
  dateElements.forEach((dateElement) => {
    dateElement.addEventListener("click", handleDateClick);
  });
});
