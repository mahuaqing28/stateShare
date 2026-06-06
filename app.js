const fallbackData = {
  owner: "2049",
  today: "",
  tagline: "把今天排成能真实发生的形状。",
  updatedAt: "手动更新",
  today_bgm: "Night Drive - 2049 Radio",
  funnyStatus: "今日系统在线，准备按计划推进。",
  schedule: [
    {
      date: "",
      title: "整理今日目标",
      type: "TIME_BLOCK",
      start_time: "09:30",
      end_time: "10:00",
    },
    {
      date: "",
      title: "深度工作",
      type: "TIME_BLOCK",
      start_time: "14:00",
      end_time: "16:00",
    },
    {
      date: "",
      title: "复盘和同步",
      type: "FLOATING",
    },
  ],
};

const $ = (selector) => document.querySelector(selector);

const formatToday = (dateValue) => {
  const date = dateValue ? new Date(`${dateValue}T00:00:00+08:00`) : new Date();
  if (Number.isNaN(date.getTime())) return dateValue || "今天";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
};

const scheduleItems = (data) => (Array.isArray(data.schedule) ? data.schedule : []);

const isTimeBlock = (item) => item.type === "TIME_BLOCK" && Boolean(item.start_time);

const timeRange = (item) => {
  if (item.start_time && item.end_time) return `${item.start_time} - ${item.end_time}`;
  return item.start_time || item.end_time || "--:--";
};

const renderTimeline = (items) => {
  const list = $("#timeline-list");
  list.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "今天没有固定时间块。";
    list.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    const time = document.createElement("time");
    const title = document.createElement("strong");

    li.className = "timeline-item";
    time.className = "time-block";
    time.textContent = timeRange(item);
    title.textContent = item.title || "未命名日程";

    li.append(time, title);
    list.appendChild(li);
  });
};

const renderFloating = (items) => {
  const list = $("#floating-list");
  list.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "今天没有浮动安排。";
    list.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    const title = document.createElement("strong");
    const badge = document.createElement("span");

    li.className = "floating-item";
    title.textContent = item.title || "未命名日程";
    badge.className = "type-badge";
    badge.textContent = item.type || "FLOATING";

    li.append(title, badge);
    list.appendChild(li);
  });
};

const render = (data) => {
  const schedule = scheduleItems(data);
  const timeBlocks = schedule.filter(isTimeBlock).sort((left, right) =>
    timeRange(left).localeCompare(timeRange(right))
  );
  const floating = schedule.filter((item) => !isTimeBlock(item));

  $("#today-label").textContent = formatToday(data.today);
  $("#page-title").textContent = `${data.owner || "2049"}的今日状态`;
  $("#tagline").textContent = data.tagline || fallbackData.tagline;
  $("#last-updated").textContent = data.updatedAt ? `更新：${data.updatedAt}` : "更新：刚刚";
  $("#bgm-value").textContent = data.today_bgm || fallbackData.today_bgm;
  $("#schedule-value").textContent = `${timeBlocks.length} 个时间块`;
  $("#floating-value").textContent = `${floating.length} 个浮动项`;
  $("#funny-status").textContent = data.funnyStatus || fallbackData.funnyStatus;
  $("#timeline-count").textContent = `${timeBlocks.length} 项`;
  $("#floating-count").textContent = `${floating.length} 项`;

  renderTimeline(timeBlocks);
  renderFloating(floating);

  const shareText = `${formatToday(data.today)}｜${data.owner || "2049"}：${data.funnyStatus || fallbackData.funnyStatus} 固定时间块 ${timeBlocks.length} 个，浮动安排 ${floating.length} 个。`;
  $("#share-text").textContent = shareText;
  $("#copy-button").onclick = async () => {
    await navigator.clipboard.writeText(shareText);
    $("#copy-button").textContent = "已复制";
    window.setTimeout(() => {
      $("#copy-button").textContent = "复制状态";
    }, 1400);
  };
};

fetch("data/status.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Status data not found");
    return response.json();
  })
  .then(render)
  .catch(() => render(fallbackData));
