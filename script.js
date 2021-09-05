const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playlist = $(".playlist");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const songs = $$(".song");
const startTime = $("#start-time");
const durationTime = $("#duration-time");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Độ Tộc 2",
      singer: "Phúc Du, Pháo, Độ Mixi, Masew",
      path: "assets/doctoc2.mp3",
      image: "img/do.jpg",
    },
    {
      name: "Bad Habits",
      singer: "Ed Sheeran",
      path: "assets/public_Assets_BadHabit.mp3",
      image: "img/badh.jpg",
    },
    {
      name: "Hiên Nhà",
      singer: "Linh Cáo",
      path: "assets/public_Assets_HienNha.mp3",
      image: "img/maxresdefault.jpg",
    },
    {
      name: "Leave The Door Open",
      singer: "BrunoMars",
      path: "assets/public_Assets_LeaveTheDoorOpen.mp3",
      image: "img/Leave.jpg",
    },
    {
      name: "To The Moon",
      singer: "Hooligan",
      path: "assets/public_Assets_Tothemoon.mp3",
      image: "img/Moon.jpg",
    },
    {
      name: "What are words",
      singer: "Medina",
      path: "assets/public_Assets_What are words.mp3",
      image: "img/words.jpg",
    },
    {
      name: "Nevada",
      singer: "Vicetone",
      path: "assets/nevada.mp3",
      image: "img/nevada.jpg",
    },
    {
      name: "Counting Stars",
      singer: "OneRepublic",
      path: "assets/count.mp3",
      image: "img/count.jpg",
    },
  ],

  render() {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}" >
          <div
            class="thumb"
            style="
              background-image: url('${song.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`;
    });

    playlist.innerHTML = htmls.join("");
    // this.songs.forEach((song, index) => {
    //   playlist.insertAdjacentHTML(
    //     "beforeend",
    //     `<div class="song" ${index === this.currentIndex ? "active" : ""} >
    //   <div
    //     class="thumb"
    //     style="
    //       background-image: url('${song.image}');
    //     "
    //   ></div>
    //   <div class="body">
    //     <h3 class="title">${song.name}</h3>
    //     <p class="author">${song.singer}</p>
    //   </div>
    //   <div class="option">
    //     <i class="fas fa-ellipsis-h"></i>
    //   </div>
    // </div>`
    //   );
    // });
  },
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    this.render();
    this.scrollToActiveSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    this.render();
    this.scrollToActiveSong();
  },
  playRandomSong() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    } while (randomIndex === this.currentIndex);
    this.currentIndex = randomIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong() {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
  },
  handleEvent() {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    //Xử lý cd quay và dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    //xử lý phóng to thu nhỏ cd
    document.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    });

    //xử lý khi click play
    playBtn.addEventListener("click", () => {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    });
    //Khi song dc play
    audio.addEventListener("play", () => {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    });

    //Khi song dc pause
    audio.addEventListener("pause", () => {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    });

    //Khi tiến độ bài hát thay đổi
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        const currentMinute = Math.floor(audio.currentTime / 60);
        const currentSecond = Math.floor(audio.currentTime % 60);
        startTime.innerHTML = `0${currentMinute}:${
          currentSecond > 9 ? currentSecond : "0" + currentSecond
        }`;

        let duration = audio.duration | 0;
        let minutes = "0" + Math.floor(duration / 60);
        let seconds = "0" + (duration - minutes * 60);
        let dur = minutes.substr(-2) + ":" + seconds.substr(-2);
        durationTime.textContent = dur;
      }
    });
    //Xử lý khi tua
    progress.addEventListener("change", (e) => {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    });
    //Xử lý nút next
    nextBtn.addEventListener("click", () => {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
    });
    //xử lý nút pre
    prevBtn.addEventListener("click", () => {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }

      audio.play();
    });
    //Xử lý next khi audio ended
    // audio.addEventListener("ended", () => {
    //   nextBtn.click();
    // });
    //Xử lý random btn
    randomBtn.addEventListener("click", () => {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active");
    });
    //Hiện nút repeat
    repeatBtn.addEventListener("click", () => {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active");
    });
    //Xử lý repeat và qua bài khi ended
    audio.addEventListener("ended", () => {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    });
    //Lắng nghe hành vi khi click vào playlist
    playlist.addEventListener("click", (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        document.querySelector(".active").classList.remove("active");
        songNode.classList.add("active");
        audio.play();
      }
      if (e.target.closest(".option")) {
      }
    });
  },
  start() {
    //Định nghĩa các thuộc tính cho obj
    this.defineProperties();
    //Xử lý các sự kiện
    this.handleEvent();
    //tải bài hát đầu tiên
    this.loadCurrentSong();
    //Render danh dách bài hát
    this.render();
  },
};

app.start();
