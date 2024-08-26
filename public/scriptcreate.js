
async function getsongs(playlist = "/api/users/guest/songs") {
    try {
        let response = await fetch(`${playlist}`);
        let songList = await response.json();
        songs = songList.map(song => {
            let a = document.createElement('a');
            a.href = `/Songs/songs/${song}`;
            a.innerText = song;
            return a;
        });
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

async function getThumbnails() {
    try {
        let response = await fetch('/api/thumbnails/songs');
        let thumbList = await response.json();
        thumb = thumbList.map(thumbFile => {
            let a = document.createElement('a');
            a.href = `/Thumbnail/Songs/${thumbFile}`;
            a.innerText = thumbFile;
            return a;
        });
    } catch (error) {
        console.error('Error fetching thumbnails:', error);
    }
}

async function mapthumb(songname) {
    await getThumbnails()
    for (i = 0; i < thumb.length; i++) {
        if (thumb[i].innerText.replace('.jpeg', '') === songname.replace('.mp3', '')) {
            return thumb[i].href
        }
    }
    return ""
}
async function create(){
    await getsongs()
    for (let index = 0; index < songs.length; index++) {
        let child = document.createElement('div');
        child.className = 'list';
        child.innerHTML = `
        <img id='thumbnail' src=${await mapthumb(songs[index].innerText)}>
        <ul>
            <li class='song' name='song'>${songs[index].innerText}</li>
        </ul>
        <div class='addbuttons'>
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="play"  data-index="${index}">
        <!-- Green circle -->
        <circle cx="50" cy="50" r="40" fill="green" />

        <!-- Black plus -->
        <line x1="50" y1="30" x2="50" y2="70" stroke="black" stroke-width="8"/>
        <line x1="30" y1="50" x2="70" y2="50" stroke="black" stroke-width="8"/>
        </svg>
        </div>`;

        let div = document.querySelector('.songs');
        div.appendChild(child);
    }
    
    document.querySelector('.songs').addEventListener('click', function (event) {
        const playbutton = event.target.closest('.play')
        if (playbutton) {
            
            let index = playbutton.getAttribute('data-index');
            playbutton.style.pointerEvents = 'none';
            playbutton.style.display = 'none';
            fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Song: songs[index].innerText })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        }
    });
}
create()