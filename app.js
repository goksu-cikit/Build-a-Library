// Media class and its subclasses (Book, Movie, CD)
class Media {
  constructor(title) {
    this._title = title;
    this._isCheckedOut = false;
    this._ratings = [];
  }

  get title() {
    return this._title;
  }

  get isCheckedOut() {
    return this._isCheckedOut;
  }

  set isCheckedOut(value) {
    this._isCheckedOut = value;
  }

  get ratings() {
    return this._ratings;
  }

  toggleCheckOutStatus() {
    this._isCheckedOut = !this._isCheckedOut;
  }

  getAverageRating() {
    let totalRates = this._ratings.reduce((a, b) => a + b, 0);
    let ratesLength = this._ratings.length;
    return ratesLength ? Math.floor(totalRates / ratesLength) : 0;
  }

  addRating(...ratings) {
    for (let rating of ratings) {
      if (rating >= 1 && rating <= 5) {
        this._ratings.push(rating);
      } else {
        return "Rating should be between 1 and 5.";
      }
    }
  }
}

class Book extends Media {
  constructor(title, author, pages) {
    super(title);
    this._author = author;
    this._pages = pages;
  }

  get author() {
    return this._author;
  }

  get pages() {
    return this._pages;
  }
}

class Movie extends Media {
  constructor(title, director, runTime) {
    super(title);
    this._director = director;
    this._runTime = runTime;
  }

  get director() {
    return this._director;
  }

  get runTime() {
    return this._runTime;
  }
}

class CD extends Media {
  constructor(title, artist) {
    super(title);
    this._artist = artist;
    this._songs = [];
  }

  get artist() {
    return this._artist;
  }

  get songs() {
    return this._songs;
  }

  addSong(...songs) {
    for (let song of songs) {
      this._songs.push(song);
    }
  }

  shuffle() {
    let songNumber = Math.floor(Math.random() * this._songs.length);
    return this._songs[songNumber];
  }
}

// Catalog class
class Catalog {
  constructor() {
    this._items = [];
  }

  get items() {
    return this._items;
  }

  addItem(item) {
    if (item instanceof Media) {
      this._items.push(item);
    } else {
      return "The item must be an instance of Media!";
    }
  }

  removeItem(index) {
    this._items.splice(index, 1);
  }

  listItems() {
    return this._items.map((item) => item.title).join(", ");
  }
}

// DOM manipulation
document.addEventListener("DOMContentLoaded", () => {
  const mediaTypeSelect = document.getElementById("media-type");
  const additionalFields = document.getElementById("additional-fields");
  const catalogList = document.getElementById("catalog-list");

  mediaTypeSelect.addEventListener("change", (event) => {
    updateAdditionalFields(event.target.value);
  });

  document.getElementById("add-item").addEventListener("click", () => {
    addItemToCatalog();
  });

  document.getElementById("add-rating").addEventListener("click", (e) => {
    e.preventDefault();
    addRating();
  });

  function updateAdditionalFields(mediaType) {
    additionalFields.innerHTML = "";
    switch (mediaType) {
      case "book":
        additionalFields.innerHTML = `
          <div class="form-group">
            <label for="author">Author:</label>
            <input type="text" id="author">
          </div>
          <div class="form-group">
            <label for="pages">Pages:</label>
            <input type="text" id="pages">
          </div>
        `;
        break;
      case "cd":
        additionalFields.innerHTML = `
          <div class="form-group">
            <label for="artist">Artist:</label>
            <input type="text" id="artist">
          </div>
          <div class="form-group">
            <label for="song">Add Song:</label>
            <input type="text" id="song">
            <button id="add-song">Add More Song</button>
            <ul id="song-list"></ul>
          </div>
        `;
        document.getElementById("add-song").addEventListener("click", (e) => {
          e.preventDefault();
          addSong();
        });
        break;
      case "movie":
        additionalFields.innerHTML = `
          <div class="form-group">
            <label for="director">Director:</label>
            <input type="text" id="director">
          </div>
          <div class="form-group">
            <label for="runtime">Run Time:</label>
            <input type="text" id="runtime">
          </div>
        `;
        break;
    }
  }

  const ratings = [];
  function addRating() {
    const rating = parseInt(document.getElementById("rating").value);
    if (rating >= 1 && rating <= 5) {
      ratings.push(rating);
      alert(`Rating ${rating} added.`);
    } else {
      alert("Rating should be between 1 and 5.");
    }
  }

  function addSong() {
    const songInput = document.getElementById("song");
    const songList = document.getElementById("song-list");
    const song = songInput.value;
    if (song) {
      const listItem = document.createElement("li");
      listItem.textContent = song;
      songList.appendChild(listItem);
      songInput.value = "";
    }
  }

  function addItemToCatalog() {
    const title = document.getElementById("title").value;
    const mediaType = mediaTypeSelect.value;
    let newItem;

    switch (mediaType) {
      case "book":
        const author = document.getElementById("author").value;
        const pages = document.getElementById("pages").value;
        newItem = new Book(title, author, parseInt(pages));
        break;
      case "cd":
        const artist = document.getElementById("artist").value;
        newItem = new CD(title, artist);
        document.getElementById("song-list").querySelectorAll("li").forEach((song) => {
          newItem.addSong(song.textContent);
        });
        break;
      case "movie":
        const director = document.getElementById("director").value;
        const runTime = document.getElementById("runtime").value;
        newItem = new Movie(title, director, parseInt(runTime));
        break;
    }

    if (document.getElementById("checked-out-yes").checked) {
      newItem.isCheckedOut = true;
    } else {
      newItem.isCheckedOut = false;
    }

    newItem.addRating(...ratings);

    libsCatalog.addItem(newItem);
    displayCatalog();
    resetForm();
  }

  const libsCatalog = new Catalog();
  function displayCatalog() {
    catalogList.innerHTML = "";
    libsCatalog.items.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        ${item.title} (${item.constructor.name}) - Checked Out: ${item.isCheckedOut} - Average Rating: ${item.getAverageRating()}
        <button onclick="removeItem(${index})">Delete</button>
      `;
      catalogList.appendChild(listItem);
    });
  }

  window.removeItem = (index) => {
    libsCatalog.removeItem(index);
    displayCatalog();
  };

  function resetForm() {
    document.getElementById("title").value = "";
    additionalFields.innerHTML = "";
    document.getElementById("rating").value = "1";
    ratings.length = 0;
    document.getElementById("checked-out-yes").checked = false;
    document.getElementById("checked-out-no").checked = true;
  }
});