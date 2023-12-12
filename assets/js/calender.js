let date = new Date();

// 달력 그려주는 함수
const renderCalendar = () => {
  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth() + 1;

  document.querySelector(
    ".year-month"
  ).textContent = `${viewYear}년 ${viewMonth}월`;

  const prevLast = new Date(viewYear, viewMonth - 1, 0);
  const thisLast = new Date(viewYear, viewMonth, 0);

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
    dateElement.classList.add(condition);
    dateElement.setAttribute("data-date", date);

    const spanElement = document.createElement("span");
    spanElement.textContent = date;

    // 달력에 도장 이미지 넣기
    const stampImage = document.createElement("div");
    stampImage.classList.add("stamp-image");

    dateElement.appendChild(spanElement);
    dateElement.appendChild(stampImage);

    calendarContainer.appendChild(dateElement);
  });

  const today = new Date();
  if (viewMonth === today.getMonth() + 1 && viewYear === today.getFullYear()) {
    const todayElement = calendarContainer.querySelector(
      `.date[data-date="${today.getDate()}"].this`
    );
    if (todayElement) {
      todayElement.classList.add("today");
    }
  }

  // 클릭 이벤트 리스너 업데이트
  updateClickEventListeners();
};

//전월달력
const preMonth = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

//다음월달력
const nextMonth = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

//현재월달력
const goToday = () => {
  date = new Date();
  renderCalendar();
};

///////////////////////////////////////////////////여기부터 손보면 될듯///////////////////////////////////

const updateClickEventListeners = () => {
  const dateElements = document.querySelectorAll(".date");

  dateElements.forEach((dateElement) => {
    // dateElement.removeEventListener("click", handleDateClick);
    dateElement.addEventListener("click", handleDateClick);
  });
};

// 날짜 클릭시 도장 찍기
const handleDateClick = async (event) => {
  if (!event || !event.target) {
    return;
  }

  const clickedDateElement = event.target.closest(".date");
  if (!clickedDateElement) {
    return;
  }

  const dateAttribute = clickedDateElement.getAttribute("data-date");
  const clickedYear = new Date().getFullYear();
  const clickedMonth = document
    .querySelector(".year-month")
    .textContent.split(" ")[1];
  const monthNumber = parseInt(clickedMonth.replace("월", ""), 10);

  //오늘날짜랑 클릭한 날짜 받아오기
  const today = new Date();
  const clickedDate = new Date(clickedYear, monthNumber - 1, dateAttribute);

  // 아직 지나지 않은 날짜인지 확인
  if (clickedDate > today) {
    alert(
      "오늘은 " +
        (today.getMonth() + 1) +
        "월 " +
        today.getDate() +
        "일 입니다. 아직 도전하실 수 없습니다."
    );
    return;
  }

  console.log("Clicked Date Info:", {
    year: clickedYear,
    month: monthNumber,
    date: dateAttribute,
  });

  // 도전 클릭 이벤트 실행
  await handleChallengeClick(
    clickedDateElement,
    clickedYear,
    monthNumber,
    dateAttribute
  );
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
    clickedDateElement.classList.add("clicked");

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
        // 도전 성공시 해당날짜 서버로 보내기
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
          popupMessage = successData.message;
          // 성공하면 도장 보이게 하기
          clickedDateElement.querySelector(".stamp-image").style.display =
            "block";
        } else {
          console.error(
            "서버에서 챌린지 성공 날짜를 저장하는 중에 오류가 발생했습니다."
          );
        }
      }
      alert(popupMessage);
    } else {
      alert("서버에서 데이터를 가져오는 중에 오류가 발생했습니다.");
    }

    // // 클릭한 날짜 상태 저장
    // const clickedDates = JSON.parse(localStorage.getItem("clickedDates")) || [];
    // clickedDates.push(`${clickedYear}-${monthNumber}-${dateAttribute}`);
    // localStorage.setItem("clickedDates", JSON.stringify(clickedDates));
  }
};

//페이지 로드시 자동으로 달력 도장을 불러와서 표시
document.addEventListener("DOMContentLoaded", async () => {
  await fetchAndDisplayStamps();
  renderCalendar();
  updateClickEventListeners();
});

//날짜을 불러와 화면에 표시하는 함수
async function fetchAndDisplayStamps() {
  try {
    // 서버에서 도장 정보 불러오기
    const response = await fetch("challenge/stamps");
    const { dates, userId } = await response.json();

    // 도장이 찍힌 날짜에 해당하는 HTML 요소를 찾아서 스타일을 변경
    dates.forEach((row) => {
      const successDate = new Date(row.success_date);
      successDate.setDate(successDate.getDate() + 1); // 하루를 더함 console로 찍어보니까 전날을 가져옴 근데 디비에는 해당날짜 제대로 들어가 있음
      const formattedDate = successDate.toISOString().split("T")[0]; // 날짜 부분만 추출
      console.log(formattedDate);

      //이게 원래 db에서 불러온 날짜를 달력 날짜에다가 넣는 거.. 근데 이게 제대로 안되는 거 같애애
      const stampElement = document.querySelector(
        `.date[data-date="${formattedDate}"].this`
      );

      //이게 그 날짜에 해당하는 달력이미지 불러오는거..
      if (stampElement) {
        const stampImage = stampElement.querySelector(".stamp-image");

        if (stampImage) {
          stampImage.style.display = "block";
        }
      }
    });
  } catch (error) {
    console.error("날짜 불러오기 중 오류 발생", error);
  }
}
